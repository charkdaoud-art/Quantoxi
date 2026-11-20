import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, UploadCloud, History, Wallet, ShieldCheck, Settings, LifeBuoy, LogOut, DollarSign, Clock, CheckCircle2, Database, ArrowUpRight, Search, X, Bell, ChevronRight } from 'lucide-react';
import { Logo, Money, PrototypeNotice, go } from '../components/ui';
import { company } from '../config/siteConfig';
import { navigateToSection } from '../components/Nav';

/* All figures below are synthetic sample data for the demo account. */
const MONTHS = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
const CONTRIB = [0, 1200, 2400, 1800, 3600, 4200, 2900, 5100, 4400, 6200, 5300, 3100];
const COMP = CONTRIB.map((c, i) => Math.round(c * (i % 3 === 0 ? 0.13 : i % 3 === 1 ? 0.17 : 0.08) * 100) / 100);

const STATUS = {
  Draft: 'bg-slate-500/15 text-slate-300 ring-slate-400/30',
  Submitted: 'bg-blue-500/15 text-blue-200 ring-blue-400/30',
  'Authorization Review': 'bg-violet-500/15 text-violet-200 ring-violet-400/30',
  'Under Verification': 'bg-cyan-500/15 text-cyan-200 ring-cyan-400/30',
  Approved: 'bg-emerald-500/15 text-emerald-200 ring-emerald-400/30',
  'Payment Processing': 'bg-amber-500/15 text-amber-200 ring-amber-400/30',
  Paid: 'bg-emerald-400/20 text-emerald-100 ring-emerald-300/40',
  Rejected: 'bg-rose-500/15 text-rose-200 ring-rose-400/30',
};
const PIPE = ['Draft', 'Submitted', 'Authorization Review', 'Under Verification', 'Approved', 'Payment Processing', 'Paid'];

const SUBS = [
  { id: 'QV-1048', file: 'clients_nov.csv', date: '2026-11-12', records: 3100, approved: 0, status: 'Authorization Review', cat: 'Name + email + phone' },
  { id: 'QV-1041', file: 'clients_oct.csv', date: '2026-10-09', records: 5300, approved: 5012, status: 'Payment Processing', cat: 'Full client profile' },
  { id: 'QV-1036', file: 'jobber_export_sep.csv', date: '2026-09-08', records: 6200, approved: 5890, status: 'Paid', cat: 'Full client profile' },
  { id: 'QV-1029', file: 'aug_contacts.csv', date: '2026-08-11', records: 4400, approved: 4105, status: 'Paid', cat: 'Contact + address' },
  { id: 'QV-1027', file: 'leads_unverified.csv', date: '2026-07-30', records: 1800, approved: 0, status: 'Rejected', cat: 'Name + email + phone', reason: 'No documented consent for disclosure' },
  { id: 'QV-1022', file: 'jul_clients.csv', date: '2026-07-07', records: 5100, approved: 4870, status: 'Paid', cat: 'Full client profile' },
  { id: 'QV-1050', file: 'draft_dec.csv', date: '2026-11-17', records: 850, approved: 0, status: 'Draft', cat: 'Name + email + phone' },
  { id: 'QV-1049', file: 'commercial_accts.csv', date: '2026-11-15', records: 1200, approved: 0, status: 'Under Verification', cat: 'Name + email + phone' },
];
const PAYMENTS = [
  { id: 'PMT-3307', date: '2026-10-14', amount: 589.0, method: 'EFT', ref: 'QV-1036', status: 'Paid' },
  { id: 'PMT-3281', date: '2026-09-12', amount: 205.25, method: 'EFT', ref: 'QV-1029', status: 'Paid' },
  { id: 'PMT-3244', date: '2026-08-06', amount: 487.0, method: 'EFT', ref: 'QV-1022', status: 'Paid' },
  { id: 'PMT-3352', date: 'Pending', amount: 501.2, method: 'EFT', ref: 'QV-1041', status: 'Payment Processing' },
];

const NAVS = [
  ['overview', 'Overview', LayoutDashboard], ['submissions', 'Submissions', History], ['payments', 'Payments', Wallet],
  ['verification', 'Verification', ShieldCheck], ['settings', 'Account settings', Settings], ['support', 'Support centre', LifeBuoy],
];

