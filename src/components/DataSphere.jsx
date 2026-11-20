import { useEffect, useRef } from 'react';

/**
 * 3D data sphere drawn on a 2D canvas.
 * Fibonacci-distributed points, precomputed neighbour links, travelling pulses
 * along neural pathways, and mouse-driven rotation with inertia.
 */
export default function DataSphere({ points = 1400, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2), raf;

    const N = window.innerWidth < 640 ? Math.round(points * 0.55) : points;
    const pts = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const t = golden * i;
      const jitter = 1 + (Math.random() - 0.5) * 0.04;
      pts.push({ x: Math.cos(t) * r * jitter, y: y * jitter, z: Math.sin(t) * r * jitter, hue: Math.random() });
    }
    // links: connect each node to its 2 nearest neighbours (sampled subset to keep it light)
    const links = [];
    for (let i = 0; i < N; i += 3) {
      const a = pts[i];
      const near = [];
      for (let j = 0; j < N; j++) {
        if (j === i) continue;
        const b = pts[j];
        const d = (a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2;
        if (d < 0.012) near.push([d, j]);
      }
      near.sort((p, q) => p[0] - q[0]);
      near.slice(0, 2).forEach(([, j]) => links.push([i, j]));
    }
    // long "neural pathways": great-circle-ish arcs between random nodes
    const arcs = Array.from({ length: 14 }, () => ({
      a: pts[(Math.random() * N) | 0],
      b: pts[(Math.random() * N) | 0],
      t: Math.random(),
      speed: 0.002 + Math.random() * 0.004,
      color: ['#22D3EE', '#8B5CF6', '#10B981', '#60A5FA'][(Math.random() * 4) | 0],
    }));

    let rotY = 0, rotX = -0.25, vy = 0.0022, vx = 0, targetX = -0.25, mouse = null;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse = { x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 };
    };
    const onLeave = () => (mouse = null);
    window.addEventListener('pointermove', onMove, { passive: true });
    canvas.addEventListener('pointerleave', onLeave);

    const project = (p, R, cx, cy, cyR, syR, cxR, sxR) => {
      // rotate around Y then X
      let x = p.x * cyR - p.z * syR;
      let z = p.x * syR + p.z * cyR;
      let y = p.y * cxR - z * sxR;
      z = p.y * sxR + z * cxR;
      const persp = 2.6 / (2.6 - z);
      return { X: cx + x * R * persp, Y: cy + y * R * persp, z, s: persp };
    };

    const slerp = (a, b, t) => {
      const x = a.x + (b.x - a.x) * t, y = a.y + (b.y - a.y) * t, z = a.z + (b.z - a.z) * t;
      const l = Math.hypot(x, y, z) || 1;
      const lift = 1 + Math.sin(Math.PI * t) * 0.18;
      return { x: (x / l) * lift, y: (y / l) * lift, z: (z / l) * lift };
    };

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      if (mouse) {
        vy += (mouse.x * 0.02 - vy) * 0.04;
        targetX = -0.25 + mouse.y * 0.6;
      } else vy += (0.0022 - vy) * 0.02;
      rotY += reduce ? 0.0006 : vy;
      rotX += (targetX - rotX) * 0.05;

      ctx.clearRect(0, 0, w, h);
      const R = Math.min(w, h) * 0.36, cx = w / 2, cy = h / 2;
      const cyR = Math.cos(rotY), syR = Math.sin(rotY), cxR = Math.cos(rotX), sxR = Math.sin(rotX);

      // core glow
      const g = ctx.createRadialGradient(cx, cy, R * 0.1, cx, cy, R * 1.5);
      g.addColorStop(0, 'rgba(99,102,241,0.28)');
      g.addColorStop(0.5, 'rgba(34,211,238,0.07)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      const P = pts.map((p) => project(p, R, cx, cy, cyR, syR, cxR, sxR));

      ctx.lineWidth = 0.6;
      for (const [i, j] of links) {
        const a = P[i], b = P[j];
        const depth = (a.z + b.z) / 2;
        if (depth < -0.6) continue;
        ctx.strokeStyle = `rgba(125,160,255,${0.05 + (depth + 1) * 0.12})`;
        ctx.beginPath(); ctx.moveTo(a.X, a.Y); ctx.lineTo(b.X, b.Y); ctx.stroke();
      }

      for (let i = 0; i < N; i++) {
        const p = P[i], src = pts[i];
        const a = 0.15 + ((p.z + 1) / 2) * 0.85;
        const size = 0.5 + ((p.z + 1) / 2) * 1.5;
        const col = src.hue < 0.45 ? '34,211,238' : src.hue < 0.8 ? '139,92,246' : src.hue < 0.93 ? '96,165,250' : '16,185,129';
        ctx.fillStyle = `rgba(${col},${a})`;
        ctx.fillRect(p.X - size / 2, p.Y - size / 2, size, size);
      }

      // neural pathways with pulses
      for (const arc of arcs) {
        arc.t += reduce ? 0 : arc.speed;
        if (arc.t > 1) {
          arc.t = 0; arc.a = arc.b; arc.b = pts[(Math.random() * N) | 0];
        }
        ctx.strokeStyle = arc.color + '33';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let s = 0; s <= 24; s++) {
          const q = project(slerp(arc.a, arc.b, s / 24), R, cx, cy, cyR, syR, cxR, sxR);
          s ? ctx.lineTo(q.X, q.Y) : ctx.moveTo(q.X, q.Y);
        }
        ctx.stroke();
        const head = project(slerp(arc.a, arc.b, arc.t), R, cx, cy, cyR, syR, cxR, sxR);
        const hg = ctx.createRadialGradient(head.X, head.Y, 0, head.X, head.Y, 10);
        hg.addColorStop(0, arc.color);
        hg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = hg;
        ctx.beginPath(); ctx.arc(head.X, head.Y, 10, 0, Math.PI * 2); ctx.fill();
      }

      // equatorial orbit rings
      ctx.lineWidth = 1;
      [1.18, 1.32].forEach((k, idx) => {
        ctx.strokeStyle = idx ? 'rgba(16,185,129,0.18)' : 'rgba(139,92,246,0.22)';
        ctx.beginPath();
        ctx.ellipse(cx, cy, R * k, R * k * 0.28, idx ? -0.35 : 0.25, 0, Math.PI * 2);
        ctx.stroke();
      });
    };
    frame();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect(); io.disconnect();
      window.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
    };
  }, [points]);

  return <canvas ref={ref} className={`h-full w-full ${className}`} aria-label="Animated sphere of interconnected data points" role="img" />;
}

