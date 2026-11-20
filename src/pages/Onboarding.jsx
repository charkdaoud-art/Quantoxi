import { useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Building2, Database, FileSignature, UploadCloud, Wallet, Check, AlertTriangle, FileText, X, Loader2, ShieldCheck, Sparkles, CircleCheck, Landmark, CreditCard, Banknote } from 'lucide-react';
import { Button, Money, PrototypeNotice, go } from '../components/ui';
import { company, crms, dataRates, industries, timelines, recordRange, fmtRate } from '../config/siteConfig';

const PROV = ['Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia', 'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Yukon'];
const STATES = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

const STEPS = [
  { t: 'Business', I: Building2 },
  { t: 'Dataset', I: Database },
  { t: 'Agreement', I: FileSignature },
  { t: 'Submission', I: UploadCloud },
  { t: 'Payment', I: Wallet },
];

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phoneRe = /^\+?[\d\s().-]{10,20}$/;
const urlRe = /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i;

/* ------------------------------ form primitives ---------------------------- */
const inputCls = (bad) => `mt-1.5 w-full rounded-xl border bg-white/[0.04] px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:ring-4 ${bad ? 'border-rose-400/70 focus:ring-rose-400/20' : 'border-white/10 focus:border-violet-400 focus:ring-violet-500/20'}`;

