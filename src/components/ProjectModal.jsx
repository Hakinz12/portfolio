import { useEffect, useRef } from 'react';
import { scrollToId } from '../utils.js';

export default function ProjectModal({ project, onClose }) {
  const dialog = useRef(null);
  const closeBtn = useRef(null);

  useEffect(() => {
    if (!project) return;
    const previous = document.activeElement;
    document.body.style.overflow = 'hidden';
    closeBtn.current?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab' && dialog.current) {
        const f = dialog.current.querySelectorAll('a[href], button:not([disabled])');
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      previous && previous.focus && previous.focus();
    };
  }, [project, onClose]);

  if (!project) return null;

  const talk = () => {
    onClose();
    setTimeout(() => scrollToId('contact'), 60);
  };

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        className={`modal theme-${project.theme}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        ref={dialog}
      >
        <button className="modal-close" onClick={onClose} ref={closeBtn} aria-label="Close project details">
          ✕
        </button>
        <div className="modal-visual">
          <span className="visual-word">{project.word}</span>
        </div>
        <div className="modal-body">
          <div className="modal-meta">
            <span className="pill">{project.category === 'dev' ? 'DEVELOPMENT' : 'CREATIVE'}</span>
            {project.status && <span className="pill live">{project.status}</span>}
          </div>
          <h3 id="modal-title">{project.title || project.word}</h3>
          <div className="modal-kind">{project.kind}</div>
          <p className="modal-summary">{project.summary}</p>

          <h4>HIGHLIGHTS</h4>
          <ul className="modal-list">
            {project.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>

          <h4>TAGS</h4>
          <div className="chips">
            {project.tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>

          <div className="modal-actions">
            {project.links.map((l) => (
              <a key={l.href} className="btn btn-primary" href={l.href} target="_blank" rel="noreferrer">
                {l.label} <span>↗</span>
              </a>
            ))}
            <button className="btn btn-ghost" onClick={talk}>
              DISCUSS A SIMILAR PROJECT <span>↗</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