/** Lightweight 2D particle network used for the final CTA section. */
export function ParticleField({ className = '', density = 0.00009 }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current, ctx = c.getContext('2d');
    let w, h, raf, parts = [], mouse = { x: -999, y: -999 };
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const init = () => {
      const r = c.getBoundingClientRect();
      w = r.width; h = r.height; c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(140, Math.round(w * h * density));
      parts = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35, c: ['34,211,238', '139,92,246', '16,185,129'][(Math.random() * 3) | 0] }));
    };
    init();
    const ro = new ResizeObserver(init); ro.observe(c);
    const mv = (e) => { const r = c.getBoundingClientRect(); mouse = { x: e.clientX - r.left, y: e.clientY - r.top }; };
    c.addEventListener('pointermove', mv);
    const loop = () => {
      raf = requestAnimationFrame(loop);
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (dm < 120) { p.x += (p.x - mouse.x) / dm; p.y += (p.y - mouse.y) / dm; }
      }
      for (let i = 0; i < parts.length; i++) {
        const a = parts[i];
        for (let j = i + 1; j < parts.length; j++) {
          const b = parts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 130) { ctx.strokeStyle = `rgba(${a.c},${(1 - d / 130) * 0.35})`; ctx.lineWidth = 0.7; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
        }
        ctx.fillStyle = `rgba(${a.c},0.9)`; ctx.beginPath(); ctx.arc(a.x, a.y, 1.6, 0, 7); ctx.fill();
      }
    };
    loop();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); c.removeEventListener('pointermove', mv); };
  }, []);
  return <canvas ref={ref} className={`absolute inset-0 h-full w-full ${className}`} aria-hidden="true" />;
}
