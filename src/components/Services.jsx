import { services } from '../data/content.js';
import Reveal from './Reveal.jsx';
import SectionHead from './SectionHead.jsx';

export default function Services() {
  return (
    <section className="section services" id="services">
      <div className="wrap">
        <SectionHead
          no="05"
          kicker="THE TOOLKIT"
          title="Ideas into execution."
          desc="Creative thinking is only the beginning. I care about the details, the delivery and the impact."
        />
        <div className="service-list">
          {services.map((s, i) => (
            <Reveal key={s.no} className="service" delay={Math.min(i, 4) * 0.05}>
              <span className="service-no">{s.no}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              <span className="arr">↗</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
