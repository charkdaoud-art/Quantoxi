import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, FileSpreadsheet, ArrowRight, Lock, Mail, Phone, MapPin } from 'lucide-react';
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

/* ----------------------------------- CRM ---------------------------------- */
export function CRM() {
  const [open, setOpen] = useState('Jobber');
  return (
    <section id="crm" className="relative scroll-mt-20 bg-[#F7F8FC] py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <SectionHeader center={false} light eyebrow="CRM compatibility" title="Your Existing Software. A Simpler Process." sub="If your system can export a CSV file, you can participate. Export eligible records and we will guide you through the rest." />
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
  ['Data minimization', 'We ask only for the fields needed for an approved purpose.', 'Filter'],
  ['Encryption', 'We commit to protecting partner data with encryption, both in transit and in storage.', 'Lock'],
  ['Careful data handling', 'We aim to handle data in controlled environments and keep access to a minimum.', 'Server'],
  ['Responsible data sourcing', 'We look for data that the contributing business can show was collected properly.', 'Leaf'],
  ['Permission first', 'We ask for documented consent or other lawful authority before accepting personal information.', 'BadgeCheck'],
  ['Limited access', 'We limit who can access partner data to the people who need it.', 'KeyRound'],
  ['Retention and deletion', 'We keep data only as long as needed for its stated purpose, then delete or de-identify it.', 'Trash2'],
  ['Privacy requests', 'Individuals can contact us to request access, correction or deletion of their information.', 'Inbox'],
  ['Clear purposes', 'We explain how contributed data will be used in the Data Partnership Agreement before you share anything.', 'Eye'],
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
            <SectionHeader center={false} eyebrow="Data security & privacy" title="Intelligence Built on Trust." sub="Our commitments to every partner, guided by Canadian and US privacy law, including PIPEDA, Quebec’s Law 25, CASL and the CCPA/CPRA." />
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
            <p>Read exactly how we collect, use and protect data in our policies.</p>
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
  ['What is Quantoxi?', 'Quantoxi is a Canadian artificial intelligence and data analytics company based in Toronto, Ontario. We build predictive and market intelligence models using responsibly sourced data, and we compensate businesses that contribute eligible, authorized datasets.'],
  ['Why does Quantoxi acquire data?', 'High-quality, real-world business data is essential for training and testing models that forecast demand, benchmark industries and understand aggregated consumer behaviour.'],
  ['What types of businesses can participate?', 'Businesses in Canada and the United States across home services, real estate, automotive, e-commerce, retail, hospitality, professional services and more. Each dataset is assessed individually.'],
  ['How much can my business earn?', 'We pay a standard 8¢ per eligible record. Each record includes the customer’s name, email, phone number and address. Use the calculator for an estimate; final compensation is confirmed after verification.'],
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
    <section id="contact" className="relative scroll-mt-20 overflow-hidden bg-midnight-950 py-28 sm:py-40">
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
          <div className="mx-auto mt-12 grid max-w-2xl gap-4 sm:grid-cols-2">
            <a href={`mailto:${company.email}`} className="group rounded-2xl border border-white/10 bg-white/[0.05] p-6 text-left backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-300/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-violet-500/20 text-violet-200"><Mail size={20} /></span>
              <div className="mt-4 text-sm text-slate-400">Email us</div>
              <div className="mt-1 font-display text-xl font-semibold text-white">{company.email}</div>
            </a>
            <a href={`tel:${company.phoneHref}`} className="group rounded-2xl border border-white/10 bg-white/[0.05] p-6 text-left backdrop-blur-xl transition hover:-translate-y-1 hover:border-emerald-300/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-500/20 text-emerald-200"><Phone size={20} /></span>
              <div className="mt-4 text-sm text-slate-400">Call us</div>
              <div className="mt-1 font-display text-xl font-semibold text-white">{company.phone}</div>
            </a>
          </div>
          <button onClick={() => navigateToSection('calculator', true)} className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-cyan-200 hover:text-white">Calculate your earnings first <ArrowRight size={15} /></button>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------- FOOTER -------------------------------- */
export function Footer({ route }) {
  const sec = (id) => navigateToSection(id, route);
  const cols = [
    ['Company', [['Industries', () => sec('industries')], ['FAQ', () => sec('faq')]]],
    ['Legal', [['Privacy Policy', () => go('privacy')], ['Terms of Service', () => go('terms')], ['Data Partnership Agreement', () => go('agreement')]]],
  ];
  return (
    <footer className="border-t border-white/10 bg-midnight-950 pt-16 text-slate-400">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1.2fr_1.3fr]">
        <div>
          <div className="text-white"><Logo /></div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed">{company.slogan} A Canadian AI and data analytics company, based in Toronto, building predictive intelligence on responsibly sourced data.</p>
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
            <div className="font-medium text-slate-200">{company.name}</div>
            <div className="flex items-center gap-1.5"><MapPin size={14} /> {company.city}</div>
            <a href={`mailto:${company.email}`} className="flex items-center gap-1.5 hover:text-white"><Mail size={14} /> {company.email}</a>
            <a href={`tel:${company.phoneHref}`} className="flex items-center gap-1.5 hover:text-white"><Phone size={14} /> {company.phone}</a>
          </address>
        </div>
      </div>
      <div className="mx-auto mt-14 flex max-w-7xl flex-col gap-3 border-t border-white/10 px-5 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} {company.name}. All rights reserved.</span>
        <span className="flex items-center gap-1.5"><MapPin size={12} /> {company.city}</span>
      </div>
    </footer>
  );
}