function Field({ id, label, error, hint, children, optional }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-slate-200">{label}{optional && <span className="ml-1 text-slate-500">(optional)</span>}</label>
      {children}
      {error ? <p id={id + '-e'} className="mt-1.5 text-xs text-rose-300" role="alert">{error}</p> : hint ? <p className="mt-1.5 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}
function Text({ id, value, onChange, error, ...p }) {
  return <input id={id} value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={!!error} aria-describedby={error ? id + '-e' : undefined} className={inputCls(error)} {...p} />;
}
function Select({ id, value, onChange, error, options, placeholder = 'Select…' }) {
  return (
    <select id={id} value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={!!error} className={inputCls(error) + ' appearance-none [&>option]:bg-midnight-900'}>
      <option value="">{placeholder}</option>
      {options.map((o) => (typeof o === 'string' ? <option key={o}>{o}</option> : <option key={o.v} value={o.v}>{o.l}</option>))}
    </select>
  );
}
function CheckRow({ checked, onChange, children, error, id }) {
  return (
    <label htmlFor={id} className={`flex cursor-pointer gap-3 rounded-xl border p-4 text-sm transition ${checked ? 'border-emerald-400/40 bg-emerald-400/[0.06]' : error ? 'border-rose-400/50' : 'border-white/10 hover:border-white/20'}`}>
      <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border transition peer-focus-visible:ring-2 peer-focus-visible:ring-cyan-300 ${checked ? 'border-emerald-400 bg-emerald-400 text-midnight-950' : 'border-white/30'}`}>{checked && <Check size={14} strokeWidth={3} />}</span>
      <span className="text-slate-300">{children}</span>
    </label>
  );
}

/* --------------------------------- CSV utils ------------------------------- */
function parseCSV(text) {
  const rows = []; let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') q = false;
      else cell += ch;
    } else if (ch === '"') q = true;
    else if (ch === ',') { row.push(cell); cell = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); cell = '';
      if (row.some((c) => c.trim() !== '')) rows.push(row);
      row = [];
    } else cell += ch;
  }
  row.push(cell);
  if (row.some((c) => c.trim() !== '')) rows.push(row);
  return rows;
}

const TARGETS = [
  { k: 'first', l: 'First name', pii: true, re: /^(first|given|fname)/i },
  { k: 'last', l: 'Last name', pii: true, re: /^(last|surname|family|lname)/i },
  { k: 'full', l: 'Full name', pii: true, re: /^(full.?name|name|client|customer.?name|contact)$/i },
  { k: 'email', l: 'Email', pii: true, re: /e-?mail/i },
  { k: 'phone', l: 'Phone', pii: true, re: /(phone|mobile|cell|tel)/i },
  { k: 'street', l: 'Street address', pii: true, re: /(street|address)/i },
  { k: 'city', l: 'City', re: /^city|town/i },
  { k: 'region', l: 'Province / State', re: /(province|state|region)/i },
  { k: 'postal', l: 'Postal / ZIP', re: /(postal|zip)/i },
  { k: 'service', l: 'Service type', re: /(service|job.?type|category)/i },
  { k: 'date', l: 'Service date', re: /(date|created|completed)/i },
];

function autoMap(headers) {
  const m = {};
  headers.forEach((h, i) => {
    const t = TARGETS.find((t) => t.re.test(h.trim()) && !Object.values(m).includes(t.k));
    m[i] = t ? t.k : '';
  });
  return m;
}

function synthCSV() {
  const fn = ['Avery', 'Jordan', 'Riley', 'Morgan', 'Casey', 'Quinn', 'Taylor', 'Parker', 'Rowan', 'Emerson', 'Sasha', 'Drew'];
  const ln = ['Example', 'Sample', 'Testcase', 'Demo', 'Placeholder', 'Mock'];
  const cities = [['Ottawa', 'ON', 'K2S'], ['Toronto', 'ON', 'M5V'], ['Calgary', 'AB', 'T2P'], ['Denver', 'CO', '802'], ['Austin', 'TX', '787']];
  const svc = ['Deck repair', 'Spring cleanup', 'Furnace tune-up', 'Roof inspection', 'Deep clean'];
  const lines = ['First Name,Last Name,Email,Phone,Street Address,City,Province,Postal Code,Service Type,Job Date,Internal Notes'];
  for (let i = 0; i < 240; i++) {
    const f = fn[i % fn.length], l = ln[(i * 7) % ln.length], c = cities[i % cities.length];
    const email = i % 37 === 5 ? 'not-an-email' : `${f}.${l}${i}@example.com`.toLowerCase();
    lines.push(`${f},${l},${email},555-01${String(i % 100).padStart(2, '0')},${100 + i} Sample St,${c[0]},${c[1]},${c[2]} 0A${i % 10},${svc[i % svc.length]},2026-0${(i % 9) + 1}-1${i % 9},"Gate code ${1000 + i}"`);
    if (i % 23 === 0) lines.push(lines[lines.length - 1]); // seed exact duplicates
  }
  return lines.join('\n');
}

/* ================================== PAGE =================================== */
export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);
  const [b, setB] = useState({ name: '', website: '', industry: '', country: '', region: '', contact: '', email: '', phone: '' });
  const [d, setD] = useState({ crm: '', records: '', cats: [], purpose: '', authorized: '' });
  const [a, setA] = useState({ mode: 'anonymized', uses: false, eligibility: false, retention: false, crossBorder: false, comp: false, authority: false, docName: '' });
  const [pay, setPay] = useState('');
  const [csv, setCsv] = useState(null);
  const top = useRef(null);

  const setBF = (k) => (v) => setB((s) => ({ ...s, [k]: v, ...(k === 'country' ? { region: '' } : {}) }));
  const setDF = (k) => (v) => setD((s) => ({ ...s, [k]: v }));
  const setAF = (k) => (v) => { if (k === 'mode') setCsv(null); setA((s) => ({ ...s, [k]: v })); };

  const bestRate = d.cats.length ? Math.max(...d.cats.map((c) => dataRates.find((r) => r.id === c).rate)) : 0;
  const estValue = (Number(d.records) || 0) * bestRate;

  const validate = () => {
    const e = {};
    if (step === 0) {
      if (b.name.trim().length < 2) e.name = 'Enter your business name.';
      if (b.website && !urlRe.test(b.website.trim())) e.website = 'Enter a valid website, for example example.com.';
      if (!b.industry) e.industry = 'Select an industry.';
      if (!b.country) e.country = 'Select a country.';
      if (!b.region) e.region = 'Select a province or state.';
      if (b.contact.trim().length < 2) e.contact = 'Enter the contact person’s name.';
      if (!emailRe.test(b.email.trim())) e.email = 'Enter a valid business email.';
      if (!phoneRe.test(b.phone.trim())) e.phone = 'Enter a valid phone number with area code.';
    }
    if (step === 1) {
      if (!d.crm) e.crm = 'Select your CRM or software.';
      const n = Number(d.records);
      if (!n || n < recordRange.min) e.records = `Enter at least ${recordRange.min} records.`;
      if (!d.cats.length) e.cats = 'Select at least one data category.';
      if (d.purpose.trim().length < 15) e.purpose = 'Describe why the information was originally collected (at least 15 characters).';
      if (d.authorized.trim().length < 15) e.authorized = 'Describe the purposes your customers authorized (at least 15 characters).';
    }
    if (step === 2) {
      ['uses', 'eligibility', 'retention', 'crossBorder', 'comp'].forEach((k) => !a[k] && (e[k] = 'Required'));
      if (a.mode === 'authorized') {
        if (!a.docName) e.docName = 'Attach documentation of customer consent or legal authority.';
        if (!a.authority) e.authority = 'Required';
      }
    }
    if (step === 3) {
      if (!csv || !csv.rows.length) e.csv = 'Add a CSV file to pre-validate.';
      else if (!csv.stats.eligible) e.csv = 'No eligible records were found with the current column mapping.';
    }
    if (step === 4 && !pay) e.pay = 'Choose a payment method.';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const next = () => {
    if (!validate()) {
      setTimeout(() => document.querySelector('[aria-invalid="true"], [role="alert"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
      return;
    }
    if (step === 4) { setDone(true); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    setStep((s) => s + 1); setErrors({});
    top.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const back = () => { setErrors({}); setStep((s) => Math.max(0, s - 1)); };

  if (done) return <Success est={csv?.stats.estimate || 0} />;

  return (
    <div ref={top} className="relative min-h-screen scroll-mt-0 bg-midnight-950 pb-24 pt-28 sm:pt-32">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-25" />
      <div className="relative mx-auto max-w-4xl px-5">
        <button onClick={() => go('')} className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white"><ArrowLeft size={16} /> Back to site</button>
        <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">Become a Data Partner</h1>
        <p className="mt-2 text-slate-400">About 10 minutes. You can review the agreement before sharing anything.</p>

        <div className="mt-6"><PrototypeNotice>Prototype onboarding. Use test values only. Nothing you enter or select is transmitted or stored; it lives in this browser tab and disappears on reload.</PrototypeNotice></div>

        {/* stepper */}
        <ol className="mt-8 grid grid-cols-5 gap-2" aria-label="Onboarding progress">
          {STEPS.map((s, i) => {
            const st = i < step ? 'done' : i === step ? 'cur' : 'todo';
            return (
              <li key={s.t} aria-current={st === 'cur' ? 'step' : undefined}>
                <div className="h-1 overflow-hidden rounded-full bg-white/10"><motion.div className="h-full bg-gradient-to-r from-violet-500 to-cyan-300" animate={{ width: st === 'todo' ? '0%' : '100%' }} transition={{ duration: 0.5 }} /></div>
                <div className={`mt-2.5 flex items-center gap-1.5 text-xs sm:text-sm ${st === 'todo' ? 'text-slate-500' : 'text-white'}`}>
                  <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${st === 'done' ? 'bg-emerald-400 text-midnight-950' : st === 'cur' ? 'bg-violet-500 text-white' : 'bg-white/10'}`}>{st === 'done' ? <Check size={13} strokeWidth={3} /> : <s.I size={13} />}</span>
                  <span className="hidden sm:inline">{s.t}</span>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-8 rounded-3xl border border-white/10 bg-midnight-900/70 p-5 shadow-[0_30px_80px_-30px_rgba(0,0,0,.8)] backdrop-blur-xl sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.35 }}>
              {step === 0 && (
                <Section title="Business information" sub="Tell us who you are.">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field id="bn" label="Business name" error={errors.name}><Text id="bn" value={b.name} onChange={setBF('name')} error={errors.name} autoComplete="organization" /></Field>
                    <Field id="bw" label="Business website" optional error={errors.website}><Text id="bw" value={b.website} onChange={setBF('website')} error={errors.website} placeholder="example.com" autoComplete="url" /></Field>
                    <Field id="bi" label="Industry" error={errors.industry}><Select id="bi" value={b.industry} onChange={setBF('industry')} error={errors.industry} options={industries.map((i) => ({ v: i.id, l: i.name }))} /></Field>
                    <Field id="bc" label="Country" error={errors.country}><Select id="bc" value={b.country} onChange={setBF('country')} error={errors.country} options={['Canada', 'United States']} /></Field>
                    <Field id="br" label={b.country === 'United States' ? 'State' : 'Province or territory'} error={errors.region}><Select id="br" value={b.region} onChange={setBF('region')} error={errors.region} options={b.country === 'United States' ? STATES : b.country === 'Canada' ? PROV : []} placeholder={b.country ? 'Select…' : 'Select a country first'} /></Field>
                    <Field id="bp" label="Contact person’s name" error={errors.contact}><Text id="bp" value={b.contact} onChange={setBF('contact')} error={errors.contact} autoComplete="name" /></Field>
                    <Field id="be" label="Business email" error={errors.email}><Text id="be" type="email" value={b.email} onChange={setBF('email')} error={errors.email} autoComplete="email" /></Field>
                    <Field id="bph" label="Business phone number" error={errors.phone}><Text id="bph" type="tel" value={b.phone} onChange={setBF('phone')} error={errors.phone} placeholder="+1 555 010 0000" autoComplete="tel" /></Field>
                  </div>
                </Section>
              )}

              {step === 1 && (
                <Section title="Dataset information" sub="Describe what you plan to contribute and how it was collected.">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field id="dc" label="CRM platform" error={errors.crm}><Select id="dc" value={d.crm} onChange={setDF('crm')} error={errors.crm} options={crms.map((c) => c.name)} /></Field>
                    <Field id="dr" label="Estimated record quantity" error={errors.records}><Text id="dr" inputMode="numeric" value={d.records} onChange={(v) => setDF('records')(v.replace(/[^\d]/g, ''))} error={errors.records} placeholder="e.g. 12000" /></Field>
                  </div>
                  <fieldset className="mt-6">
                    <legend className="text-sm font-medium text-slate-200">Available data categories</legend>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      {dataRates.map((r) => {
                        const on = d.cats.includes(r.id);
                        return (
                          <CheckRow key={r.id} id={'cat-' + r.id} checked={on} error={errors.cats} onChange={(c) => setDF('cats')(c ? [...d.cats, r.id] : d.cats.filter((x) => x !== r.id))}>
                            <span className="flex w-full justify-between gap-2"><span>{r.label}<span className="block text-xs text-slate-500">{r.desc}</span></span><span className="font-mono text-xs text-violet-300">{fmtRate(r.rate)}</span></span>
                          </CheckRow>
                        );
                      })}
                    </div>
                    {errors.cats && <p className="mt-1.5 text-xs text-rose-300" role="alert">{errors.cats}</p>}
                  </fieldset>
                  <div className="mt-6 flex items-center justify-between rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.05] px-5 py-4">
                    <div><div className="text-sm text-slate-300">Estimated dataset value</div><div className="text-xs text-slate-500">Calculated at the highest selected rate, before verification</div></div>
                    <Money value={estValue} className="font-display text-2xl font-semibold text-emerald-300" />
                  </div>
                  <div className="mt-6 grid gap-5">
                    <Field id="dp" label="Original collection purpose" error={errors.purpose} hint="For example: scheduling and invoicing residential cleaning services.">
                      <textarea id="dp" rows={3} value={d.purpose} onChange={(e) => setDF('purpose')(e.target.value)} aria-invalid={!!errors.purpose} className={inputCls(errors.purpose)} />
                    </Field>
                    <Field id="da" label="Authorized purposes for disclosure and processing" error={errors.authorized} hint="What did customers agree their information could be shared or used for? Quote your consent wording if you have it.">
                      <textarea id="da" rows={3} value={d.authorized} onChange={(e) => setDF('authorized')(e.target.value)} aria-invalid={!!errors.authorized} className={inputCls(errors.authorized)} />
                    </Field>
                  </div>
                </Section>
              )}

              {step === 2 && <AgreementStep a={a} setAF={setAF} errors={errors} />}
              {step === 3 && <SubmissionStep csv={csv} setCsv={setCsv} mode={a.mode} error={errors.csv} />}
              {step === 4 && <PaymentStep pay={pay} setPay={setPay} error={errors.pay} est={csv?.stats.estimate || 0} />}
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">
            <Button variant="ghost" onClick={back} disabled={step === 0}><ArrowLeft size={16} /> Back</Button>
            <Button onClick={next}>{step === 4 ? 'Complete prototype submission' : 'Continue'} <ArrowRight size={16} /></Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, sub, children }) {
  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-white">{title}</h2>
      {sub && <p className="mt-1 text-sm text-slate-400">{sub}</p>}
      <div className="mt-7">{children}</div>
    </div>
  );
}

