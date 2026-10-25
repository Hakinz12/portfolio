import { useCallback, useState } from 'react';
import { projects } from '../data/content.js';
import Reveal from './Reveal.jsx';
import SectionHead from './SectionHead.jsx';
import ProjectModal from './ProjectModal.jsx';

const filters = [
  { id: 'all', label: 'ALL' },
  { id: 'creative', label: 'CREATIVE' },
  { id: 'dev', label: 'DEVELOPMENT' },
];

export default function Projects() {
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const close = useCallback(() => setSelected(null), []);

  const list = projects.filter((p) => filter === 'all' || p.category === filter);
  const count = (id) => (id === 'all' ? projects.length : projects.filter((p) => p.category === id).length);

  return (
    <section id="work" className="section">
      <div className="wrap">
        <SectionHead
          no="02"
          kicker="SELECTED WORK"
          title="Work that ships."
          desc="Creative campaigns, community work and full-stack builds. Open any card for the details."
        />

        <div className="filters" role="group" aria-label="Filter projects">
          {filters.map((f) => (
            <button
              key={f.id}
              className={filter === f.id ? 'on' : ''}
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
              <sup>{count(f.id)}</sup>
            </button>
          ))}
        </div>

        <div className={`project-grid ${filter !== 'all' ? 'filtered' : ''}`}>
          {list.map((p, i) => (
            <Reveal
              as="button"
              key={`${filter}-${p.id}`}
              delay={Math.min(i, 5) * 0.06}
              className={`pcard theme-${p.theme} ${p.featured ? 'span-2' : ''}`}
              onClick={() => setSelected(p)}
              aria-label={`Open details for ${p.title}`}
            >
              <div className="pcard-visual">
                <span className={`visual-word ${p.word.length >= 7 ? 'long' : ''}`}>{p.word}</span>
                <span className="pcard-no">{String(i + 1).padStart(2, '0')}</span>
                <span className={`pcard-cat ${p.category}`}>{p.category === 'dev' ? 'DEV' : 'CREATIVE'}</span>
                {p.status && <span className="pcard-status">{p.status}</span>}
              </div>
              <div className="pcard-body">
                <h3>{p.title}</h3>
                <p className="pcard-kind">{p.kind}</p>
                <p className="pcard-sum">{p.summary}</p>
                <div className="pcard-foot">
                  <div className="chips">
                    {p.tags.slice(0, 3).map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                  <span className="pcard-open">VIEW ↗</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <ProjectModal project={selected} onClose={close} />
    </section>
  );
}
