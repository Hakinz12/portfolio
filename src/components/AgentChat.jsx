import { useCallback, useEffect, useRef, useState } from 'react';
import { agent, projectTypes } from '../data/content.js';
import { askAgent } from '../agent/api.js';
import { localAnswer } from '../agent/local.js';

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const MAX_LEN = 500;

const suggestionChips = () => [
  ...agent.suggestions.map((label) => ({ label, kind: 'ask' })),
  { label: 'Start a project enquiry', kind: 'enquiry' },
];

export default function AgentChat({ onDraft, notify }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([{ id: 1, role: 'assistant', text: agent.intro, chips: suggestionChips() }]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState('ai'); // ai | offline
  const [intake, setIntake] = useState(null); // { step, data }
  const idRef = useRef(1);
  const msgsRef = useRef(msgs);
  msgsRef.current = msgs;
  const logRef = useRef(null);
  const inputRef = useRef(null);
  const fabRef = useRef(null);

  const push = useCallback((role, text, extra = {}) => {
    const id = ++idRef.current;
    setMsgs((m) => [...m, { id, role, text, ...extra }]);
    return id;
  }, []);

  // keep the newest message in view
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, busy, open]);

  // open from the command palette
  useEffect(() => {
    const openIt = () => setOpen(true);
    window.addEventListener('bh:open-agent', openIt);
    return () => window.removeEventListener('bh:open-agent', openIt);
  }, []);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current && inputRef.current.focus({ preventScroll: true }), 40);
      return () => clearTimeout(t);
    }
  }, [open]);

  const close = () => {
    setOpen(false);
    setTimeout(() => fabRef.current && fabRef.current.focus({ preventScroll: true }), 30);
  };

  // ---------- enquiry flow ----------
  const ask = (text, extra) => push('assistant', text, { intake: true, ...extra });

  const startIntake = () => {
    setIntake({ step: 'name', data: {} });
    ask("Happy to help you get a project started. What's your name? (Type cancel to stop.)", {
      chips: [{ label: 'Cancel', kind: 'cancel' }],
    });
  };

  const chooseType = (label) => {
    if (!intake || intake.step !== 'type') return;
    push('user', label, { intake: true });
    setIntake({ step: 'message', data: { ...intake.data, type: label } });
    ask('Last one. Describe the project or idea in a few sentences.');
  };

  const handleIntake = (text) => {
    const { step, data } = intake;
    if (/^cancel$/i.test(text)) {
      setIntake(null);
      push('assistant', 'No problem, the enquiry is cancelled. Ask me anything else.', { intake: true, chips: suggestionChips() });
      return;
    }
    if (step === 'name') {
      if (text.length < 2) return ask('Could you give me a name to use?');
      setIntake({ step: 'email', data: { ...data, name: text.slice(0, 80) } });
      return ask(`Nice to meet you, ${text.slice(0, 80)}. What email should BlaqHakinz reply to?`);
    }
    if (step === 'email') {
      if (!emailOk(text)) return ask("That doesn't look like an email address. Try something like name@example.com.");
      setIntake({ step: 'type', data: { ...data, email: text.slice(0, 120) } });
      return ask('What is it about?', {
        chips: [...projectTypes.map((label) => ({ label, kind: 'type' })), { label: 'Cancel', kind: 'cancel' }],
      });
    }
    if (step === 'type') {
      const hit = projectTypes.find((t) => t.toLowerCase() === text.toLowerCase());
      return chooseType(hit || projectTypes[projectTypes.length - 1]);
    }
    if (step === 'message') {
      if (text.length < 10) return ask('A few more words please, at least 10 characters, so the reply can be useful.');
      const draft = { ...data, message: text };
      setIntake({ step: 'confirm', data: draft });
      return ask('Here is your draft. Check it, then I will fill in the contact form for you.', { draft });
    }
  };

  const useDraft = (id, draft) => {
    setMsgs((m) => m.map((x) => (x.id === id ? { ...x, used: true } : x)));
    onDraft({ ...draft, id: Date.now() });
    setIntake(null);
    push('assistant', 'Done. The contact form is filled in. Check it and press send.', { intake: true });
    notify && notify('Draft ready in the contact form');
    setOpen(false);
  };

  // ---------- chat ----------
  const send = async (raw) => {
    const text = raw.trim().slice(0, MAX_LEN);
    if (!text || busy) return;
    setInput('');
    push('user', text, intake ? { intake: true } : {});
    if (intake) {
      handleIntake(text);
      return;
    }

    setBusy(true);
    let result;
    if (mode === 'ai') {
      const history = [...msgsRef.current, { role: 'user', text }]
        .filter((m) => !m.intake && (m.role === 'user' || m.role === 'assistant'))
        .slice(-10)
        .map((m) => ({ role: m.role, text: m.text }));
      const ctl = new AbortController();
      const timer = setTimeout(() => ctl.abort(), 20000);
      try {
        result = await askAgent(history, agent.endpoint, ctl.signal);
      } catch (err) {
        const st = err && err.status;
        if (st === 429) {
          result = { reply: 'That is a lot of questions at once. Give it a minute, then try again.', startEnquiry: false };
        } else {
          if (!st || st === 404 || st === 405 || st === 501 || st === 503) setMode('offline');
          result = localAnswer(text);
        }
      } finally {
        clearTimeout(timer);
      }
    } else {
      result = localAnswer(text);
    }
    setBusy(false);
    push('assistant', result.reply);
    if (result.startEnquiry) startIntake();
  };

  const runChip = (chip) => {
    if (chip.kind === 'ask') send(chip.label);
    else if (chip.kind === 'enquiry') {
      push('user', chip.label);
      startIntake();
    } else if (chip.kind === 'type') chooseType(chip.label);
    else if (chip.kind === 'cancel') send('cancel');
  };

  const lastId = msgs[msgs.length - 1].id;

  if (!open) {
    return (
      <button ref={fabRef} className="agent-fab" onClick={() => setOpen(true)} aria-label="Open the AI assistant">
        <i aria-hidden="true" />
        ASK AI
      </button>
    );
  }

  return (
    <section
      className="agent"
      aria-label="Portfolio assistant"
      onKeyDown={(e) => {
        if (e.key === 'Escape') close();
      }}
    >
      <header className="agent-head">
        <div>
          <strong>{agent.name}</strong>
          <span className={`agent-mode ${mode}`}>{mode === 'ai' ? 'AI' : 'OFFLINE'}</span>
        </div>
        <button className="agent-x" onClick={close} aria-label="Close the assistant">
          ✕
        </button>
      </header>

      {mode === 'offline' && (
        <p className="agent-note">The AI service is not reachable, so answers come from this site's own content.</p>
      )}

      <div className="agent-log" ref={logRef} role="log" aria-live="polite">
        {msgs.map((m) => (
          <div key={m.id} className={`msg ${m.role}`}>
            <p>{m.text}</p>

            {m.draft && (
              <div className="draft-card">
                <dl>
                  <div>
                    <dt>NAME</dt>
                    <dd>{m.draft.name}</dd>
                  </div>
                  <div>
                    <dt>EMAIL</dt>
                    <dd>{m.draft.email}</dd>
                  </div>
                  <div>
                    <dt>ABOUT</dt>
                    <dd>{m.draft.type}</dd>
                  </div>
                  <div>
                    <dt>MESSAGE</dt>
                    <dd>{m.draft.message}</dd>
                  </div>
                </dl>
                <button className="btn btn-primary" disabled={m.used} onClick={() => useDraft(m.id, m.draft)}>
                  {m.used ? 'FORM FILLED' : 'FILL IN THE CONTACT FORM'} <span>↗</span>
                </button>
              </div>
            )}

            {m.chips && m.id === lastId && !busy && (
              <div className="agent-chips">
                {m.chips.map((c) => (
                  <button key={c.label} onClick={() => runChip(c)}>
                    {c.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        {busy && (
          <div className="msg assistant typing" aria-label="The assistant is typing">
            <i /> <i /> <i />
          </div>
        )}
      </div>

      <form
        className="agent-form"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <label htmlFor="agent-input" className="sr-only">
          Your message
        </label>
        <input
          id="agent-input"
          ref={inputRef}
          value={input}
          maxLength={MAX_LEN}
          onChange={(e) => setInput(e.target.value)}
          placeholder={intake ? 'Type your answer…' : 'Ask about projects, stack, availability…'}
          autoComplete="off"
          enterKeyHint="send"
        />
        <button type="submit" disabled={busy || !input.trim()} aria-label="Send message">
          ↗
        </button>
      </form>
    </section>
  );
}