/* -------------------------------- STEP 3 ---------------------------------- */
function AgreementStep({ a, setAF, errors }) {
  const docRef = useRef(null);
  const terms = [
    ['uses', 'Intended uses', 'Contributed data is used to train, test and evaluate machine learning models, conduct research, and produce aggregated market intelligence. Additional uses require a new agreement.'],
    ['eligibility', 'Eligibility requirements', 'You confirm the data was collected lawfully by your business, is accurate to the best of your knowledge, and that you have authority to disclose it for the uses above.'],
    ['retention', 'Retention practices', 'Data is retained only as long as needed for the stated uses, then deleted or irreversibly de-identified. Rejected records are deleted.'],
    ['crossBorder', 'Cross-border processing', 'Data may be stored or processed in Canada or the United States and may be subject to the laws of those jurisdictions, including lawful access by authorities.'],
    ['comp', 'Compensation terms', 'Compensation applies only to records approved after verification, at the rates in effect on the submission date. Estimates are not guarantees.'],
  ];
  return (
    <Section title="Data Partnership Agreement" sub="Review each term. You can read the full agreement at any time.">
      <div className="grid gap-3 sm:grid-cols-2">
        {[['anonymized', 'Anonymized business research data', 'Names, emails, phone numbers and street addresses are removed in your browser before submission. Postal codes are shortened to 3 characters.', ShieldCheck], ['authorized', 'Explicitly authorized customer information', 'Only where you hold documented customer consent or other legal authority to disclose personal information.', FileText]].map(([v, t, desc, I]) => (
          <label key={v} className={`relative cursor-pointer rounded-2xl border p-5 transition focus-within:ring-2 focus-within:ring-cyan-300 ${a.mode === v ? 'border-violet-400/60 bg-violet-500/10' : 'border-white/10 hover:border-white/20'}`}>
            <input type="radio" name="mode" value={v} checked={a.mode === v} onChange={() => setAF('mode')(v)} className="sr-only" />
            <I size={20} className={a.mode === v ? 'text-violet-300' : 'text-slate-400'} />
            <div className="mt-3 font-semibold text-white">{t}</div>
            <p className="mt-1 text-sm text-slate-400">{desc}</p>
            {a.mode === v && <CircleCheck size={18} className="absolute right-4 top-4 text-violet-300" />}
          </label>
        ))}
      </div>

      <div className="mt-6 space-y-2">
        {terms.map(([k, t, desc]) => (
          <CheckRow key={k} id={'t-' + k} checked={a[k]} onChange={setAF(k)} error={errors[k]}>
            <span className="block font-medium text-white">{t}</span>
            <span className="mt-0.5 block text-slate-400">{desc}</span>
          </CheckRow>
        ))}
      </div>

      {a.mode === 'authorized' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-6 rounded-2xl border border-amber-300/25 bg-amber-300/[0.05] p-5">
          <div className="flex items-center gap-2 font-semibold text-amber-100"><AlertTriangle size={18} /> Documentation of permissions and authority</div>
          <p className="mt-2 text-sm text-amber-100/80">Before we accept personal information, attach evidence such as your consent wording, privacy notice excerpt, or sign-up form showing customers agreed to disclosure to third parties for research and analytics.</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <input ref={docRef} type="file" accept=".pdf,.png,.jpg,.jpeg,.txt,.docx" className="sr-only" id="authdoc" onChange={(e) => setAF('docName')(e.target.files?.[0]?.name || '')} />
            <label htmlFor="authdoc" className="cursor-pointer rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white ring-1 ring-white/15 hover:bg-white/15">Choose file</label>
            <span className="text-sm text-slate-300">{a.docName || 'No file selected'}</span>
          </div>
          {errors.docName && <p className="mt-2 text-xs text-rose-300" role="alert">{errors.docName}</p>}
          <p className="mt-2 text-xs text-slate-500">Prototype: only the file name is read. The file is not opened or uploaded.</p>
          <div className="mt-4"><CheckRow id="t-auth" checked={a.authority} onChange={setAF('authority')} error={errors.authority}>I confirm I am authorized to act for this business and that the customers in this dataset gave the permissions described.</CheckRow></div>
        </motion.div>
      )}
      <button onClick={() => go('agreement')} className="mt-5 text-sm text-cyan-300 underline-offset-4 hover:underline">Read the full Data Partnership Agreement</button>
    </Section>
  );
}

