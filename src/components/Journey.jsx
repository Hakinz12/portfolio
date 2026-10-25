import { journey } from '../data/content.js';
import Reveal from './Reveal.jsx';
import SectionHead from './SectionHead.jsx';

export default function Journey() {
  return (
    <section id="journey" className="section">
      <div className="wrap">
        <SectionHead
          no="04"
          kicker="THE JOURNEY"
          title="Where I've been, what's next."
          desc="From Web3 creative work into full-stack engineering, with both still running side by side."
        />
        <ol className="timeline">
          {journey.map((j, i) => (
            <Reveal as="li" key={j.title} className="tl-item" delay={Math.min(i, 4) * 0.06}>
              <span className="tl-when">{j.when}</span>
              <div className="tl-main">
                <h3>{j.title}</h3>
                <div className="tl-org">{j.org}</div>
                <p>{j.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
