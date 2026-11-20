import { useEffect, useState } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import Nav from './components/Nav';
import { Hero, Stats, Calculator, HowItWorks } from './components/SectionsA';
import { Industries, CRM, Security, FAQ, FinalCTA, Footer } from './components/SectionsB';
import Dashboard from './pages/Dashboard';
import { LegalPage, Login } from './pages/Legal';
import { Logo } from './components/ui';

/* Hash routes: '' (home), dashboard, login, privacy, terms, agreement */
const ROUTES = ['dashboard', 'login', 'privacy', 'terms', 'agreement'];
const TITLES = { '': 'Quantoxi | Your Data. Tomorrow’s Intelligence.', dashboard: 'Partner Dashboard (Demo) | Quantoxi', login: 'Partner Login | Quantoxi', privacy: 'Privacy Policy | Quantoxi', terms: 'Terms of Service | Quantoxi', agreement: 'Data Partnership Agreement | Quantoxi' };
const readRoute = () => { const h = window.location.hash.replace('#', ''); return ROUTES.includes(h) ? h : ''; };

function Loader() {
  return (
    <motion.div className="fixed inset-0 z-[100] grid place-items-center bg-midnight-950" initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.6 } }} aria-label="Loading">
      <div className="flex flex-col items-center gap-5 text-white">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}><Logo size={52} withText={false} /></motion.div>
        <div className="h-0.5 w-40 overflow-hidden rounded-full bg-white/10"><motion.div className="h-full bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-300" initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ duration: 1, repeat: Infinity }} /></div>
      </div>
    </motion.div>
  );
}

export default function App() {
  const [route, setRoute] = useState(readRoute());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    const on = () => { const r = readRoute(); setRoute((prev) => { if (prev !== r) window.scrollTo(0, 0); return r; }); };
    window.addEventListener('hashchange', on);
    return () => { clearTimeout(t); window.removeEventListener('hashchange', on); };
  }, []);
  useEffect(() => { document.title = TITLES[route]; }, [route]);

  let page;
  if (route === 'dashboard') page = <Dashboard />;
  else if (route === 'login') page = <Login />;
  else if (['privacy', 'terms', 'agreement'].includes(route)) page = <LegalPage doc={route} />;
  else page = (
    <main>
      <Hero /><Stats /><Calculator /><HowItWorks /><Industries /><CRM /><Security /><FAQ /><FinalCTA />
    </main>
  );

  return (
    <MotionConfig reducedMotion="user">
      <a href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus(); }} className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-slate-900">Skip to content</a>
      <AnimatePresence>{loading && <Loader key="l" />}</AnimatePresence>
      {route !== 'dashboard' && <Nav route={route} />}
      <AnimatePresence mode="wait">
        <motion.div id="main" tabIndex={-1} key={route || 'home'} className="outline-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
          {page}
          {route !== 'dashboard' && <Footer route={route} />}
        </motion.div>
      </AnimatePresence>
    </MotionConfig>
  );
}
