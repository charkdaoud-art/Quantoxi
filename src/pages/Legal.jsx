import { ArrowLeft, Lock, LayoutDashboard, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button, Logo, go } from '../components/ui';
import { company } from '../config/siteConfig';
import { navigateToSection } from '../components/Nav';

const C = company;
const DOCS = {
  privacy: {
    title: 'Privacy Policy',
    sections: [
      ['Who we are', `${C.legalEntity} ("we") is responsible for personal information under its control. Registered address: ${C.address}. Jurisdiction: ${C.jurisdiction}. Our Privacy Officer can be reached at ${C.privacyEmail}.`],
      ['Information we collect', 'From partner businesses: business contact details, account information and payment details needed to compensate approved contributions. From contributed datasets: only the fields a partner is authorized to disclose and that are needed for the purposes below. Website visitors: basic technical information such as device type and pages viewed.'],
      ['Purposes', 'Operating the partner program; verifying eligibility and authorization; training, testing and evaluating machine learning models; producing aggregated, de-identified market intelligence; meeting legal obligations. We do not use contributed personal information for purposes beyond those disclosed in the Data Partnership Agreement without new authorization.'],
      ['Consent and authority', 'We rely on the contributing business to have obtained meaningful consent or to hold other lawful authority to disclose personal information to us. We require documentation of that authority before accepting personal information, and we refuse records where it is missing.'],
      ['Canadian requirements', 'We aim to meet the Personal Information Protection and Electronic Documents Act (PIPEDA), Quebec’s Act respecting the protection of personal information in the private sector (Law 25), and the Alberta and British Columbia Personal Information Protection Acts where they apply. We do not use contributed information to send commercial electronic messages, which are governed by Canada’s Anti-Spam Legislation (CASL).'],
      ['US requirements', 'Where state privacy laws apply, including the California Consumer Privacy Act as amended by the CPRA and comparable laws in other states, residents may have rights to know, access, correct, delete and opt out of the sale or sharing of personal information. Depending on our activities, we may be required to register as a data broker in states such as California, Texas, Oregon and Vermont, and to honour deletion requests received through official state mechanisms.'],
      ['Cross-border processing', 'Information may be stored or processed in Canada or the United States and may be accessible to courts, law enforcement and national security authorities of those jurisdictions.'],
      ['Retention and deletion', 'We keep personal information only as long as needed for the purposes above, then delete it or de-identify it irreversibly. Rejected records are deleted.'],
      ['Safeguards', 'We use administrative, technical and physical safeguards appropriate to the sensitivity of the information, including encryption, role-based access and logging. No method of transmission or storage is completely secure.'],
      ['Your rights and requests', `Individuals may request access to, correction of, or deletion of their personal information, or withdraw consent, by contacting ${C.privacyEmail}. We will verify the request and respond within the time required by applicable law. You may also contact the Office of the Privacy Commissioner of Canada or your provincial or state regulator.`],
      ['Changes', 'We will post updates here and notify partners of material changes.'],
    ],
  },
  terms: {
    title: 'Terms of Service',
    sections: [
      ['Agreement', `These Terms govern use of the Quantoxi website and partner portal, operated by ${C.legalEntity}. By using them you agree to these Terms.`],
      ['Eligibility', 'The partner program is open to businesses operating in Canada or the United States, represented by a person with authority to bind the business.'],
      ['Accounts', 'You are responsible for keeping your credentials secure and for activity under your account. Tell us promptly about any unauthorized use.'],
      ['Estimates are not offers', 'Figures shown by the earnings calculator, dashboards and marketing materials are estimates or illustrations. Compensation is owed only for records approved under a signed Data Partnership Agreement.'],
      ['Acceptable use', 'You must not submit data you are not authorized to disclose, data obtained by scraping or purchase without authority, sensitive categories of personal information, or information about minors.'],
      ['Intellectual property', 'The site, models, software and brand are owned by Quantoxi or its licensors.'],
      ['Disclaimers and liability', 'The site is provided as is. To the extent permitted by law, our liability is limited to the amounts paid to you in the 12 months before a claim.'],
      ['Governing law', `These Terms are governed by the laws of ${C.jurisdiction}, subject to any consumer or privacy protections that cannot be waived.`],
      ['Contact', C.email],
    ],
  },
  agreement: {
    title: 'Data Partnership Agreement',
    sections: [
      ['Parties', `This Agreement is between ${C.legalEntity} and the business identified at registration ("Partner").`],
      ['Intended uses', 'Contributed data will be used to train, test and evaluate machine learning models, to conduct research, and to produce aggregated market intelligence and industry benchmarks. Quantoxi will not use contributed personal information to contact individuals or to send marketing messages, and will not disclose it to third parties except service providers bound by equivalent obligations or as required by law.'],
      ['Partner representations', 'Partner represents that it collected the data lawfully; that it holds documented consent or other lawful authority to disclose it to Quantoxi for the intended uses; that the data excludes sensitive categories and information about minors; and that it will provide supporting documentation on request.'],
      ['Data options', 'Partner may contribute (a) anonymized business research data, from which direct identifiers are removed before submission, or (b) explicitly authorized customer information, only with documented authority.'],
      ['Verification', 'Quantoxi reviews eligibility, authorization, formatting, quality and duplication. Quantoxi may reject any record or submission at its discretion.'],
      ['Compensation', 'Approved records are paid at the rates in effect on the submission date, currently 8¢ CAD per eligible record, where each record includes the individual’s name, email address, phone number and address. Duplicate, ineligible or rejected records are not paid. Payment is made within 48 hours after approval by the method Partner selects.'],
      ['Retention and deletion', 'Data is retained only as long as needed for the intended uses, then deleted or de-identified. Rejected records are deleted. Partner may ask that its data be deleted, subject to records already incorporated into aggregated outputs.'],
      ['Cross-border processing', 'Data may be processed in Canada or the United States.'],
      ['Privacy requests', 'Each party will cooperate to respond to individuals’ access, correction and deletion requests within legal timelines.'],
      ['Term and termination', 'Either party may end this Agreement on 30 days’ notice. Obligations on approved but unpaid records, confidentiality and data protection survive termination.'],
    ],
  },
};

