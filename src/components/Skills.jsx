import { skillGroups } from '../data/content.js';
import Reveal from './Reveal.jsx';
import SectionHead from './SectionHead.jsx';

export default function Skills() {
  return (
    <section id="skills" className="section skills">
      <div className="wrap">
        <SectionHead
          no="03"
          kicker="THE STACK"
          title="Tools I build with."
          desc="Code, chain, AI and culture. The mix is the point."
        />
        <div className="skill-grid">
          {skillGroups.map((g, i) => (
            <Reveal key={g.title} className="skill-block" delay={(i % 3) * 0.07}>
              <h3>
                <span>{String(i + 1).padStart(2, '0')}</span>
                {g.title}
              </h3>
              <div className="chips">
                {g.items.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