/* -------------------------------- STEP 4 ---------------------------------- */
function SubmissionStep({ csv, setCsv, mode, error }) {
  const [drag, setDrag] = useState(false);
  const [stage, setStage] = useState(-1);
  const [fileErr, setFileErr] = useState('');
  const inp = useRef(null);
  const stages = ['Reading file', 'Mapping columns', 'Minimizing data', 'Detecting duplicates', 'Ready'];

  const load = (name, text, size) => {
    setFileErr('');
    const rows = parseCSV(text);
    if (rows.length < 2) { setFileErr('That file has no data rows.'); return; }
    const headers = rows[0];
    setStage(0);
    stages.forEach((_, i) => setTimeout(() => setStage(i), i * 380));
    setTimeout(() => setCsv(compute({ name, size, headers, rows: rows.slice(1), map: autoMap(headers) }, mode)), stages.length * 380);
  };
  const handle = (f) => {
    if (!f) return;
    if (!/\.csv$/i.test(f.name)) { setFileErr('Please choose a .csv file.'); return; }
    if (f.size > 25 * 1024 * 1024) { setFileErr('Files over 25 MB are not supported in the prototype.'); return; }
    const r = new FileReader();
    r.onload = () => load(f.name, String(r.result), f.size);
    r.onerror = () => setFileErr('The file could not be read.');
    r.readAsText(f);
  };
  const remap = (i, k) => setCsv(compute({ ...csv, map: { ...csv.map, [i]: k } }, mode));

  const busy = stage >= 0 && stage < stages.length - 1 && !csv;
  return (
    <Section title="Dataset submission" sub="Your file is processed entirely inside this browser. Nothing is uploaded.">
      {!csv && (
        <>
          <div
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files?.[0]); }}
            className={`relative grid place-items-center overflow-hidden rounded-3xl border-2 border-dashed px-6 py-14 text-center transition ${drag ? 'border-cyan-300 bg-cyan-300/5' : 'border-white/15 bg-white/[0.02]'}`}
          >
            {busy ? (
              <div className="w-full max-w-sm">
                <Loader2 className="mx-auto animate-spin text-cyan-300" size={32} />
                <div className="mt-4 text-sm text-white">{stages[stage]}…</div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><motion.div className="h-full bg-gradient-to-r from-violet-500 to-emerald-400" animate={{ width: `${((stage + 1) / stages.length) * 100}%` }} /></div>
              </div>
            ) : (
              <>
                <motion.div animate={{ y: drag ? -6 : 0 }} className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-violet-500/30 to-cyan-400/20 text-cyan-200"><UploadCloud size={30} /></motion.div>
                <div className="mt-5 font-semibold text-white">Drag and drop your CSV here</div>
                <div className="mt-1 text-sm text-slate-400">or</div>
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  <Button variant="ghost" onClick={() => inp.current?.click()}>Select file</Button>
                  <Button variant="ghost" onClick={() => load('synthetic-sample.csv', synthCSV(), 0)}><Sparkles size={15} /> Use synthetic sample</Button>
                </div>
                <input ref={inp} type="file" accept=".csv,text/csv" className="sr-only" onChange={(e) => handle(e.target.files?.[0])} aria-label="Select CSV file" />
              </>
            )}
          </div>
          {(fileErr || error) && <p className="mt-3 text-sm text-rose-300" role="alert">{fileErr || error}</p>}
        </>
      )}

      {csv && <CsvReview csv={csv} remap={remap} mode={mode} reset={() => { setCsv(null); setStage(-1); }} />}
    </Section>
  );
}

