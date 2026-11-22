import { useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, ChevronDown, Calculator as CalcIcon, Info, UserPlus, FileSpreadsheet, ShieldCheck, Wallet, Check } from 'lucide-react';
import DataSphere from './DataSphere';
import { Button, Counter, Eyebrow, Glass, Icon, Money, Reveal, SectionHeader, go, scrollToId } from './ui';
import { dataRates, industries, recordRange, stats, statsMode, currency, fmtRate } from '../config/siteConfig';

/* ---------------------------------- HERO ---------------------------------- */
const FLOATERS = [
  { label: 'Artificial Intelligence', icon: 'BrainCircuit', pos: 'left-[2%] top-[14%]', c: '#8B5CF6', d: 0 },
  { label: 'Predictive Analytics', icon: 'TrendingUp', pos: 'right-[0%] top-[8%]', c: '#22D3EE', d: 1.2 },
  { label: 'Market Intelligence', icon: 'Globe2', pos: 'right-[-2%] top-[54%]', c: '#10B981', d: 2.1 },
  { label: 'Machine Learning', icon: 'Network', pos: 'left-[-2%] top-[62%]', c: '#60A5FA', d: 0.6 },
  { label: 'Data Processing', icon: 'Cpu', pos: 'left-[30%] bottom-[0%]', c: '#A78BFA', d: 1.7 },
];

