import Reveal from './Reveal.jsx';

export default function SectionHead({ no, kicker, title, desc }) {
  return (
    <Reveal className="section-head">
      <div className="sh-left">
        <span className="sh-no">{no}</span>
        <div>
          <div className="kicker">{kicker}</div>
          <h2 className="section-title">{title}</h2>
        </div>
      </div>
      {desc && <p className="section-desc">{desc}</p>}
    </Reveal>
  );
}
