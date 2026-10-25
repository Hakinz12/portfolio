import { useCallback, useEffect, useRef, useState } from 'react';
import { navLinks } from './data/content.js';
import useScrollSpy from './hooks/useScrollSpy.js';
import CursorGlow from './components/CursorGlow.jsx';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import Ticker from './components/Ticker.jsx';
import Projects from './components/Projects.jsx';
import Skills from './components/Skills.jsx';
import Journey from './components/Journey.jsx';
import Services from './components/Services.jsx';
import About from './components/About.jsx';
import Arcade from './components/Arcade.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import CommandPalette from './components/CommandPalette.jsx';
import AgentChat from './components/AgentChat.jsx';

const sectionIds = ['top', ...navLinks.map((l) => l.id)];

export default function App() {
  const active = useScrollSpy(sectionIds);
  const [palette, setPalette] = useState(false);
  const [toast, setToast] = useState('');
  const [draft, setDraft] = useState(null);
  const timer = useRef(0);

  const notify = useCallback((msg) => {
    setToast(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(''), 2600);
  }, []);

  const closePalette = useCallback(() => setPalette(false), []);

  useEffect(() => {
    const onKey = (e) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || '');
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPalette((v) => !v);
      } else if (e.key === '/' && !typing) {
        e.preventDefault();
        setPalette(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <a className="skip" href="#work">
        Skip to content
      </a>
      <CursorGlow />
      <Nav active={active} onOpenPalette={() => setPalette(true)} />
      <main>
        <Hero />
        <Ticker />
        <Projects />
        <Skills />
        <Journey />
        <Services />
        <About />
        <Arcade />
        <Contact notify={notify} draft={draft} />
      </main>
      <Footer />
      <CommandPalette open={palette} onClose={closePalette} notify={notify} />
      <AgentChat onDraft={setDraft} notify={notify} />
      <div className={`toast ${toast ? 'show' : ''}`} role="status" aria-live="polite">
        {toast}
      </div>
    </>
  );
}
