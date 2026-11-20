import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, FileSpreadsheet, ArrowRight, Lock, Mail } from 'lucide-react';
import { ParticleField } from './DataSphere';
import { Button, Glass, Icon, Logo, Reveal, SectionHeader, go, scrollToId } from './ui';
import { company, crms, industries } from '../config/siteConfig';
import { navigateToSection } from './Nav';

/* -------------------------------- INDUSTRIES ------------------------------ */
export function Industries() {
  return (
    <section id="industries" className="relative scroll-mt-20 bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5">
        <SectionHeader light eyebrow="Industries we support" title="Every industry holds a signal." sub="Appropriately sourced, authorized records from everyday businesses help build better market intelligence and predictive models." />
        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((ind, i) => (
            <Reveal key={ind.id} delay={(i % 4) * 0.05}>
              <motion.div
                whileHover={{ y: -4 }}
                tabIndex={0}
                className="group relative h-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 outline-none transition hover:border-transparent hover:shadow-[0_20px_50px_-20px_rgba(30,27,75,.35)] focus-visible:ring-4 focus-visible:ring-violet-200"
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100" style={{ background: `radial-gradient(400px circle at 0% 0%, ${ind.color}18, transparent 60%)` }} />
                <div className="relative flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl transition group-hover:scale-110" style={{ background: ind.color + '1A', color: ind.color }}>
                    <Icon name={ind.icon} size={21} />
                  </span>
                  <h3 className="font-display text-[15px] font-semibold text-slate-900">{ind.name}</h3>
                </div>
                <p className="relative mt-3 text-sm leading-relaxed text-slate-600">{ind.blurb}</p>
                <span className="absolute bottom-0 left-0 h-[3px] w-0 transition-all duration-500 group-hover:w-full" style={{ background: ind.color }} />
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- TECHNOLOGY ------------------------------ */
const AREAS = [
  { t: 'Predictive Intelligence', d: 'Developing models to anticipate market demand, seasonal patterns and emerging industry trends.', icon: 'TrendingUp', c: '#22D3EE', status: 'In development' },
  { t: 'Consumer Behaviour Intelligence', d: 'Understanding aggregated purchasing behaviour and service preferences through appropriately sourced datasets.', icon: 'Users', c: '#8B5CF6', status: 'Research' },
  { t: 'Industry Analytics', d: 'Transforming historical business information into actionable insights and industry benchmarks.', icon: 'BarChart3', c: '#10B981', status: 'In development' },
  { t: 'Machine Learning Research', d: 'Developing intelligent models using relevant, responsibly sourced and appropriately processed data.', icon: 'BrainCircuit', c: '#60A5FA', status: 'Research' },
];

function NeuralViz() {
  const layers = [4, 6, 6, 3];
  const W = 320, H = 200;
  const nodes = layers.map((n, li) => Array.from({ length: n }, (_, i) => ({ x: 30 + li * ((W - 60) / (layers.length - 1)), y: H / 2 + (i - (n - 1) / 2) * 30 })));
  const edges = [];
  nodes.forEach((L, li) => li < nodes.length - 1 && L.forEach((a) => nodes[li + 1].forEach((b) => edges.push([a, b]))));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Neural network visualization">
      {edges.map(([a, b], i) => (
        <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="url(#ng)" strokeWidth=".6" opacity=".45" />
      ))}
      {edges.filter((_, i) => i % 7 === 0).map(([a, b], i) => (
        <circle key={'p' + i} r="2" fill="#22D3EE">
          <animateMotion dur={`${1.6 + (i % 5) * 0.4}s`} repeatCount="indefinite" path={`M${a.x},${a.y} L${b.x},${b.y}`} begin={`${(i % 6) * 0.3}s`} />
        </circle>
      ))}
      {nodes.flat().map((n, i) => (
        <g key={'n' + i}>
          <circle cx={n.x} cy={n.y} r="7" fill="#0B1236" stroke="#8B5CF6" strokeWidth="1.2" />
          <circle cx={n.x} cy={n.y} r="2.5" fill="#A78BFA"><animate attributeName="opacity" values=".3;1;.3" dur={`${2 + (i % 4) * 0.5}s`} repeatCount="indefinite" /></circle>
        </g>
      ))}
      <defs><linearGradient id="ng" x1="0" x2="1"><stop offset="0" stopColor="#8B5CF6" /><stop offset="1" stopColor="#22D3EE" /></linearGradient></defs>
    </svg>
  );
}

function ForecastChart() {
  const actual = [32, 38, 35, 46, 52, 49, 61, 66, 63, 72];
  const forecast = [72, 78, 83, 81, 90];
  const max = 100, W = 340, H = 150;
  const x = (i) => (i / 14) * W, y = (v) => H - (v / max) * H;
  const pa = actual.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ');
  const pf = forecast.map((v, i) => `${i ? 'L' : 'M'}${x(i + 9)},${y(v)}`).join(' ');
  const band = `M${x(9)},${y(72)} ` + forecast.map((v, i) => `L${x(i + 9)},${y(v + 4 + i * 2)}`).join(' ') + ' ' + forecast.slice().reverse().map((v, i) => `L${x(13 - i)},${y(v - 4 - (4 - i) * 2)}`).join(' ') + ' Z';
  return (
    <svg viewBox={`0 0 ${W} ${H + 10}`} className="w-full" role="img" aria-label="Illustrative demand forecast chart with confidence band">
      {[0.25, 0.5, 0.75].map((k) => <line key={k} x1="0" x2={W} y1={H * k} y2={H * k} stroke="rgba(255,255,255,.06)" />)}
      <path d={band} fill="rgba(34,211,238,.12)" />
      <motion.path d={pa} fill="none" stroke="#8B5CF6" strokeWidth="2.4" strokeLinecap="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.6 }} />
      <motion.path d={pf} fill="none" stroke="#22D3EE" strokeWidth="2.4" strokeDasharray="5 5" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.4, duration: 0.8 }} />
      <circle cx={x(9)} cy={y(72)} r="4" fill="#fff" />
      <circle cx={x(9)} cy={y(72)} r="9" fill="none" stroke="#22D3EE" opacity=".5"><animate attributeName="r" values="5;12;5" dur="2s" repeatCount="indefinite" /></circle>
    </svg>
  );
}

function Globe() {
  const cities = [[-0.42, -0.28], [-0.18, -0.18], [0.12, -0.25], [0.3, -0.05], [-0.05, 0.08], [0.22, 0.18], [-0.3, 0.05]];
  return (
    <svg viewBox="-110 -110 220 220" className="w-full max-w-[220px]" role="img" aria-label="Globe showing North American data coverage">
      <defs>
        <radialGradient id="gl" cx="35%" cy="30%"><stop offset="0" stopColor="#1E2A6B" /><stop offset="1" stopColor="#060B26" /></radialGradient>
      </defs>
      <circle r="100" fill="url(#gl)" stroke="rgba(139,92,246,.5)" />
      {[-60, -30, 0, 30, 60].map((lat) => <ellipse key={lat} cx="0" cy={lat * 1.3} rx={Math.cos((lat * Math.PI) / 180) * 100} ry={Math.cos((lat * Math.PI) / 180) * 12} fill="none" stroke="rgba(34,211,238,.18)" />)}
      <g className="globe-spin">
        {[0, 30, 60, 90, 120, 150].map((m) => <ellipse key={m} rx={Math.abs(Math.cos((m * Math.PI) / 180)) * 100} ry="100" fill="none" stroke="rgba(139,92,246,.22)" />)}
      </g>
      {cities.map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx * 100} cy={cy * 100} r="3" fill="#10B981" />
          <circle cx={cx * 100} cy={cy * 100} r="3" fill="none" stroke="#10B981"><animate attributeName="r" values="3;12;3" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" /><animate attributeName="opacity" values="1;0;1" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" /></circle>
        </g>
      ))}
      {cities.slice(1).map(([cx, cy], i) => (
        <path key={'a' + i} d={`M${cities[0][0] * 100},${cities[0][1] * 100} Q${((cities[0][0] + cx) / 2) * 100},${((cities[0][1] + cy) / 2) * 100 - 30} ${cx * 100},${cy * 100}`} fill="none" stroke="#22D3EE" strokeWidth=".8" strokeDasharray="3 3" className="animate-dash" opacity=".7" />
      ))}
    </svg>
  );
}

