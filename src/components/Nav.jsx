import { useEffect, useState } from 'react';
import { navLinks } from '../data/content.js';
import ScrollProgress from './ScrollProgress.jsx';

export default function Nav({ active, onOpenPalette }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <header className="site-header">
      <div className="wrap nav-inner">
        <a className="brand" href="#top" onClick={() => setOpen(false)}>
          BLAQ<span>HAKINZ</span>.
        </a>

        <nav className="navlinks" aria-label="Primary">
          {navLinks.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className={active === l.id ? 'active' : ''}
              aria-current={active === l.id ? 'true' : undefined}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <button className="kbd-btn" onClick={onOpenPalette} aria-label="Open command menu">
            <kbd>⌘</kbd>
            <kbd>K</kbd>
          </button>
          <a className="nav-cta" href="#contact">
            LET'S TALK ↗
          </a>
          <button
            className={`burger ${open ? 'open' : ''}`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="mobile-menu">
          <div className="wrap">
            {navLinks.map((l, i) => (
              <a key={l.id} href={`#${l.id}`} onClick={() => setOpen(false)}>
                <span>{String(i + 2).padStart(2, '0')}</span>
                {l.label}
              </a>
            ))}
            <button
              className="mm-palette"
              onClick={() => {
                setOpen(false);
                onOpenPalette();
              }}
            >
              QUICK JUMP ⌕
            </button>
          </div>
        </div>
      )}

      <ScrollProgress />
    </header>
  );
}