export function Hero() {
  const mx = useMotionValue(0.5), my = useMotionValue(0.3);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 }), sy = useSpring(my, { stiffness: 60, damping: 20 });
  const bg = useTransform([sx, sy], ([x, y]) => `radial-gradient(600px circle at ${x * 100}% ${y * 100}%, rgba(139,92,246,.22), transparent 60%), radial-gradient(500px circle at ${100 - x * 60}% ${80 - y * 40}%, rgba(34,211,238,.14), transparent 60%)`);
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width); my.set((e.clientY - r.top) / r.height);
  };

  return (
    <section id="top" onPointerMove={onMove} className="relative overflow-hidden bg-midnight-950 pb-20 pt-32 sm:pt-36 lg:pb-28">
      <motion.div className="pointer-events-none absolute inset-0" style={{ background: bg }} />
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-[0.35]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 lg:grid-cols-[1.05fr_1fr] lg:gap-4">
        <div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 font-mono text-[11px] tracking-[0.2em] text-cyan-100">
              <span className="relative flex h-2 w-2"><span className="absolute inset-0 animate-pulseRing rounded-full bg-emerald-400" /><span className="relative h-2 w-2 rounded-full bg-emerald-400" /></span>
              POWERING THE NEXT GENERATION OF AI
              <span className="badge-sheen absolute inset-0" />
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-7 font-display text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.03em] text-white sm:text-6xl xl:text-7xl"
          >
            Your Business Data.
            <br />
            <span className="text-gradient-anim">Extraordinary Possibilities.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.25 }} className="mt-7 max-w-xl text-lg leading-relaxed text-slate-300">
            Unlock the hidden value of your business data. Join a new generation of businesses contributing to artificial intelligence research and market intelligence while earning revenue from eligible data contributions.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.38 }} className="mt-9 flex flex-wrap gap-3">
            <Button onClick={() => scrollToId('calculator')} icon="Calculator">Calculate Your Earnings</Button>
            <Button variant="ghost" onClick={() => scrollToId('contact')} icon="ArrowRight">Contact Us</Button>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-400">
            {['Documented authorization required', 'CSV from your existing software', 'Canada and United States'].map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5"><Check size={14} className="text-emerald-400" />{t}</span>
            ))}
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }} className="relative mx-auto aspect-square w-full max-w-[620px]">
          <DataSphere />
          {FLOATERS.map((f) => (
            <motion.div
              key={f.label}
              className={`absolute ${f.pos} hidden sm:block`}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: [0, -10, 0] }}
              transition={{ opacity: { delay: 0.8 + f.d * 0.2 }, y: { duration: 6, repeat: Infinity, ease: 'easeInOut', delay: f.d } }}
            >
              <Glass className="flex items-center gap-2.5 px-3.5 py-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-lg" style={{ background: f.c + '22', color: f.c }}><Icon name={f.icon} size={16} /></span>
                <span className="text-[13px] font-medium text-white">{f.label}</span>
              </Glass>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------------------------- STATS --------------------------------- */
export function Stats() {
  const shown = statsMode === 'production' ? stats.filter((s) => s.verified) : stats;
  if (!shown.length) return null;
  return (
    <section aria-label="Quantoxi partnership figures" className="relative border-y border-white/5 bg-midnight-900 py-16">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />
      <div className="mx-auto max-w-7xl px-5">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {shown.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.06}>
              <Glass className="group relative h-full overflow-hidden p-5 transition hover:border-cyan-300/30">
                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-cyan-400/10 blur-2xl transition group-hover:bg-violet-500/25" />
                <div className="font-display text-3xl font-semibold tracking-tight text-white sm:text-[2.1rem]">
                  <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} compact={s.compact} />
                </div>
                <div className="mt-2 text-sm font-medium text-slate-200">{s.label}</div>
                <div className="mt-1 text-xs text-slate-400">{s.note}</div>
              </Glass>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- CALCULATOR ------------------------------ */
const toSlider = (v) => Math.round((Math.log(v / recordRange.min) / Math.log(recordRange.max / recordRange.min)) * 1000);
const fromSlider = (t) => {
  const raw = recordRange.min * Math.pow(recordRange.max / recordRange.min, t / 1000);
  const step = raw < 1000 ? 50 : raw < 10000 ? 100 : raw < 100000 ? 500 : 1000;
  return Math.min(recordRange.max, Math.max(recordRange.min, Math.round(raw / step) * step));
};

const TICKS = [[100, '100', 1], [500, '500', 0], [1000, '1K', 1], [2500, '2.5K', 0], [5000, '5K', 0], [10000, '10K', 1], [25000, '25K', 0], [50000, '50K', 0], [100000, '100K', 0], [250000, '250K', 1]];

export function Calculator() {
  const [industry, setIndustry] = useState('cleaning');
  const [records, setRecords] = useState(25000);
  const [draft, setDraft] = useState('25000');
  const [err, setErr] = useState('');
  const [open, setOpen] = useState(false);
  const std = dataRates[0];
  const earnings = records * std.rate;
  const ind = industries.find((i) => i.id === industry);

  const commit = (val) => {
    const n = Number(String(val).replace(/[^\d]/g, ''));
    if (!n || n < recordRange.min) { setErr(`Enter at least ${recordRange.min.toLocaleString()} records.`); return; }
    if (n > recordRange.max) { setErr(`The calculator covers up to ${recordRange.max.toLocaleString()} records. Larger datasets are assessed individually.`); setRecords(recordRange.max); setDraft(String(recordRange.max)); return; }
    setErr(''); setRecords(n);
  };
  const examples = [1000, 5000, 10000, 25000, 50000, 100000, 250000];

  return (
    <section id="calculator" className="relative scroll-mt-20 overflow-hidden bg-[#F7F8FC] py-24 sm:py-32">
      <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-violet-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-cyan-200/40 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-5">
        <SectionHeader light eyebrow="Earnings calculator" title="Discover What Your Data Could Be Worth." sub="Your existing business records could represent an untapped revenue opportunity." />

        <Reveal delay={0.1} className="mt-14">
          <div className="grid overflow-hidden rounded-[28px] bg-white shadow-[0_30px_80px_-30px_rgba(30,27,75,.35)] ring-1 ring-slate-200 lg:grid-cols-[1.15fr_1fr]">
            <div className="p-6 sm:p-10">
              <label htmlFor="calc-ind" className="text-sm font-semibold text-slate-900">Your industry</label>
              <div className="relative mt-2">
                <select id="calc-ind" value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-10 text-slate-900 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100">
                  {industries.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
                </select>
                <ChevronDown size={18} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>


              <div className="mt-7">
                <div className="flex items-end justify-between gap-4">
                  <label htmlFor="calc-n" className="text-sm font-semibold text-slate-900">Approximate eligible records</label>
                  <input
                    id="calc-n" inputMode="numeric" value={draft}
                    onChange={(e) => { setDraft(e.target.value); const n = Number(e.target.value.replace(/[^\d]/g, '')); if (n >= recordRange.min && n <= recordRange.max) { setErr(''); setRecords(n); } }}
                    onBlur={() => commit(draft)} onKeyDown={(e) => e.key === 'Enter' && commit(draft)}
                    aria-invalid={!!err} aria-describedby="calc-err"
                    className="w-36 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-right font-mono text-slate-900 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                  />
                </div>
                <div className="relative mt-14">
                  {/* live value bubble that tracks the thumb */}
                  <div className="pointer-events-none absolute -top-11" style={{ left: `calc(${toSlider(records) / 10}% + ${13 - toSlider(records) * 0.026}px)`, transform: `translateX(-${toSlider(records) / 10}%)` }} aria-hidden="true">
                    <div className="relative whitespace-nowrap rounded-lg bg-midnight-950 px-2.5 py-1.5 font-mono text-[13px] font-semibold text-white shadow-lg">
                      {records.toLocaleString()} <span className="font-normal text-slate-400">records</span>
                      <span className="absolute -bottom-1 h-2 w-2 rotate-45 bg-midnight-950" style={{ left: `calc(${toSlider(records) / 10}% + ${(50 - toSlider(records) / 10) * 0.12}px)`, transform: 'translateX(-50%) rotate(45deg)' }} />
                    </div>
                  </div>
                  <input
                    type="range" min="0" max="1000" value={toSlider(records)} aria-label="Eligible records slider" aria-valuetext={`${records.toLocaleString()} records`}
                    onChange={(e) => { const v = fromSlider(+e.target.value); setRecords(v); setDraft(String(v)); setErr(''); }}
                    className="range-q w-full" style={{ '--p': `${toSlider(records) / 10}%` }}
                  />
                  <div className="relative mt-2 h-7">
                    {TICKS.map(([n, l, major]) => {
                      const p = toSlider(n) / 10;
                      const on = records >= n;
                      return (
                        <button
                          key={n} type="button" onClick={() => { setRecords(n); setDraft(String(n)); setErr(''); }}
                          aria-label={`Set ${n.toLocaleString()} records`}
                          className={`absolute top-0 flex -translate-x-1/2 flex-col items-center font-mono text-xs transition hover:text-violet-700 ${major ? '' : 'hidden sm:flex'} ${records === n ? 'font-semibold text-violet-700' : on ? 'text-slate-700' : 'text-slate-400'}`}
                          style={{ left: `calc(${p}% + ${13 - p * 0.26}px)` }}
                        >
                          <span className={`mb-1 h-1.5 w-px ${on ? 'bg-violet-400' : 'bg-slate-300'}`} />
                          {l}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <p id="calc-err" className="mt-2 min-h-[1.25rem] text-sm text-rose-600" role="alert">{err}</p>
                <div className="mt-6 flex gap-3 rounded-2xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-600 ring-1 ring-slate-200">
                  <Info size={18} className="mt-0.5 shrink-0 text-violet-600" />
                  <p>One standard rate of {fmtRate(std.rate)} per record. Each record includes the customer's name, email, phone number and address. The final amount is confirmed after verification.</p>
                </div>
              </div>
            </div>

            <div className="relative flex flex-col justify-between overflow-hidden bg-midnight-950 p-6 text-white sm:p-10">
              <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" />
              <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
              <div className="relative">
                <div className="flex items-center gap-2 text-sm text-slate-300"><CalcIcon size={16} className="text-emerald-300" /> Estimated earnings</div>
                <div aria-live="polite" className="mt-3 font-display text-5xl font-semibold tracking-tight text-emerald-300 drop-shadow-[0_0_30px_rgba(16,185,129,.45)] sm:text-6xl">
                  <Money value={earnings} />
                </div>
                <div className="mt-2 font-mono text-xs text-slate-400">{currency} · estimate only · before verification</div>
                <div className="mt-8 space-y-3 text-sm">
                  {[['Industry', ind.name], ['Records', records.toLocaleString()], ['Each record includes', 'Name, email, phone, address'], ['Rate per record', fmtRate(std.rate)]].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4 border-b border-white/10 pb-3"><span className="text-slate-400">{k}</span><span className="text-right font-medium">{v}</span></div>
                  ))}
                </div>
              </div>
              <Button variant="green" className="relative mt-10 w-full py-4 text-base" onClick={() => scrollToId('contact')}>Contact Us to Get Started <ArrowRight size={18} /></Button>
            </div>
          </div>
        </Reveal>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
          <Reveal>
            <div className="rounded-2xl bg-white ring-1 ring-slate-200">
              <button onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex w-full items-center justify-between gap-3 rounded-2xl p-5 text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-100">
                <span className="flex items-center gap-2 font-semibold text-slate-900"><Info size={18} className="text-violet-600" /> How earnings are determined</span>
                <ChevronDown size={18} className={`text-slate-400 transition ${open ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="space-y-3 px-5 pb-5 text-sm leading-relaxed text-slate-600">
                      <p>This calculator shows an estimate, not an offer. Actual compensation is set only after review and depends on:</p>
                      <ul className="grid gap-2 sm:grid-cols-2">
                        {['Eligibility of each record', 'Documented authorization to share', 'Data quality and completeness', 'Uniqueness (duplicates are removed)', 'Successful verification'].map((t) => (
                          <li key={t} className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-emerald-600" />{t}</li>
                        ))}
                      </ul>
                      <p>Records without documented permission, or that fail verification, are not compensated. Rates may change and are confirmed in your Data Partnership Agreement.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
              <div className="mb-3 text-sm font-semibold text-slate-900">Example estimates at {fmtRate(std.rate)} per record</div>
              <table className="w-full font-mono text-[13px]">
                <thead><tr className="text-left text-[11px] text-slate-400"><th className="px-2 pb-1.5 font-medium">Records</th><th className="px-2 pb-1.5 text-right font-medium">You earn</th></tr></thead>
                <tbody>
                  {examples.map((n) => (
                    <tr key={n} className="border-t border-slate-100">
                      <td className="px-2 py-1 text-slate-600">{n.toLocaleString()}</td>
                      {dataRates.map((r) => (
                        <td key={r.id} className="p-0 text-right">
                          <button onClick={() => { setRecords(n); setDraft(String(n)); setErr(''); }} aria-label={`${n.toLocaleString()} records at ${fmtRate(r.rate)}`} className={`w-full rounded-md px-2 py-1 text-right font-semibold hover:bg-violet-50 ${records === n ? 'bg-emerald-50 text-emerald-700' : 'text-emerald-700/80'}`}>${(n * r.rate).toLocaleString('en-US', { maximumFractionDigits: 0 })}</button>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- HOW IT WORKS ----------------------------- */
const STEPS = [
  { n: '01', t: 'Get in Touch', d: 'Call or email us and we will walk you through the partnership.', I: UserPlus, c: '#8B5CF6' },
  { n: '02', t: 'Prepare Your Data', d: 'Export eligible, authorized records from your existing CRM or business management software.', I: FileSpreadsheet, c: '#3B82F6' },
  { n: '03', t: 'Verification', d: 'Our data validation system reviews eligibility, permissions, formatting, quality and duplicate records.', I: ShieldCheck, c: '#22D3EE' },
  { n: '04', t: 'Get Paid', d: 'Receive compensation for approved data contributions following verification.', I: Wallet, c: '#10B981' },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative scroll-mt-20 overflow-hidden bg-midnight-950 py-24 sm:py-32">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-30" />
      <div className="relative mx-auto max-w-7xl px-5">
        <SectionHeader eyebrow="How it works" title="Four steps. Full transparency." sub="No new software. No integration project. You stay in control of what you share." />
        <div className="relative mt-16">
          <svg className="pointer-events-none absolute left-0 right-0 top-[44px] hidden h-2 w-full lg:block" preserveAspectRatio="none" viewBox="0 0 100 2" aria-hidden="true">
            <defs><linearGradient id="hl" x1="0" x2="1"><stop offset="0" stopColor="#8B5CF6" /><stop offset=".5" stopColor="#22D3EE" /><stop offset="1" stopColor="#10B981" /></linearGradient></defs>
            <line x1="12" y1="1" x2="88" y2="1" stroke="url(#hl)" strokeWidth="0.25" strokeDasharray="1 1" className="animate-dash" vectorEffect="non-scaling-stroke" style={{ strokeWidth: 2 }} />
          </svg>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.12}>
                <motion.div whileHover={{ y: -6 }} className="group relative h-full">
                  <div className="relative mx-auto mb-6 grid h-[88px] w-[88px] place-items-center">
                    <span className="absolute inset-0 rounded-3xl opacity-60 blur-xl transition group-hover:opacity-100" style={{ background: s.c + '55' }} />
                    <span className="relative grid h-[88px] w-[88px] place-items-center rounded-3xl border border-white/15 bg-midnight-800" style={{ color: s.c }}><s.I size={34} strokeWidth={1.6} /></span>
                  </div>
                  <Glass className="h-full p-6 text-center transition group-hover:border-white/20">
                    <div className="font-mono text-xs tracking-widest" style={{ color: s.c }}>STEP {s.n}</div>
                    <h3 className="mt-2 font-display text-xl font-semibold text-white">{s.t}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-300">{s.d}</p>
                  </Glass>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
