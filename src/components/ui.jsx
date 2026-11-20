import { useEffect, useRef, useState } from 'react';
import { motion, useInView, animate, useReducedMotion } from 'framer-motion';
import { ArrowRight, BarChart3, BedDouble, BrainCircuit, Briefcase, Bug, Building2, Calculator, Car, Cpu, Droplets, Globe2, Hammer, HardHat, Home, KeyRound, Layers, LayoutDashboard, Network, ShoppingCart, Sparkles, Store, Thermometer, Trees, TrendingUp, Users, BadgeCheck, Eye, Filter, Inbox, Leaf, Lock, Server, Trash2, Circle, FlaskConical, Info } from 'lucide-react';
const Icons = { ArrowRight, BarChart3, BedDouble, BrainCircuit, Briefcase, Bug, Building2, Calculator, Car, Cpu, Droplets, Globe2, Hammer, HardHat, Home, KeyRound, Layers, LayoutDashboard, Network, ShoppingCart, Sparkles, Store, Thermometer, Trees, TrendingUp, Users, BadgeCheck, Eye, Filter, Inbox, Leaf, Lock, Server, Trash2, Circle, FlaskConical, Info };

export const Icon = ({ name, ...p }) => {
  const C = Icons[name] || Icons.Circle;
  return <C {...p} />;
};

export function Logo({ size = 34, withText = true, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
        <defs>
          <linearGradient id="qg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8B5CF6" />
            <stop offset=".5" stopColor="#3B82F6" />
            <stop offset="1" stopColor="#22D3EE" />
          </linearGradient>
          <linearGradient id="qg2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#22D3EE" />
            <stop offset="1" stopColor="#10B981" />
          </linearGradient>
        </defs>
        {/* hexagonal lattice: six outer nodes, a core, and a tail that resolves into a Q */}
        <path d="M24 5 L40.5 14.5 L40.5 33.5 L24 43 L7.5 33.5 L7.5 14.5 Z" fill="none" stroke="url(#qg)" strokeWidth="2.6" strokeLinejoin="round" />
        <path d="M24 5 L24 24 M7.5 14.5 L24 24 M40.5 14.5 L24 24 M7.5 33.5 L24 24" stroke="url(#qg)" strokeWidth="1.6" opacity=".75" />
        <path d="M24 24 L44 44" stroke="url(#qg2)" strokeWidth="3.2" strokeLinecap="round" />
        {[[24, 5], [40.5, 14.5], [40.5, 33.5], [24, 43], [7.5, 33.5], [7.5, 14.5]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.6" fill="#fff" />
        ))}
        <circle cx="24" cy="24" r="4.2" fill="url(#qg2)" />
      </svg>
      {withText && (
        <span className="font-display font-semibold tracking-tight text-[1.08rem] leading-none">
          Quant<span className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">oxi</span>
        </span>
      )}
    </span>
  );
}

export function Reveal({ children, delay = 0, y = 24, className = '', as = 'div' }) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </M>
  );
}

export function formatNumber(n, { compact = false, decimals = 0 } = {}) {
  if (compact && n >= 1e6) return (n / 1e6).toFixed(n % 1e6 === 0 ? 0 : 1) + 'M';
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function Counter({ value, prefix = '', suffix = '', compact, decimals = 0, duration = 2 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduce) return setV(value);
    const c = animate(0, value, { duration, ease: [0.16, 1, 0.3, 1], onUpdate: setV });
    return () => c.stop();
  }, [inView, value]);
  return (
    <span ref={ref}>
      {prefix}
      {formatNumber(decimals ? v : Math.round(v), { compact, decimals })}
      {suffix}
    </span>
  );
}

/** Animated currency figure that tweens between values. */
export function Money({ value, className = '' }) {
  const [v, setV] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    const c = animate(prev.current, value, { duration: 0.6, ease: 'easeOut', onUpdate: setV });
    prev.current = value;
    return () => c.stop();
  }, [value]);
  return (
    <span className={className}>
      ${v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </span>
  );
}

export function Eyebrow({ children, light }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] ${
        light ? 'bg-violet-50 text-violet-700 ring-1 ring-violet-200' : 'bg-white/5 text-cyan-200 ring-1 ring-white/10'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${light ? 'bg-violet-500' : 'bg-cyan-300'}`} />
      {children}
    </span>
  );
}

export function SectionHeader({ eyebrow, title, sub, light, center = true }) {
  return (
    <div className={`${center ? 'mx-auto text-center' : ''} max-w-3xl`}>
      <Reveal>{eyebrow && <Eyebrow light={light}>{eyebrow}</Eyebrow>}</Reveal>
      <Reveal delay={0.05}>
        <h2 className={`mt-5 font-display text-3xl font-semibold tracking-tight sm:text-5xl ${light ? 'text-slate-900' : 'text-white'}`}>{title}</h2>
      </Reveal>
      {sub && (
        <Reveal delay={0.1}>
          <p className={`mt-5 text-lg leading-relaxed ${light ? 'text-slate-600' : 'text-slate-300'}`}>{sub}</p>
        </Reveal>
      )}
    </div>
  );
}

export function Button({ children, variant = 'primary', className = '', icon, ...p }) {
  const base = 'group relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-midnight-950 disabled:opacity-40 disabled:cursor-not-allowed';
  const styles = {
    primary: 'text-white bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 shadow-[0_8px_30px_-6px_rgba(99,102,241,.65)] hover:shadow-[0_10px_40px_-4px_rgba(34,211,238,.6)] hover:-translate-y-0.5',
    ghost: 'text-white bg-white/5 ring-1 ring-white/15 hover:bg-white/10 backdrop-blur',
    light: 'text-slate-900 bg-white ring-1 ring-slate-200 hover:ring-slate-300 hover:-translate-y-0.5',
    green: 'text-midnight-950 bg-gradient-to-r from-emerald-400 to-cyan-300 hover:-translate-y-0.5 shadow-[0_8px_30px_-6px_rgba(16,185,129,.6)]',
  };
  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...p}>
      {children}
      {icon && <Icon name={icon} size={16} className="transition group-hover:translate-x-0.5" />}
    </button>
  );
}

export function Glass({ children, className = '', ...p }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,.06)] ${className}`} {...p}>
      {children}
    </div>
  );
}

export function DemoTag({ children = 'Illustrative', className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-md bg-amber-400/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-amber-300 ring-1 ring-amber-400/30 ${className}`}>
      <Icons.FlaskConical size={11} /> {children}
    </span>
  );
}

export function PrototypeNotice({ children, light }) {
  return (
    <div className={`flex gap-3 rounded-xl p-4 text-sm ${light ? 'bg-amber-50 text-amber-900 ring-1 ring-amber-200' : 'bg-amber-400/[0.07] text-amber-100 ring-1 ring-amber-300/20'}`} role="note">
      <Icons.Info size={18} className="mt-0.5 shrink-0" />
      <div>{children}</div>
    </div>
  );
}

export const go = (hash) => {
  window.location.hash = hash ? hash : '';
  if (!hash) history.replaceState(null, '', window.location.pathname + window.location.search);
  window.dispatchEvent(new HashChangeEvent('hashchange'));
};

export const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};
