import { contact, principles } from '../data/content.js';
import Reveal from './Reveal.jsx';

const idRows = [
  ['ROLE', 'Web3 developer + AI creative'],
  ['STUDYING', 'IRL Software Engineering'],
  ['TEAM', '-'],
  ['FOCUS', 'Full-stack · AI'],
  ['STATUS', 'Open to collaborations'],
];

export default function About() {
  return (
    <section id="about" className="section">
      <div className="wrap about-grid">
        <Reveal className="idcard">
          <div className="idcard-top">
            <span>ID / BH-2026</span>
            <span className="dot-live">ONLINE</span>
          </div>
          <div className="monogram">BH.</div>
          <dl>
            {idRows.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal className="about-copy" delay={0.08}>
          <div className="sh-left">
            <span className="sh-no">06</span>
            <div className="kicker">A LITTLE ABOUT ME</div>
          </div>
          <h2>
            Curious by nature.
            <br />
            <span>Creative by design.</span>
          </h2>
          <p>
            I'm BlaqHakinz, a Developer and AI exploring the intersection of internet culture,
            community and emerging technology. I'm also a software engineering student, building full-stack
            apps and Solana tools alongside my creative work.
          </p>
          <p>
            I like taking a rough idea and giving it a pulse: finding the story, shaping the visual language
            and shipping something people want to engage with. I'm always learning and experimenting with AI
            tools along the way.
          </p>
          <p>
            Good work should do more than fill a timeline. It should give people a reason to stop, feel
            something and join in.
          </p>
          <div className="principles">
            {principles.map((p) => (
              <span key={p}>{p}</span>
            ))}
          </div>
          {contact.resumeUrl && (
            <a className="btn btn-ghost" href={contact.resumeUrl} target="_blank" rel="noreferrer">
              DOWNLOAD RESUME <span>↓</span>
            </a>
          )}
        </Reveal>
      </div>
    </section>
  );
}
