import Reveal from './Reveal.jsx';
import SectionHead from './SectionHead.jsx';
import Game from './Game.jsx';

export default function Arcade() {
  return (
    <section id="play" className="section arcade">
      <div className="wrap">
        <SectionHead
          no="07"
          kicker="ARCADE"
          title="Catch the pump."
          desc="A tiny game I built for this site with React and a canvas. Beat your best score."
        />
        <div className="arcade-grid">
          <Reveal className="g-info">
            <h3>HOW TO PLAY</h3>
            <ul className="g-legend">
              <li>
                <i className="sw candle" />
                <b>Green candle</b>
                <span>+10 points</span>
              </li>
              <li>
                <i className="sw coin" />
                <b>Coin</b>
                <span>+25 points</span>
              </li>
              <li>
                <i className="sw rug" />
                <b>Rug</b>
                <span>Costs a life</span>
              </li>
            </ul>
            <p>
              Catch five in a row to raise your combo multiplier, up to x4. Missing a candle resets it. Things
              fall faster as your score climbs, and three rugs end the run.
            </p>
            <div className="g-keys">
              <span>
                <kbd>←</kbd>
                <kbd>→</kbd> or <kbd>A</kbd>
                <kbd>D</kbd> to move
              </span>
              <span>
                <kbd>P</kbd> or <kbd>ESC</kbd> to pause
              </span>
              <span>Drag with mouse or finger</span>
            </div>
            <div className="chips">
              <span>React</span>
              <span>Canvas 2D</span>
              <span>Web Audio</span>
              <span>Chiptune BGM</span>
              <span>No libraries</span>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <Game />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
