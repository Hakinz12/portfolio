import { useEffect, useMemo, useRef, useState } from 'react';
import { contact, navLinks } from '../data/content.js';
import { copyText, scrollToId } from '../utils.js';

export default function CommandPalette({ open, onClose, notify }) {
  const [q, setQ] = useState('');
  const [idx, setIdx] = useState(0);
  const input = useRef(null);

  const items = useMemo(
    () => [
      ...navLinks.map((l) => ({
        group: 'GO TO',
        label: l.label.charAt(0) + l.label.slice(1).toLowerCase(),
        run: () => scrollToId(l.id),
      })),
      { group: 'ACTIONS', label: 'Ask the AI assistant', run: () => window.dispatchEvent(new Event('bh:open-agent')) },
      {
        group: 'ACTIONS',
        label: 'Send email',
        run: () => {
          window.location.href = `mailto:${contact.email}`;
        },
      },
      {
        group: 'ACTIONS',
        label: 'Copy email',
        run: async () => {
          const ok = await copyText(contact.email);
          notify(ok ? 'Email copied to clipboard' : `Email: ${contact.email}`);
        },
      },
      { group: 'ACTIONS', label: 'Open X / Twitter', run: () => window.open(contact.x, '_blank', 'noopener,noreferrer') },
      { group: 'ACTIONS', label: 'Open Telegram', run: () => window.open(contact.telegram, '_blank', 'noopener,noreferrer') },
      { group: 'ACTIONS', label: 'Back to top', run: () => scrollToId('top') },
    ],
    [notify]
  );

  const results = items.filter((i) => i.label.toLowerCase().includes(q.trim().toLowerCase()));

  useEffect(() => {
    if (!open) return;
    setQ('');
    setIdx(0);
    const t = setTimeout(() => input.current?.focus(), 20);
    document.body.style.overflow = 'hidden';
    return () => {
      clearTimeout(t);
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => setIdx(0), [q]);

  if (!open) return null;

  const run = (item) => {
    if (!item) return;
    onClose();
    setTimeout(() => item.run(), 40);
  };

  const onKey = (e) => {
    if (e.key === 'Escape') onClose();
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIdx((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      run(results[idx]);
    }
  };

  let lastGroup = '';

  return (
    <div className="modal-backdrop top" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="palette" role="dialog" aria-modal="true" aria-label="Command menu" onKeyDown={onKey}>
        <div className="palette-input">
          <span aria-hidden="true">⌕</span>
          <input
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Jump to a section or run an action…"
            aria-label="Search commands"
          />
          <kbd>ESC</kbd>
        </div>
        <ul className="palette-list">
          {results.length === 0 && <li className="empty">No matches</li>}
          {results.map((r, i) => {
            const header = r.group !== lastGroup ? r.group : null;
            lastGroup = r.group;
            return (
              <li key={r.group + r.label} className={header ? 'has-head' : ''}>
                {header && <div className="palette-group">{header}</div>}
                <button
                  className={i === idx ? 'sel' : ''}
                  onMouseEnter={() => setIdx(i)}
                  onClick={() => run(r)}
                >
                  {r.label}
                  <span>↵</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