function compute(c, mode) {
  const { headers, rows } = c;
  const map = { ...c.map };
  const piiKeys = TARGETS.filter((t) => t.pii).map((t) => t.k);
  if (mode === 'anonymized') Object.keys(map).forEach((i) => piiKeys.includes(map[i]) && (map[i] = ''));
  const col = (k) => Object.keys(map).find((i) => map[i] === k);
  const ci = { first: col('first'), last: col('last'), full: col('full'), email: col('email'), phone: col('phone') };
  const seen = new Set();
  let dup = 0, badEmail = 0, missing = 0, eligible = 0, hasE = !!ci.email, hasP = !!ci.phone;
  const clean = [];
  rows.forEach((r) => {
    const name = ci.full ? r[ci.full] : [r[ci.first], r[ci.last]].filter(Boolean).join(' ');
    const email = ci.email ? (r[ci.email] || '').trim().toLowerCase() : '';
    const phone = ci.phone ? (r[ci.phone] || '').replace(/\D/g, '') : '';
    const key = mode === 'anonymized' ? r.join('|').toLowerCase() : email || phone || name.toLowerCase();
    if (seen.has(key)) { dup++; return; }
    seen.add(key);
    if (mode === 'authorized') {
      if (!name.trim() || !email || !phone) { missing++; return; }
      if (email && !emailRe.test(email)) { badEmail++; return; }
    }
    eligible++;
    if (clean.length < 6) clean.push(Object.keys(map).filter((i) => map[i]).map((i) => (mode === 'anonymized' && map[i] === 'postal' ? (r[i] || '').slice(0, 3) : r[i])));
  });
  const hasAddr = !!col('street'), hasHist = !!(col('service') || col('date'));
  const catId = mode === 'anonymized' ? 'contact' : hasE && hasP ? (hasAddr ? (hasHist ? 'full' : 'address') : 'contact') : null;
  const rate = catId ? dataRates.find((r) => r.id === catId).rate : 0;
  const removedCols = headers.filter((_, i) => !map[i]);
  return {
    ...c, map,
    stats: { total: rows.length, dup, badEmail, missing, eligible, catId, rate, estimate: eligible * rate, removedCols, kept: Object.values(map).filter(Boolean).length },
    preview: { head: Object.keys(map).filter((i) => map[i]).map((i) => TARGETS.find((t) => t.k === map[i]).l), rows: clean },
  };
}

