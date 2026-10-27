import { useEffect, useRef, useState } from 'react';
import { createEngine } from '../game/engine.js';

const KEY = 'bh-catch-the-pump-best';

const loadBest = () => {
  try {
    return Number(localStorage.getItem(KEY)) || 0;
  } catch {
    return 0;
  }
};
const saveBest = (n) => {
  try {
    localStorage.setItem(KEY, String(n));
  } catch {
    /* storage blocked: the best score just won't persist */
  }
};

// React wrapper around the canvas engine in src/game/engine.js.
export default function Game() {
  const canvas = useRef(null);
  const engine = useRef(null);
  const bestRef = useRef(loadBest());
  const [mode, setMode] = useState('idle'); // idle | playing | paused | over
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(0);
  const [best, setBest] = useState(bestRef.current);
  const [fresh, setFresh] = useState(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const eng = createEngine(canvas.current, {
      onScore: setScore,
      onLives: setLives,
      onCombo: setCombo,
      onMode: setMode,
      onOver: (final) => {
        const isBest = final > bestRef.current;
        if (isBest) {
          bestRef.current = final;
          saveBest(final);
          setBest(final);
        }
        setFresh(isBest);
      },
    });
    engine.current = eng;
    return () => {
      eng.destroy();
      engine.current = null;
    };
  }, []);

  // pause when the tab is hidden or the game scrolls out of view
  useEffect(() => {
    const pause = () => engine.current && engine.current.pause();
    const onVis = () => document.hidden && pause();
    document.addEventListener('visibilitychange', onVis);
    let io;
    if (typeof IntersectionObserver !== 'undefined' && canvas.current) {
      io = new IntersectionObserver((es) => es.forEach((e) => !e.isIntersecting && pause()), { threshold: 0.15 });
      io.observe(canvas.current);
    }
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      io && io.disconnect();
    };
  }, []);

  // P / Esc pause and resume (not while typing in a form)
  useEffect(() => {
    const onKey = (e) => {
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target?.tagName || '')) return;
      const k = e.key;
      const eng = engine.current;
      if (!eng) return;
      if (k === 'p' || k === 'P' || k === 'Escape') {
        if (eng.getMode() === 'playing') eng.pause();
        else if (eng.getMode() === 'paused' && k !== 'Escape') eng.resume();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const start = () => {
    setFresh(false);
    engine.current && engine.current.start();
    canvas.current && canvas.current.focus({ preventScroll: true });
  };
  const resume = () => engine.current && engine.current.resume();
  const togglePause = () => {
    const eng = engine.current;
    if (!eng) return;
    if (eng.getMode() === 'playing') eng.pause();
    else if (eng.getMode() === 'paused') eng.resume();
  };
  const toggleSound = () => {
    const next = !muted;
    setMuted(next);
    engine.current && engine.current.setMuted(next);
  };

  const mult = 1 + Math.min(3, Math.floor(combo / 5));

  return (
    <div className="g-wrap">
      <div className={`g-stage ${mode === 'playing' ? 'playing' : ''}`}>
        <div className="g-hud">
          <div>
            <span>SCORE</span>
            <b>{score}</b>
          </div>
          <div>
            <span>BEST</span>
            <b>{best}</b>
          </div>
          <div>
            <span>COMBO</span>
            <b className={mult > 1 ? 'hot' : ''}>x{mult}</b>
          </div>
          <div>
            <span>LIVES</span>
            <b className="lives" role="img" aria-label={`${lives} of 3 lives left`}>
              {[0, 1, 2].map((i) => (
                <i key={i} className={i < lives ? 'on' : ''} />
              ))}
            </b>
          </div>
        </div>

        <div className="g-canvas-box">
          <canvas
            ref={canvas}
            className="g-canvas"
            tabIndex={0}
            role="img"
            aria-label="Catch the Pump game. Move the paddle left and right to catch green candles and coins and avoid red rugs."
          />

          {mode !== 'playing' && (
            <div className="g-overlay">
              {mode === 'idle' && (
                <>
                  <span className="g-tag">READY</span>
                  <h3>Catch the pump.</h3>
                  <p>Candles and coins up, rugs down.</p>
                  <button className="btn btn-primary" onClick={start}>
                    START <span>↗</span>
                  </button>
                </>
              )}
              {mode === 'paused' && (
                <>
                  <span className="g-tag">PAUSED</span>
                  <h3>Take a breath.</h3>
                  <p>Score {score}. Your run is waiting.</p>
                  <button className="btn btn-primary" onClick={resume}>
                    RESUME <span>↗</span>
                  </button>
                </>
              )}
              {mode === 'over' && (
                <>
                  <span className="g-tag bad">RUGGED</span>
                  <div className="g-final">{score}</div>
                  <p>{fresh && score > 0 ? 'New best score!' : `Best is ${best}.`}</p>
                  <button className="btn btn-primary" onClick={start}>
                    PLAY AGAIN <span>↗</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <div className="g-bar">
          <span className="g-hint">← → or drag · P to pause</span>
          <div className="g-bar-btns">
            <button type="button" onClick={togglePause} disabled={mode === 'idle' || mode === 'over'}>
              {mode === 'paused' ? 'RESUME' : 'PAUSE'}
            </button>
            <button type="button" onClick={toggleSound} aria-pressed={!muted}>
              SOUND {muted ? 'OFF' : 'ON'}
            </button>
          </div>
        </div>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {mode === 'over' ? `Game over. Score ${score}.` : mode === 'paused' ? 'Paused.' : ''}
      </p>
    </div>
  );
}
