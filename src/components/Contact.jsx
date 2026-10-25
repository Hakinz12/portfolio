import { useEffect, useRef, useState } from 'react';
import { contact, projectTypes } from '../data/content.js';
import { copyText, scrollToId } from '../utils.js';
import Reveal from './Reveal.jsx';

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const blank = { name: '', email: '', type: projectTypes[0], message: '' };

export default function Contact({ notify, draft }) {
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [serverMsg, setServerMsg] = useState('');
  const [fromAgent, setFromAgent] = useState(false);
  const [sentTo, setSentTo] = useState('');
  const sendBtn = useRef(null);
  const trap = useRef(null);

  const live = Boolean(contact.formEndpoint);

  // a draft handed over by the AI assistant
  useEffect(() => {
    if (!draft) return;
    setForm({ name: draft.name, email: draft.email, type: draft.type, message: draft.message });
    setErrors({});
    setStatus('idle');
    setServerMsg('');
    setFromAgent(true);
    const t = setTimeout(() => {
      scrollToId('contact');
      sendBtn.current && sendBtn.current.focus({ preventScroll: true });
    }, 150);
    return () => clearTimeout(t);
  }, [draft]);

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: '' }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (status === 'sending') return;
    const er = {};
    if (!form.name.trim()) er.name = 'Tell me your name.';
    if (!emailOk(form.email.trim())) er.email = 'Enter a valid email.';
    if (form.message.trim().length < 10) er.message = 'A few more words please (10+ characters).';
    setErrors(er);
    if (Object.keys(er).length) return;

    // bots fill hidden fields, people don't
    if (trap.current && trap.current.value) {
      setStatus('sent');
      setSentTo(form.email.trim());
      return;
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      type: form.type,
      message: form.message.trim(),
    };

    if (!live) {
      const subject = `[${payload.type}] Hello from ${payload.name}`;
      const body = `${payload.message}\n\n— ${payload.name}\n${payload.email}`;
      notify('Opening your email app…');
      window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      return;
    }

    setStatus('sending');
    setServerMsg('');
    try {
      const res = await fetch(contact.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...payload, _subject: `[${payload.type}] New enquiry from ${payload.name}` }),
      });
      if (res.ok) {
        setSentTo(payload.email);
        setStatus('sent');
        setForm(blank);
        setFromAgent(false);
        notify('Message sent');
      } else {
        let msg = '';
        try {
          const data = await res.json();
          msg = (data.errors || []).map((x) => x.message).join(' ');
        } catch {
          /* no JSON body */
        }
        setServerMsg(msg || 'The message could not be sent. Try again, or copy my email and write directly.');
        setStatus('error');
      }
    } catch {
      setServerMsg('No connection to the mail service. Check your network and try again, or copy my email and write directly.');
      setStatus('error');
    }
  };

  const copyEmail = async () => {
    const ok = await copyText(contact.email);
    notify(ok ? 'Email copied to clipboard' : `Email: ${contact.email}`);
  };

  return (
    <section className="section contact" id="contact">
      <div className="wrap">
        <Reveal className="contact-box">
          <div className="contact-left">
            <div className="sh-left">
              <span className="sh-no">08</span>
              <div className="kicker">HAVE A GOOD ONE IN MIND?</div>
            </div>
            <h2>
              Let's make
              <br />
              <span>something matter.</span>
            </h2>
            <p>
              Have a Web3 project, campaign, product or creative idea that needs a fresh perspective? Send a
              note, or ask the assistant to start the enquiry for you.
            </p>
            <div className="contact-links">
              <button type="button" onClick={copyEmail}>
                COPY EMAIL ⧉
              </button>
              <a href={contact.x} target="_blank" rel="noreferrer">
                X / TWITTER ↗
              </a>
              <a href={contact.telegram} target="_blank" rel="noreferrer">
                TELEGRAM ↗
              </a>
            </div>
          </div>

          {status === 'sent' ? (
            <div className="form-sent" role="status">
              <span className="sent-mark" aria-hidden="true">
                ✓
              </span>
              <h3>Message sent.</h3>
              <p>Thanks. A reply will go to {sentTo}.</p>
              <button type="button" className="btn btn-ghost" onClick={() => setStatus('idle')}>
                SEND ANOTHER <span>↗</span>
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={submit} noValidate>
              {fromAgent && (
                <p className="form-draft" role="status">
                  Drafted by the assistant. Check it, change anything you like, then send.
                </p>
              )}
              <div className={`field ${errors.name ? 'bad' : ''}`}>
                <label htmlFor="cf-name">NAME</label>
                <input id="cf-name" value={form.name} onChange={set('name')} autoComplete="name" />
                {errors.name && <small role="alert">{errors.name}</small>}
              </div>
              <div className={`field ${errors.email ? 'bad' : ''}`}>
                <label htmlFor="cf-email">EMAIL</label>
                <input id="cf-email" type="email" value={form.email} onChange={set('email')} autoComplete="email" />
                {errors.email && <small role="alert">{errors.email}</small>}
              </div>
              <div className="field">
                <label htmlFor="cf-type">WHAT'S IT ABOUT?</label>
                <select id="cf-type" value={form.type} onChange={set('type')}>
                  {projectTypes.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className={`field ${errors.message ? 'bad' : ''}`}>
                <label htmlFor="cf-msg">MESSAGE</label>
                <textarea id="cf-msg" rows="5" value={form.message} onChange={set('message')} />
                {errors.message && <small role="alert">{errors.message}</small>}
              </div>

              <input ref={trap} className="hp" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" />

              {status === 'error' && (
                <p className="form-error" role="alert">
                  {serverMsg}
                </p>
              )}

              <button className="btn btn-primary" type="submit" ref={sendBtn} disabled={status === 'sending'}>
                {status === 'sending' ? 'SENDING…' : 'SEND MESSAGE'} <span>↗</span>
              </button>
              <p className="form-note">
                {live
                  ? 'Goes straight to my inbox. No account needed.'
                  : 'This opens your email app with the message ready to send.'}
              </p>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