function CsvReview({ csv, remap, mode, reset }) {
  const s = csv.stats;
  const piiKeys = TARGETS.filter((t) => t.pii).map((t) => t.k);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-400/15 text-emerald-300"><FileText size={20} /></span>
          <div><div className="font-medium text-white">{csv.name}</div><div className="text-xs text-slate-400">{csv.headers.length} columns · {s.total.toLocaleString()} rows{csv.size ? ` · ${(csv.size / 1024).toFixed(1)} KB` : ''}</div></div>
        </div>
        <button onClick={reset} className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm text-slate-300 ring-1 ring-white/10 hover:bg-white/5"><X size={14} /> Replace file</button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[['Eligible records', s.eligible, 'text-emerald-300'], ['Duplicates removed', s.dup, 'text-amber-300'], ['Invalid emails', s.badEmail, 'text-rose-300'], ['Missing name, email or phone', s.missing, 'text-rose-300']].map(([l, v, c]) => (
          <div key={l} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className={`font-display text-2xl font-semibold ${c}`}>{v.toLocaleString()}</div>
            <div className="mt-1 text-xs text-slate-400">{l}</div>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-white">Column mapping</h3>
        <p className="mt-1 text-xs text-slate-500">Unmapped columns are removed in your browser and never leave this device.{mode === 'anonymized' && ' Direct identifiers are locked out in anonymized mode.'}</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {csv.headers.map((h, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2">
              <span className="min-w-0 flex-1 truncate font-mono text-xs text-slate-300" title={h}>{h || `Column ${i + 1}`}</span>
              <ArrowRight size={14} className="shrink-0 text-slate-500" />
              <select aria-label={`Map column ${h}`} value={csv.map[i] || ''} onChange={(e) => remap(i, e.target.value)} className="w-44 rounded-lg border border-white/10 bg-midnight-800 px-2 py-1.5 text-xs text-white outline-none focus:border-violet-400">
                <option value="">Remove (do not include)</option>
                {TARGETS.filter((t) => !(mode === 'anonymized' && piiKeys.includes(t.k))).map((t) => <option key={t.k} value={t.k}>{t.l}</option>)}
              </select>
            </div>
          ))}
        </div>
        {s.removedCols.length > 0 && <p className="mt-3 text-xs text-emerald-300/90"><ShieldCheck size={13} className="mr-1 inline" />Removed locally: {s.removedCols.join(', ')}</p>}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-white">Local preview <span className="font-normal text-slate-500">(first rows after minimization)</span></h3>
        <div className="mt-3 overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 text-slate-300"><tr>{csv.preview.head.map((h) => <th key={h} className="whitespace-nowrap px-3 py-2 font-medium">{h}</th>)}</tr></thead>
            <tbody>{csv.preview.rows.map((r, i) => <tr key={i} className="border-t border-white/5 text-slate-400">{r.map((c, j) => <td key={j} className="whitespace-nowrap px-3 py-2">{c}</td>)}</tr>)}</tbody>
          </table>
          {!csv.preview.head.length && <div className="p-4 text-xs text-slate-500">No columns mapped.</div>}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.06] p-5">
          <div className="text-sm text-slate-300">Estimated compensation</div>
          <Money value={s.estimate} className="mt-1 block font-display text-3xl font-semibold text-emerald-300" />
          <div className="mt-1 text-xs text-slate-400">{s.catId ? `${s.eligible.toLocaleString()} × ${fmtRate(s.rate)} · ${dataRates.find((r) => r.id === s.catId).short}${mode === 'anonymized' ? ' (provisional, confirmed at review)' : ''}` : 'Map name, email and phone columns to estimate'}</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="text-sm text-slate-300">Verification status</div>
          <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-cyan-400/10 px-3 py-1 text-sm font-medium text-cyan-200 ring-1 ring-cyan-300/30"><span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />Pre-validated locally</div>
          <p className="mt-2 text-xs text-slate-500">Not submitted. Formal verification requires production backend infrastructure with authorization checks.</p>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- STEP 5 ---------------------------------- */