export function LegalPage({ doc }) {
  const d = DOCS[doc];
  return (
    <div className="min-h-screen bg-[#F7F8FC] pb-24 pt-28">
      <div className="mx-auto max-w-3xl px-5">
        <button onClick={() => go('')} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900"><ArrowLeft size={16} /> Back to site</button>
        <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight text-slate-900">{d.title}</h1>
        <p className="mt-2 text-sm text-slate-500">Effective November 19, 2026</p>
        <div className="mt-10 space-y-8">
          {d.sections.map(([h, t], i) => (
            <section key={h}>
              <h2 className="font-display text-lg font-semibold text-slate-900"><span className="mr-2 font-mono text-sm text-violet-600">{String(i + 1).padStart(2, '0')}</span>{h}</h2>
              <p className="mt-2 leading-relaxed text-slate-600">{t}</p>
            </section>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap gap-2 border-t border-slate-200 pt-6">
          {Object.entries(DOCS).filter(([k]) => k !== doc).map(([k, v]) => <button key={k} onClick={() => go(k)} className="rounded-full bg-white px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-200 hover:ring-slate-300">{v.title}</button>)}
        </div>
      </div>
    </div>
  );
}

export function Login() {
  return (
    <div className="relative grid min-h-screen place-items-center bg-midnight-950 px-5 pb-16 pt-28">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-25" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-600/20 blur-[100px]" />
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md rounded-3xl border border-white/10 bg-midnight-900/80 p-8 backdrop-blur-xl">
        <div className="text-white"><Logo /></div>
        <h1 className="mt-8 font-display text-2xl font-semibold text-white">Partner Login</h1>
        <p className="mt-2 text-sm text-slate-400">The Quantoxi partner portal is available by invitation to approved data partners.</p>
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
          <div className="flex items-center gap-2 font-medium text-white"><Lock size={15} className="text-cyan-300" /> Need access?</div>
          <p className="mt-1.5 text-slate-400">Contact our partnerships team at {company.email} or {company.phone} and we will set up your account.</p>
        </div>
        <div className="mt-6 grid gap-3">
          <Button onClick={() => navigateToSection('contact', true)} className="w-full"><UserPlus size={16} /> Contact Us</Button>
        </div>
      </motion.div>
    </div>
  );
}