function DataStream() {
  const cols = Array.from({ length: 9 }, (_, c) => Array.from({ length: 18 }, (_, r) => ((c * 7919 + r * 104729) % 9973).toString(16).padStart(4, '0')));
  return (
    <div className="relative h-40 overflow-hidden font-mono text-[10px] leading-4 text-cyan-300/50" aria-hidden="true">
      <div className="flex justify-between">
        {cols.map((col, i) => (
          <div key={i} className="stream" style={{ animationDuration: `${8 + (i % 4) * 3}s`, animationDelay: `-${i}s` }}>
            {[...col, ...col].map((v, j) => <div key={j} className={j % 9 === 0 ? 'text-emerald-300' : ''}>{v}</div>)}
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-midnight-900 via-transparent to-midnight-900" />
    </div>
  );
}

export function Technology() {
  return (
    <section id="technology" className="relative scroll-mt-20 overflow-hidden bg-midnight-950 py-24 sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl px-5">
        <SectionHeader eyebrow="Our artificial intelligence technology" title="From raw records to predictive intelligence." sub="Our research program focuses on four areas. Each is labelled with its current stage so you always know what exists today and what we are building." />

        <div className="mt-14 grid gap-4 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <Glass className="h-full p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-widest text-slate-400">Demand forecast · illustrative</div>
                  <div className="mt-1 font-display text-lg font-semibold text-white">Seasonal service demand</div>
                </div>
                <div className="flex gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 bg-violet-500" />Historical</span>
                  <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 border-t-2 border-dashed border-cyan-300" />Forecast</span>
                </div>
              </div>
              <div className="mt-6"><ForecastChart /></div>
              <p className="mt-3 text-xs text-slate-500">Synthetic data for visualization only. Not output from a production model.</p>
            </Glass>
          </Reveal>
          <Reveal className="lg:col-span-5" delay={0.08}>
            <Glass className="h-full p-6">
              <div className="font-mono text-[11px] uppercase tracking-widest text-slate-400">Model architecture</div>
              <div className="mt-1 font-display text-lg font-semibold text-white">Multi-layer learning pipeline</div>
              <div className="mt-4"><NeuralViz /></div>
            </Glass>
          </Reveal>
          <Reveal className="lg:col-span-4" delay={0.05}>
            <Glass className="flex h-full flex-col items-center p-6">
              <div className="self-start font-mono text-[11px] uppercase tracking-widest text-slate-400">Coverage focus</div>
              <div className="self-start font-display text-lg font-semibold text-white">Canada and United States</div>
              <div className="mt-4 flex flex-1 items-center"><Globe /></div>
            </Glass>
          </Reveal>
          <Reveal className="lg:col-span-8" delay={0.1}>
            <Glass className="h-full overflow-hidden p-6">
              <div className="flex items-center justify-between">
                <div className="font-mono text-[11px] uppercase tracking-widest text-slate-400">Validation stream</div>
                <span className="flex items-center gap-1.5 text-xs text-emerald-300"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />Simulated</span>
              </div>
              <div className="mt-3 grid gap-4 sm:grid-cols-[1fr_200px]">
                <DataStream />
                <div className="space-y-3">
                  {[['Schema check', 98], ['Permission flags', 91], ['Deduplication', 86], ['Quality score', 79]].map(([k, v], i) => (
                    <div key={k}>
                      <div className="flex justify-between text-xs text-slate-300"><span>{k}</span><span className="font-mono">{v}%</span></div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                        <motion.div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-300" initial={{ width: 0 }} whileInView={{ width: v + '%' }} viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.2 + i * 0.12 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Glass>
          </Reveal>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {AREAS.map((a, i) => (
            <Reveal key={a.t} delay={i * 0.07}>
              <Glass className="group h-full p-6 transition hover:-translate-y-1 hover:border-white/20">
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl" style={{ background: a.c + '22', color: a.c }}><Icon name={a.icon} size={20} /></span>
                  <span className={`rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider ring-1 ${a.status === 'Research' ? 'text-violet-200 ring-violet-400/30' : 'text-cyan-200 ring-cyan-400/30'}`}>{a.status}</span>
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-white">{a.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{a.d}</p>
              </Glass>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-6 grid gap-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.04] p-5 text-sm sm:grid-cols-[auto_1fr] sm:items-center">
            <span className="font-mono text-[11px] uppercase tracking-widest text-emerald-300">Available today</span>
            <p className="text-slate-300">The data partnership program, the earnings estimator and in-browser CSV pre-validation. The four research areas above are not yet offered as commercial products.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ----------------------------------- CRM ---------------------------------- */
export function CRM() {
  const [open, setOpen] = useState('Jobber');
  return (
    <section id="crm" className="relative scroll-mt-20 bg-[#F7F8FC] py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <SectionHeader center={false} light eyebrow="CRM compatibility" title="Your Existing Software. A Simpler Process." sub="If your system can export a CSV file, you can participate. Export eligible records, map the columns, and our validator handles the rest." />
          <Reveal delay={0.15}>
            <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {crms.map((c) => (
                <button key={c.name} onClick={() => setOpen(c.name)} className={`flex items-center gap-2 rounded-xl border bg-white px-3 py-2.5 text-left text-sm font-medium transition ${open === c.name ? 'border-violet-400 text-violet-800 shadow-sm' : 'border-slate-200 text-slate-700 hover:border-slate-300'}`}>
                  <FileSpreadsheet size={15} className="shrink-0 text-emerald-600" />{c.name}
                </button>
              ))}
            </div>
            <p className="mt-6 text-xs leading-relaxed text-slate-500">
              Compatibility refers only to each platform’s standard CSV export. Quantoxi has no official partnership or direct integration with any of the platforms listed. Product names are trademarks of their respective owners.
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <div className="divide-y divide-slate-200 overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
            {crms.map((c) => {
              const isOpen = open === c.name;
              return (
                <div key={c.name}>
                  <button onClick={() => setOpen(isOpen ? null : c.name)} aria-expanded={isOpen} className="flex w-full items-center justify-between px-5 py-4 text-left font-medium text-slate-900 hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-none">
                    <span>Export from {c.name}</span>
                    <ChevronDown size={18} className={`text-slate-400 transition ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                        <ol className="space-y-2 px-5 pb-5">
                          {c.steps.map((s, i) => (
                            <li key={i} className="flex gap-3 text-sm text-slate-600"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-violet-100 font-mono text-[11px] font-semibold text-violet-700">{i + 1}</span>{s}</li>
                          ))}
                          <li className="pl-9 text-xs text-slate-400">Menu names vary by version. Include only columns you are authorized to share.</li>
                        </ol>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* --------------------------------- SECURITY ------------------------------- */
const SEC = [
  ['Data minimization', 'We request only the fields needed for an approved purpose. Unneeded columns can be stripped in your browser before submission.', 'Filter'],
  ['Encryption in transit and at rest', 'Production systems are designed to use TLS in transit and encrypted storage at rest.', 'Lock'],
  ['Secure data processing', 'Processing will run in isolated environments with logging and least-privilege service accounts.', 'Server'],
  ['Responsible data sourcing', 'We accept data only where the contributing business can document how it was collected.', 'Leaf'],
  ['Permission verification', 'Personal information requires documented consent or other lawful authority before acceptance.', 'BadgeCheck'],
  ['Controlled data access', 'Access is restricted by role and reviewed regularly.', 'KeyRound'],
  ['Data retention and deletion', 'Data is kept only as long as needed for the stated purpose, then deleted or de-identified.', 'Trash2'],
  ['Privacy request procedures', 'Individuals can request access, correction or deletion through our Privacy Officer.', 'Inbox'],
  ['Transparent processing purposes', 'Every use of contributed data is disclosed in the Data Partnership Agreement before you submit.', 'Eye'],
];

function Shield() {
  return (
    <div className="relative mx-auto grid aspect-square w-full max-w-[340px] place-items-center">
      {[0, 1, 2].map((i) => <span key={i} className="absolute inset-0 animate-pulseRing rounded-full border border-cyan-300/30" style={{ animationDelay: `${i * 0.8}s` }} />)}
      <svg viewBox="0 0 200 220" className="relative w-[70%]" role="img" aria-label="Animated security shield">
        <defs>
          <linearGradient id="sh" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8B5CF6" /><stop offset=".55" stopColor="#3B82F6" /><stop offset="1" stopColor="#10B981" /></linearGradient>
          <linearGradient id="shf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="rgba(139,92,246,.35)" /><stop offset="1" stopColor="rgba(16,185,129,.05)" /></linearGradient>
        </defs>
        <motion.path d="M100 8 L182 40 V104 C182 156 146 196 100 212 C54 196 18 156 18 104 V40 Z" fill="url(#shf)" stroke="url(#sh)" strokeWidth="3" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2 }} />
        <path d="M100 30 L162 54 V104 C162 144 136 176 100 190 C64 176 38 144 38 104 V54 Z" fill="none" stroke="rgba(255,255,255,.12)" strokeDasharray="4 6" className="animate-dash" />
        <motion.path d="M68 108 L92 132 L136 84" fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 1.6 }} />
      </svg>
    </div>
  );
}

export function Security() {
  return (
    <section id="security" className="relative scroll-mt-20 overflow-hidden bg-midnight-900 py-24 sm:py-32">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-25" />
      <div className="relative mx-auto max-w-7xl px-5">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <SectionHeader center={false} eyebrow="Data security & privacy" title="Intelligence Built on Trust." sub="Our practices are designed around Canadian and US privacy expectations, including PIPEDA, Quebec’s Law 25, CASL and US state privacy laws such as the CCPA/CPRA." />
            <Reveal delay={0.15}><Shield /></Reveal>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SEC.map(([t, d, ic], i) => (
              <Reveal key={t} delay={(i % 3) * 0.06}>
                <Glass className="h-full p-5 transition hover:border-cyan-300/25">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-cyan-400/10 text-cyan-300"><Icon name={ic} size={18} /></span>
                  <h3 className="mt-4 text-[15px] font-semibold text-white">{t}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-slate-400">{d}</p>
                </Glass>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal>
          <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-slate-300 md:flex-row md:items-center md:justify-between">
            <p>We do not claim certifications, third-party audits or regulatory approvals we have not obtained. Several controls above describe the production design and are not yet operational.</p>
            <div className="flex shrink-0 flex-wrap gap-2">
              {[['privacy', 'Privacy Policy'], ['terms', 'Terms of Service'], ['agreement', 'Data Partnership Agreement']].map(([h, l]) => (
                <button key={h} onClick={() => go(h)} className="rounded-full bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white ring-1 ring-white/10 hover:bg-white/10">{l}</button>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ----------------------------------- FAQ ---------------------------------- */
const FAQS = [
  ['What is Quantoxi?', 'Quantoxi is a North American artificial intelligence and data analytics company. We build predictive and market intelligence models using responsibly sourced data, and we compensate businesses that contribute eligible, authorized datasets.'],
  ['Why does Quantoxi acquire data?', 'High-quality, real-world business data is essential for training and testing models that forecast demand, benchmark industries and understand aggregated consumer behaviour.'],
  ['What types of businesses can participate?', 'Businesses in Canada and the United States across home services, real estate, automotive, e-commerce, retail, hospitality, professional services and more. Each dataset is assessed individually.'],
  ['How much can my business earn?', 'Rates start at 8¢ per record for name, email and phone number. Adding a street address brings it to 13¢, and adding full client history on top brings it to 17¢. Use the calculator for an estimate. Final compensation is confirmed only after verification.'],
  ['What information is eligible?', 'Records your business collected lawfully, for which you hold documented consent or other legal authority to disclose to us for the purposes in our agreement. Records lacking that authority are not eligible.'],
  ['Can I export data from Jobber?', 'Yes. Jobber, like most business software, can export client lists to CSV. See the export instructions in the CRM section. We have no official partnership with Jobber.'],
  ['What if I have thousands of records?', 'That is common. The calculator covers up to 250,000 records, and larger datasets are reviewed individually.'],
  ['How does verification work?', 'We check file formatting, required columns, authorization documentation, duplicates and overall quality. You can see each submission’s status in your partner dashboard.'],
  ['How do I receive payment?', 'Approved partners choose bank transfer, PayPal or electronic funds transfer. Payment follows approval, typically within 30 days, and is never guaranteed before verification.'],
  ['Can I submit data every month?', 'Yes, you can submit new records as your business grows. Records already submitted are detected as duplicates and are not paid twice.'],
  ['How will the submitted information be used?', 'Only for the purposes described in the Data Partnership Agreement, such as model training, research and aggregated market intelligence. The agreement is shown to you before any submission.'],
  ['What customer permissions are required?', 'You must be able to show that your customers consented, or that you otherwise have lawful authority, to disclose their personal information to a third party for these purposes. Canadian law generally requires meaningful consent for this.'],
  ['Can I contribute anonymized information instead?', 'Yes. You can choose anonymized business research data, which removes direct identifiers before submission. Anonymized datasets are assessed under different eligibility criteria and rates.'],
  ['What happens to rejected records?', 'Rejected records are not compensated and are deleted from our systems. You receive a summary of rejection reasons so you can correct future submissions.'],
];

export function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="scroll-mt-20 bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-5">
        <SectionHeader light eyebrow="FAQ" title="Questions, answered plainly." />
        <div className="mt-12 space-y-2">
          {FAQS.map(([q, a], i) => {
            const isOpen = open === i;
            return (
              <Reveal key={q} delay={Math.min(i, 6) * 0.03}>
                <div className={`rounded-2xl border transition ${isOpen ? 'border-violet-200 bg-violet-50/40' : 'border-slate-200 bg-white'}`}>
                  <h3>
                    <button id={`fq-${i}`} aria-controls={`fa-${i}`} aria-expanded={isOpen} onClick={() => setOpen(isOpen ? -1 : i)} className="flex w-full items-center justify-between gap-4 rounded-2xl px-5 py-4 text-left font-semibold text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-100">
                      {q}
                      <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full transition ${isOpen ? 'rotate-180 bg-violet-600 text-white' : 'bg-slate-100 text-slate-500'}`}><ChevronDown size={16} /></span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div id={`fa-${i}`} role="region" aria-labelledby={`fq-${i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                        <p className="px-5 pb-5 text-[15px] leading-relaxed text-slate-600">{a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- FINAL CTA ------------------------------- */
export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-midnight-950 py-28 sm:py-40">
      <ParticleField />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,.25),transparent_60%)]" />
      <div className="relative mx-auto max-w-4xl px-5 text-center">
        <Reveal>
          <h2 className="font-display text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl">
            The Future of Intelligence <span className="text-gradient-anim glow-text">Starts With Data.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-slate-300">Discover new revenue opportunities for your business while contributing to the development of artificial intelligence and market intelligence technologies.</p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button onClick={() => go('onboarding')} icon="ArrowRight" className="px-8 py-4 text-base">Become a Data Partner</Button>
            <Button variant="ghost" onClick={() => navigateToSection('calculator', true)} icon="Calculator" className="px-8 py-4 text-base">Calculate Your Earnings</Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------- FOOTER -------------------------------- */
export function Footer({ route }) {
  const sec = (id) => navigateToSection(id, route);
  const cols = [
    ['Company', [['Technology', () => sec('technology')], ['Data Partnerships', () => sec('calculator')], ['Industries', () => sec('industries')], ['FAQ', () => sec('faq')]]],
    ['Partners', [['Become a Partner', () => go('onboarding')], ['Partner Login', () => go('login')], ['Demo Dashboard', () => go('dashboard')], ['Security & Privacy', () => sec('security')]]],
    ['Legal', [['Privacy Policy', () => go('privacy')], ['Terms of Service', () => go('terms')], ['Data Partnership Agreement', () => go('agreement')]]],
  ];
  return (
    <footer className="border-t border-white/10 bg-midnight-950 pt-16 text-slate-400">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.3fr]">
        <div>
          <div className="text-white"><Logo /></div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed">{company.slogan} A North American AI and data analytics company building predictive intelligence on responsibly sourced data.</p>
        </div>
        {cols.map(([h, items]) => (
          <div key={h}>
            <div className="font-mono text-[11px] uppercase tracking-widest text-slate-500">{h}</div>
            <ul className="mt-4 space-y-2.5 text-sm">
              {items.map(([l, fn]) => <li key={l}><button onClick={fn} className="hover:text-white">{l}</button></li>)}
            </ul>
          </div>
        ))}
        <div>
          <div className="font-mono text-[11px] uppercase tracking-widest text-slate-500">Contact</div>
          <address className="mt-4 space-y-2 text-sm not-italic">
            <div className="text-slate-300">{company.legalEntity}</div>
            <div>{company.address}</div>
            <div>{company.jurisdiction}</div>
            <div className="flex items-center gap-1.5"><Mail size={14} /> {company.email}</div>
            <div>{company.phone}</div>
          </address>
        </div>
      </div>
      <div className="mx-auto mt-14 flex max-w-7xl flex-col gap-3 border-t border-white/10 px-5 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} {company.legalEntity}, operating as Quantoxi. All rights reserved.</span>
        <span className="flex items-center gap-1.5"><Lock size={12} /> Prototype build · no data leaves your browser</span>
      </div>
    </footer>
  );
}