const Badge = ({ s }) => <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ${STATUS[s]}`}>{s}</span>;
const Card = ({ children, className = '' }) => <div className={`rounded-2xl border border-white/10 bg-white/[0.035] p-5 ${className}`}>{children}</div>;

function Chart() {
  const [hover, setHover] = useState(null);
  const W = 640, H = 220, pad = 28;
  const maxC = Math.max(...CONTRIB), maxP = Math.max(...COMP);
  const bw = (W - pad * 2) / MONTHS.length;
  const lx = (i) => pad + bw * i + bw / 2, ly = (v) => H - pad - (v / maxP) * (H - pad * 2);
  const line = COMP.map((v, i) => `${i ? 'L' : 'M'}${lx(i)},${ly(v)}`).join(' ');
  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Monthly records contributed (bars) and compensation (line), synthetic data">
        <defs><linearGradient id="bar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8B5CF6" /><stop offset="1" stopColor="#3B82F6" stopOpacity=".35" /></linearGradient></defs>
        {[0.25, 0.5, 0.75, 1].map((k) => <line key={k} x1={pad} x2={W - pad} y1={H - pad - k * (H - pad * 2)} y2={H - pad - k * (H - pad * 2)} stroke="rgba(255,255,255,.06)" />)}
        {CONTRIB.map((v, i) => {
          const h = (v / maxC) * (H - pad * 2);
          return (
            <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(i)} onBlur={() => setHover(null)} tabIndex={0}>
              <rect x={pad + bw * i} y={pad} width={bw} height={H - pad * 2} fill="transparent" />
              <motion.rect x={pad + bw * i + bw * 0.22} width={bw * 0.56} rx="4" fill="url(#bar)" opacity={hover === null || hover === i ? 1 : 0.4} initial={{ y: H - pad, height: 0 }} animate={{ y: H - pad - h, height: h }} transition={{ duration: 0.8, delay: i * 0.04 }} />
              <text x={lx(i)} y={H - 8} textAnchor="middle" className="fill-slate-500 text-[10px]">{MONTHS[i]}</text>
            </g>
          );
        })}
        <motion.path d={line} fill="none" stroke="#10B981" strokeWidth="2.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, delay: 0.4 }} />
        {COMP.map((v, i) => <circle key={i} cx={lx(i)} cy={ly(v)} r={hover === i ? 5 : 3} fill="#10B981" stroke="#03061A" strokeWidth="2" />)}
      </svg>
      {hover !== null && (
        <div className="pointer-events-none absolute top-2 rounded-xl border border-white/10 bg-midnight-800/95 px-3 py-2 text-xs shadow-xl" style={{ left: `${(lx(hover) / W) * 100}%`, transform: 'translateX(-50%)' }}>
          <div className="font-semibold text-white">{MONTHS[hover]}</div>
          <div className="text-violet-200">{CONTRIB[hover].toLocaleString()} records</div>
          <div className="text-emerald-300">${COMP[hover].toFixed(2)}</div>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [tab, setTab] = useState('overview');
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('All');
  const [detail, setDetail] = useState(null);
  const [toast, setToast] = useState('');

  const paid = PAYMENTS.filter((p) => p.status === 'Paid').reduce((s, p) => s + p.amount, 0);
  const pending = PAYMENTS.filter((p) => p.status !== 'Paid').reduce((s, p) => s + p.amount, 0);
  const approved = SUBS.reduce((s, x) => s + x.approved, 0);
  const list = useMemo(() => SUBS.filter((s) => (filter === 'All' || s.status === filter) && (s.id + s.file).toLowerCase().includes(q.toLowerCase())).sort((a, b) => b.date.localeCompare(a.date)), [q, filter]);
  const flash = (m) => { setToast(m); setTimeout(() => setToast(''), 2600); };

  const Kpi = ({ l, v, I, c, sub }) => (
    <Card className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl" style={{ background: c + '30' }} />
      <div className="flex items-center justify-between text-sm text-slate-400">{l}<I size={17} style={{ color: c }} /></div>
      <div className="mt-3 font-display text-2xl font-semibold text-white">{v}</div>
      <div className="mt-1 text-xs text-slate-500">{sub}</div>
    </Card>
  );

  const SubTable = ({ rows }) => (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="text-xs text-slate-500"><tr>{['ID', 'File', 'Date', 'Records', 'Approved', 'Status', ''].map((h) => <th key={h} className="px-3 py-2 font-medium">{h}</th>)}</tr></thead>
        <tbody>
          {rows.map((s) => (
            <tr key={s.id} className="border-t border-white/5 text-slate-300 hover:bg-white/[0.03]">
              <td className="px-3 py-3 font-mono text-xs text-slate-400">{s.id}</td>
              <td className="px-3 py-3">{s.file}</td>
              <td className="px-3 py-3 text-slate-400">{s.date}</td>
              <td className="px-3 py-3">{s.records.toLocaleString()}</td>
              <td className="px-3 py-3">{s.approved ? s.approved.toLocaleString() : '—'}</td>
              <td className="px-3 py-3"><Badge s={s.status} /></td>
              <td className="px-3 py-3 text-right"><button onClick={() => setDetail(s)} className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white" aria-label={`View ${s.id}`}><ChevronRight size={16} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {!rows.length && <div className="p-6 text-center text-sm text-slate-500">No submissions match.</div>}
    </div>
  );

  return (
    <div className="min-h-screen bg-midnight-950 text-white lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="hidden border-r border-white/10 bg-midnight-900/60 p-5 lg:flex lg:flex-col">
        <button onClick={() => go('')} aria-label="Quantoxi home"><Logo /></button>
        <nav className="mt-10 space-y-1" aria-label="Dashboard">
          {NAVS.map(([k, l, I]) => (
            <button key={k} onClick={() => setTab(k)} className={`relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${tab === k ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
              {tab === k && <motion.span layoutId="dtab" className="absolute inset-0 rounded-xl bg-white/[0.07] ring-1 ring-white/10" />}
              <I size={17} className="relative" /><span className="relative">{l}</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto rounded-2xl border border-white/10 bg-gradient-to-br from-violet-600/20 to-cyan-500/10 p-4">
          <div className="text-sm font-semibold">Demo account</div>
          <div className="mt-1 text-xs text-slate-400">Northline Home Services (fictional)</div>
          <button onClick={() => go('')} className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white"><LogOut size={13} /> Exit demo</button>
        </div>
      </aside>

      <main className="min-w-0 p-4 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="lg:hidden"><button onClick={() => go('')}><Logo size={28} /></button></div>
            <h1 className="mt-3 font-display text-2xl font-semibold lg:mt-0">{NAVS.find((n) => n[0] === tab)[1]}</h1>
            <p className="text-sm text-slate-400">Welcome back. All figures are synthetic sample data.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => flash('No new notifications in demo mode.')} className="rounded-xl p-2.5 text-slate-300 ring-1 ring-white/10 hover:bg-white/5" aria-label="Notifications"><Bell size={17} /></button>
            <button onClick={() => navigateToSection('contact', true)} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-4 py-2.5 text-sm font-semibold"><UploadCloud size={16} /> Submit new dataset</button>
          </div>
        </div>
        <div className="mt-4 flex gap-1 overflow-x-auto lg:hidden">
          {NAVS.map(([k, l]) => <button key={k} onClick={() => setTab(k)} className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs ${tab === k ? 'bg-white/10 text-white' : 'text-slate-400'}`}>{l}</button>)}
        </div>

        <div className="mt-5"><PrototypeNotice>Demonstration dashboard using synthetic data. Live balances, submissions and payouts require a production backend with authentication.</PrototypeNotice></div>

        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="mt-6 space-y-6">
            {tab === 'overview' && (
              <>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <Kpi l="Total earnings" v={<Money value={paid} />} I={DollarSign} c="#10B981" sub="Paid to date" />
                  <Kpi l="Pending earnings" v={<Money value={pending} />} I={Clock} c="#F59E0B" sub="Approved, payment processing" />
                  <Kpi l="Approved records" v={approved.toLocaleString()} I={CheckCircle2} c="#22D3EE" sub={`Across ${SUBS.filter((s) => s.approved).length} submissions`} />
                  <Kpi l="In verification" v={SUBS.filter((s) => ['Submitted', 'Authorization Review', 'Under Verification'].includes(s.status)).length} I={Database} c="#8B5CF6" sub="Submissions under review" />
                </div>
                <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
                  <Card>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div><div className="font-semibold">Monthly contributions and compensation</div><div className="text-xs text-slate-500">Last 12 months</div></div>
                      <div className="flex gap-4 text-xs text-slate-400"><span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-violet-500" />Records</span><span className="flex items-center gap-1.5"><span className="h-0.5 w-4 bg-emerald-400" />Compensation</span></div>
                    </div>
                    <div className="mt-4"><Chart /></div>
                  </Card>
                  <Card>
                    <div className="font-semibold">Data verification status</div>
                    <div className="mt-4 space-y-3">
                      {SUBS.filter((s) => !['Paid'].includes(s.status)).slice(0, 4).map((s) => {
                        const idx = PIPE.indexOf(s.status);
                        return (
                          <button key={s.id} onClick={() => setDetail(s)} className="block w-full rounded-xl border border-white/5 p-3 text-left hover:border-white/15">
                            <div className="flex items-center justify-between gap-2 text-sm"><span className="font-mono text-xs text-slate-400">{s.id}</span><Badge s={s.status} /></div>
                            <div className="mt-2.5 flex gap-1">{PIPE.map((p, i) => <span key={p} className={`h-1 flex-1 rounded-full ${s.status === 'Rejected' ? 'bg-rose-500/40' : i <= idx ? 'bg-gradient-to-r from-violet-500 to-cyan-300' : 'bg-white/10'}`} />)}</div>
                          </button>
                        );
                      })}
                    </div>
                  </Card>
                </div>
                <Card><div className="mb-3 flex items-center justify-between"><div className="font-semibold">Recent submissions</div><button onClick={() => setTab('submissions')} className="inline-flex items-center gap-1 text-xs text-cyan-300">View all <ArrowUpRight size={13} /></button></div><SubTable rows={list.slice(0, 4)} /></Card>
              </>
            )}

            {tab === 'submissions' && (
              <Card>
                <div className="mb-4 flex flex-wrap gap-3">
                  <div className="relative flex-1"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by ID or file" aria-label="Search submissions" className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2 pl-9 pr-3 text-sm outline-none focus:border-violet-400" /></div>
                  <select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter by status" className="rounded-xl border border-white/10 bg-midnight-800 px-3 py-2 text-sm outline-none">
                    {['All', ...Object.keys(STATUS)].map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <SubTable rows={list} />
                <div className="mt-5 flex flex-wrap gap-2 border-t border-white/5 pt-4 text-xs text-slate-500">Statuses: {Object.keys(STATUS).map((s) => <Badge key={s} s={s} />)}</div>
              </Card>
            )}

            {tab === 'payments' && (
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px] text-left text-sm">
                    <thead className="text-xs text-slate-500"><tr>{['Payment', 'Date', 'Submission', 'Method', 'Amount', 'Status'].map((h) => <th key={h} className="px-3 py-2 font-medium">{h}</th>)}</tr></thead>
                    <tbody>{PAYMENTS.map((p) => <tr key={p.id} className="border-t border-white/5 text-slate-300"><td className="px-3 py-3 font-mono text-xs">{p.id}</td><td className="px-3 py-3">{p.date}</td><td className="px-3 py-3 font-mono text-xs text-slate-400">{p.ref}</td><td className="px-3 py-3">{p.method}</td><td className="px-3 py-3 font-semibold text-emerald-300">${p.amount.toFixed(2)}</td><td className="px-3 py-3"><Badge s={p.status} /></td></tr>)}</tbody>
                  </table>
                </div>
              </Card>
            )}

            {tab === 'verification' && (
              <div className="grid gap-4 md:grid-cols-2">
                {SUBS.filter((s) => s.status !== 'Paid').map((s) => {
                  const idx = PIPE.indexOf(s.status);
                  return (
                    <Card key={s.id}>
                      <div className="flex items-center justify-between"><div><div className="font-semibold">{s.file}</div><div className="font-mono text-xs text-slate-500">{s.id} · {s.records.toLocaleString()} records</div></div><Badge s={s.status} /></div>
                      <ol className="mt-5 space-y-2">
                        {PIPE.map((p, i) => (
                          <li key={p} className="flex items-center gap-3 text-sm">
                            <span className={`grid h-5 w-5 place-items-center rounded-full text-[10px] ${s.status === 'Rejected' ? 'bg-white/5 text-slate-600' : i < idx ? 'bg-emerald-400 text-midnight-950' : i === idx ? 'bg-violet-500 ring-4 ring-violet-500/20' : 'bg-white/5 text-slate-600'}`}>{i < idx && s.status !== 'Rejected' ? '✓' : i + 1}</span>
                            <span className={i <= idx && s.status !== 'Rejected' ? 'text-white' : 'text-slate-500'}>{p}</span>
                          </li>
                        ))}
                      </ol>
                      {s.reason && <p className="mt-4 rounded-lg bg-rose-500/10 p-3 text-xs text-rose-200">Rejected: {s.reason}. Records were deleted.</p>}
                    </Card>
                  );
                })}
              </div>
            )}

            {tab === 'settings' && (
              <Card className="max-w-2xl">
                <form onSubmit={(e) => { e.preventDefault(); flash('Saved in this tab only (demo).'); }} className="grid gap-4 sm:grid-cols-2">
                  {[['Business name', 'Northline Home Services'], ['Contact name', 'Demo Contact'], ['Business email', 'demo@northline.example'], ['Payment method', 'EFT']].map(([l, v]) => (
                    <label key={l} className="text-sm text-slate-300">{l}<input defaultValue={v} className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-white outline-none focus:border-violet-400" /></label>
                  ))}
                  <div className="sm:col-span-2 flex justify-end"><button className="rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold ring-1 ring-white/15 hover:bg-white/15">Save changes</button></div>
                </form>
              </Card>
            )}

            {tab === 'support' && (
              <div className="grid gap-4 md:grid-cols-3">
                {[['Export help', 'Step-by-step CSV export guides for common CRMs.', () => { go(''); setTimeout(() => document.getElementById('crm')?.scrollIntoView({ behavior: 'smooth' }), 80); }], ['Data Partnership Agreement', 'Review the terms that govern your submissions.', () => go('agreement')], ['Contact support', `${company.email} · ${company.phone}`, () => flash(`Support: ${company.email} · ${company.phone}`)]].map(([t, d, fn]) => (
                  <Card key={t}><div className="font-semibold">{t}</div><p className="mt-1 text-sm text-slate-400">{d}</p><button onClick={fn} className="mt-4 inline-flex items-center gap-1 text-sm text-cyan-300">Open <ArrowUpRight size={14} /></button></Card>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {detail && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm" onClick={() => setDetail(null)} role="dialog" aria-modal="true" aria-label={`Submission ${detail.id}`} onKeyDown={(e) => e.key === 'Escape' && setDetail(null)}>
            <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-3xl border border-white/10 bg-midnight-900 p-6">
              <div className="flex items-start justify-between"><div><div className="font-mono text-xs text-slate-500">{detail.id}</div><div className="mt-1 font-display text-xl font-semibold">{detail.file}</div></div><button autoFocus onClick={() => setDetail(null)} className="rounded-lg p-1.5 hover:bg-white/10" aria-label="Close"><X size={18} /></button></div>
              <dl className="mt-5 space-y-3 text-sm">
                {[['Status', <Badge key="b" s={detail.status} />], ['Submitted', detail.date], ['Category', detail.cat], ['Records', detail.records.toLocaleString()], ['Approved', detail.approved.toLocaleString()], ['Rejected or duplicate', detail.approved ? (detail.records - detail.approved).toLocaleString() : '—']].map(([k, v]) => <div key={k} className="flex justify-between border-b border-white/5 pb-2.5"><dt className="text-slate-400">{k}</dt><dd>{v}</dd></div>)}
              </dl>
              {detail.reason && <p className="mt-4 rounded-lg bg-rose-500/10 p-3 text-xs text-rose-200">Reason: {detail.reason}</p>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>{toast && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} role="status" className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-white/10 bg-midnight-800 px-4 py-3 text-sm shadow-2xl">{toast}</motion.div>}</AnimatePresence>
    </div>
  );
}
