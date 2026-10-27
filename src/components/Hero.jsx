import { roles } from '../data/content.js';
import useTyped from '../hooks/useTyped.js';

export default function Hero() {
  const typed = useTyped(roles);

  return (
    <section className="hero" id="top">
      <div className="hero-bg" aria-hidden="true" />
      <div className="wrap hero-inner">
        <div className="hero-content">
          <div className="eyebrow">WEB3 CREATIVE / DEVELOPER / AI</div>
          <h1>
            I CREATE.
            <br />
            <span className="stroke">I BUILD.</span>
            <br />
            <span className="accent">I MOVE.</span>
          </h1>
          <p className="now" aria-label="Currently working on">
            <span className="now-label">NOW MAKING →</span>
            <span className="typed">{typed}</span>
            <i className="caret" aria-hidden="true" />
          </p>
          <p className="hero-copy">
            I turn ideas into attention, communities into movements, and code into products people use.
            Exploring the edge of Web3, full-stack development, culture and AI.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#skills">
              EXPLORE MY WORK <span>↗</span>
            </a>
            <a className="btn btn-ghost" href="#contact">
              WORK WITH ME <span>↗</span>
            </a>
          </div>
        </div>

        <div className="hero-art">
          <div className="term" role="img" aria-label="Terminal showing who BlaqHakinz is and what he is building">
            <div className="term-bar">
              <i /> <i /> <i />
              <span>blaqhakinz — zsh</span>
            </div>
            <div className="term-body">
              <div className="t-line" style={{ '--i': 0 }}>
                <b>~/blaqhakinz</b> <em>$</em> whoami
              </div>
              <div className="t-line out" style={{ '--i': 1 }}>
                web3 creative · full-stack dev
              </div>
              <div className="t-line" style={{ '--i': 2 }}>
                <b>~/blaqhakinz</b> <em>$</em> stack --now
              </div>
              <div className="t-line out" style={{ '--i': 3 }}>
                react · node · prisma · solana
              </div>
              <div className="t-line" style={{ '--i': 4 }}>
                <b>~/blaqhakinz</b> <em>$</em> status
              </div>
              <div className="t-line out ok" style={{ '--i': 5 }}>
                ● building TradeAI + Timekeep
              </div>
              <div className="t-line" style={{ '--i': 6 }}>
                <b>~/blaqhakinz</b> <em>$</em> <i className="caret" />
              </div>
            </div>
          </div>

          <svg className="badge-ring" viewBox="0 0 120 120" aria-hidden="true">
            <defs>
              <path
                id="ring-path"
                d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0"
              />
            </defs>
            <text>
              <textPath href="#ring-path" textLength="272" lengthAdjust="spacing">
                OPEN TO COLLABORATIONS • AVAILABLE NOW •{' '}
              </textPath>
            </text>
            <circle cx="60" cy="60" r="7" />
          </svg>
        </div>
      </div>
      <div className="wrap">
        <div className="hero-note">
          <span>INDEPENDENT CREATIVE PARTNER</span>
          <span>01 / 08 — THE INTRODUCTION</span>
        </div>
      </div>
    </section>
  );
}