function PaymentStep({ pay, setPay, error, est }) {
  const opts = [['bank', 'Bank transfer', 'Direct deposit to a business bank account', Landmark], ['paypal', 'PayPal', 'Paid to your verified PayPal business account', CreditCard], ['eft', 'Electronic funds transfer', 'EFT in Canada or ACH in the United States', Banknote]];
  return (
    <Section title="Payment information" sub="Choose how you would like to be paid once a submission is approved.">
      <div className="grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Payment method">
        {opts.map(([v, t, desc, I]) => (
          <label key={v} className={`relative cursor-pointer rounded-2xl border p-5 transition focus-within:ring-2 focus-within:ring-cyan-300 ${pay === v ? 'border-emerald-400/50 bg-emerald-400/[0.07]' : error ? 'border-rose-400/50' : 'border-white/10 hover:border-white/20'}`}>
            <input type="radio" name="pay" value={v} checked={pay === v} onChange={() => setPay(v)} className="sr-only" />
            <I size={22} className={pay === v ? 'text-emerald-300' : 'text-slate-400'} />
            <div className="mt-3 font-semibold text-white">{t}</div>
            <p className="mt-1 text-xs text-slate-400">{desc}</p>
            {pay === v && <CircleCheck size={18} className="absolute right-4 top-4 text-emerald-300" />}
          </label>
        ))}
      </div>
      {error && <p className="mt-2 text-xs text-rose-300" role="alert">{error}</p>}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[['Verification', timelines.verification], ['Payment', timelines.payment], ['Estimated payment', <Money key="m" value={est} className="text-emerald-300" />]].map(([k, v]) => (
          <div key={k} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><div className="text-xs text-slate-400">{k}</div><div className="mt-1 text-sm font-semibold text-white">{v}</div></div>
        ))}
      </div>
      <div className="mt-6"><PrototypeNotice>Banking and PayPal details are never requested in this prototype. In production they would be collected only after approval, through a secure payment provider, never by email or plain web form. Approval and payment are not guaranteed.</PrototypeNotice></div>
    </Section>
  );
}

function Success({ est }) {
  return (
    <div className="relative grid min-h-screen place-items-center bg-midnight-950 px-5 pb-20 pt-28">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-25" />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative max-w-lg rounded-3xl border border-white/10 bg-midnight-900/80 p-8 text-center backdrop-blur-xl">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }} className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-400/15 text-emerald-300"><Check size={32} strokeWidth={3} /></motion.div>
        <h1 className="mt-6 font-display text-2xl font-semibold text-white">Prototype submission complete</h1>
        <p className="mt-3 text-slate-400">In production, your dataset would now move to <span className="text-white">Authorization Review</span>. In this prototype nothing was transmitted or stored.</p>
        <div className="mt-6 rounded-2xl bg-white/[0.04] p-4"><div className="text-xs text-slate-400">Estimated compensation, pending verification</div><Money value={est} className="mt-1 block font-display text-3xl font-semibold text-emerald-300" /></div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button onClick={() => go('dashboard')} icon="LayoutDashboard">Open demo dashboard</Button>
          <Button variant="ghost" onClick={() => go('')}>Back to site</Button>
        </div>
      </motion.div>
    </div>
  );
}
