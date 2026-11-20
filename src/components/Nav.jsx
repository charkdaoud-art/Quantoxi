import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogIn } from 'lucide-react';
import { Logo, go, scrollToId } from './ui';

export const NAV = [
  { label: 'Home', id: 'top' },
  { label: 'Data Partnerships', id: 'calculator' },
  { label: 'Industries', id: 'industries' },
  { label: 'Security & Privacy', id: 'security' },
  { label: 'FAQ', id: 'faq' },
];

export function navigateToSection(id, route) {
  if (route) {
    go('');
    setTimeout(() => scrollToId(id), 80);
  } else scrollToId(id);
}

export default function Nav({ route }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('top');

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    if (route) return;
    const obs = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    );
    NAV.forEach((n) => { const el = document.getElementById(n.id); el && obs.observe(el); });
    return () => obs.disconnect();
  }, [route]);

  const click = (id) => { setOpen(false); navigateToSection(id, route); };

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:pt-4">
      <nav
        aria-label="Primary"
        className={`flex w-full max-w-7xl items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-500 sm:px-5 ${
          scrolled || route ? 'border border-white/10 bg-midnight-900/90 shadow-[0_10px_40px_-10px_rgba(0,0,0,.6)] backdrop-blur-xl' : 'border border-transparent'
        }`}
      >
        <button onClick={() => click('top')} className="rounded-lg text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300" aria-label="Quantoxi home">
          <Logo />
        </button>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <li key={n.id}>
              <button
                onClick={() => click(n.id)}
                className={`relative rounded-full px-3.5 py-2 text-[13px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${
                  !route && active === n.id ? 'text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                {!route && active === n.id && (
                  <motion.span layoutId="navpill" className="absolute inset-0 rounded-full bg-white/[0.08] ring-1 ring-white/10" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
                )}
                <span className="relative">{n.label}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          <button onClick={() => go('login')} className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-medium text-slate-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">
            <LogIn size={15} /> Partner Login
          </button>
          <button onClick={() => go('onboarding')} className="rounded-full bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 px-4 py-2 text-[13px] font-semibold text-white shadow-[0_6px_24px_-6px_rgba(99,102,241,.8)] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">
            Become a Partner
          </button>
        </div>

        <button className="rounded-lg p-2 text-white lg:hidden" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="absolute inset-x-3 top-[72px] rounded-2xl border border-white/10 bg-midnight-900/95 p-3 backdrop-blur-xl lg:hidden"
          >
            {NAV.map((n) => (
              <button key={n.id} onClick={() => click(n.id)} className="block w-full rounded-xl px-4 py-3 text-left text-slate-200 hover:bg-white/5">{n.label}</button>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-white/10 pt-3">
              <button onClick={() => { setOpen(false); go('login'); }} className="rounded-xl bg-white/5 px-4 py-3 text-sm font-medium text-white">Partner Login</button>
              <button onClick={() => { setOpen(false); go('onboarding'); }} className="rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-4 py-3 text-sm font-semibold text-white">Become a Partner</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
