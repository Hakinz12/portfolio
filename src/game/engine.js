// Catch the Pump: a small canvas arcade engine. No dependencies.
// World is a fixed 480x640 box; the canvas is scaled with CSS.

const W = 480;
const H = 640;
const C = {
  bg: '#09090c',
  grid: 'rgba(255,255,255,0.055)',
  lime: '#c6ff62',
  coral: '#ff7a6b',
  purple: '#a07bff',
  text: '#f2f1f5',
  ink: '#10110b',
};

const rnd = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export function createEngine(canvas, cb = {}) {
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  let s = fresh();
  let mode = 'idle'; // idle | playing | paused | over
  let raf = 0;
  let last = 0;
  let muted = false;
  let audio = null;
  let musicGainNode = null;
  let musicTimer = null;
  let musicStep = 0;
  let nextNoteTime = 0;
  const keys = { left: false, right: false };

  function fresh() {
    return {
      player: { x: W / 2, target: W / 2, w: 96, h: 14, y: H - 56 },
      items: [],
      parts: [],
      pops: [],
      score: 0,
      lives: 3,
      combo: 0,
      t: 0,
      spawnIn: 0.6,
      shake: 0,
      flash: 0,
      scroll: 0,
    };
  }

  const level = () => Math.min(8, s.score / 160);
  const multiplier = () => 1 + Math.min(3, Math.floor(s.combo / 5));

  // ---------- audio & chiptune music ----------
  function ensureAudio() {
    if (audio) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      audio = new AudioCtx();
      musicGainNode = audio.createGain();
      musicGainNode.gain.setValueAtTime(muted ? 0 : 0.045, audio.currentTime);
      const filter = audio.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2600, audio.currentTime);
      musicGainNode.connect(filter);
      filter.connect(audio.destination);
    } catch {
      audio = null;
    }
  }

  const BPM = 132;
  const STEP_TIME = 60 / BPM / 2; // ~0.227s per 8th-note step

  const BASS_NOTES = [
    110.0, 110.0, 130.81, 164.81, 110.0, 110.0, 98.0, 82.41,
    87.31, 87.31, 110.0, 130.81, 87.31, 87.31, 130.81, 82.41,
    130.81, 130.81, 164.81, 196.0, 130.81, 130.81, 146.83, 164.81,
    98.0, 98.0, 123.47, 146.83, 82.41, 103.83, 123.47, 146.83,
  ];

  const LEAD_NOTES = [
    659.25, 0, 880.0, 0, 987.77, 0, 1046.5, 0,
    987.77, 0, 880.0, 0, 783.99, 0, 659.25, 0,
    783.99, 0, 880.0, 0, 1046.5, 0, 1174.66, 0,
    987.77, 0, 783.99, 0, 659.25, 0, 830.61, 0,
  ];

  const ARP_NOTES = [
    220.0, 261.63, 329.63, 261.63, 220.0, 261.63, 329.63, 261.63,
    174.61, 220.0, 261.63, 220.0, 174.61, 220.0, 261.63, 220.0,
    261.63, 329.63, 392.0, 329.63, 261.63, 329.63, 392.0, 329.63,
    196.0, 246.94, 293.66, 246.94, 164.81, 207.65, 246.94, 207.65,
  ];

  function scheduleMusicStep(step, time) {
    if (!audio || !musicGainNode || muted) return;

    // Bassline
    const bFreq = BASS_NOTES[step % BASS_NOTES.length];
    if (bFreq > 0) {
      const o = audio.createOscillator();
      const g = audio.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(bFreq, time);
      g.gain.setValueAtTime(0.5, time);
      g.gain.exponentialRampToValueAtTime(0.001, time + STEP_TIME * 0.88);
      o.connect(g);
      g.connect(musicGainNode);
      o.start(time);
      o.stop(time + STEP_TIME);
    }

    // Arpeggio
    const aFreq = ARP_NOTES[step % ARP_NOTES.length];
    if (aFreq > 0) {
      const o = audio.createOscillator();
      const g = audio.createGain();
      o.type = 'square';
      o.frequency.setValueAtTime(aFreq, time);
      g.gain.setValueAtTime(0.16, time);
      g.gain.exponentialRampToValueAtTime(0.001, time + STEP_TIME * 0.55);
      o.connect(g);
      g.connect(musicGainNode);
      o.start(time);
      o.stop(time + STEP_TIME * 0.6);
    }

    // Melody lead
    const lFreq = LEAD_NOTES[step % LEAD_NOTES.length];
    if (lFreq > 0) {
      const o = audio.createOscillator();
      const g = audio.createGain();
      o.type = 'square';
      o.frequency.setValueAtTime(lFreq, time);
      g.gain.setValueAtTime(0.24, time);
      g.gain.exponentialRampToValueAtTime(0.001, time + STEP_TIME * 1.7);
      o.connect(g);
      g.connect(musicGainNode);
      o.start(time);
      o.stop(time + STEP_TIME * 1.75);
    }

    // Offbeat percussion tap
    if (step % 2 === 1) {
      const o = audio.createOscillator();
      const g = audio.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(1400, time);
      o.frequency.exponentialRampToValueAtTime(200, time + 0.025);
      g.gain.setValueAtTime(0.18, time);
      g.gain.exponentialRampToValueAtTime(0.001, time + 0.025);
      o.connect(g);
      g.connect(musicGainNode);
      o.start(time);
      o.stop(time + 0.03);
    }
  }

  function startMusic() {
    ensureAudio();
    if (!audio) return;
    if (audio.state === 'suspended') audio.resume();
    stopMusic();
    nextNoteTime = audio.currentTime + 0.04;
    musicTimer = setInterval(() => {
      if (mode !== 'playing') return;
      while (nextNoteTime < audio.currentTime + 0.16) {
        scheduleMusicStep(musicStep, nextNoteTime);
        musicStep = (musicStep + 1) % 32;
        nextNoteTime += STEP_TIME;
      }
    }, 30);
  }

  function stopMusic() {
    if (musicTimer) {
      clearInterval(musicTimer);
      musicTimer = null;
    }
  }

  function tone(freq, dur, type = 'square', gain = 0.035, delay = 0, slideTo) {
    if (muted || !audio) return;
    try {
      const t0 = audio.currentTime + delay;
      const o = audio.createOscillator();
      const g = audio.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq, t0);
      if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
      g.gain.setValueAtTime(gain, t0);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(g);
      g.connect(audio.destination);
      o.start(t0);
      o.stop(t0 + dur + 0.02);
    } catch {
      /* audio is optional */
    }
  }
  const sfx = {
    candle: () => tone(660, 0.07),
    coin: () => {
      tone(880, 0.07);
      tone(1320, 0.1, 'square', 0.035, 0.07);
    },
    rug: () => tone(220, 0.25, 'sawtooth', 0.05, 0, 70),
    over: () => {
      tone(330, 0.18, 'triangle', 0.05);
      tone(247, 0.18, 'triangle', 0.05, 0.18);
      tone(165, 0.4, 'triangle', 0.05, 0.36);
    },
  };

  // ---------- spawning & effects ----------
  function spawn() {
    const lv = level();
    const rugP = 0.26 + Math.min(0.14, lv * 0.02);
    const r = Math.random();
    let type = 'candle';
    if (r < rugP) type = 'rug';
    else if (r < rugP + 0.09) type = 'coin';
    const hw = type === 'candle' ? 10 : type === 'coin' ? 15 : 19;
    const hh = type === 'candle' ? 22 : type === 'coin' ? 15 : 19;
    s.items.push({
      type,
      hw,
      hh,
      x: rnd(hw + 12, W - hw - 12),
      y: -30,
      vy: (170 + lv * 30) * rnd(0.9, 1.15),
      rot: type === 'rug' ? rnd(-0.5, 0.5) : 0,
      spin: type === 'rug' ? rnd(-2.2, 2.2) : 0,
      wob: rnd(0, Math.PI * 2),
    });
  }

  function burst(x, y, color, n) {
    const count = reduce ? Math.ceil(n / 3) : n;
    for (let i = 0; i < count; i++) {
      const a = rnd(0, Math.PI * 2);
      const v = rnd(60, 240);
      s.parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 60, life: rnd(0.35, 0.7), max: 0.7, color, size: rnd(2, 4.5) });
    }
  }
  const pop = (x, y, text, color) => s.pops.push({ x, y, text, color, life: 0.8 });

  // ---------- simulation ----------
  function onCatch(it) {
    if (it.type === 'rug') {
      s.lives -= 1;
      s.combo = 0;
      s.shake = reduce ? 0 : 14;
      s.flash = 0.28;
      burst(it.x, it.y, C.coral, 22);
      pop(it.x, it.y - 10, '-1 LIFE', C.coral);
      sfx.rug();
      cb.onLives && cb.onLives(s.lives);
      cb.onCombo && cb.onCombo(0);
      if (s.lives <= 0) end();
      return;
    }
    const base = it.type === 'coin' ? 25 : 10;
    const pts = base * multiplier();
    s.score += pts;
    s.combo += 1;
    burst(it.x, it.y, it.type === 'coin' ? C.purple : C.lime, it.type === 'coin' ? 16 : 10);
    pop(it.x, it.y - 10, `+${pts}`, it.type === 'coin' ? C.purple : C.lime);
    sfx[it.type]();
    cb.onScore && cb.onScore(s.score);
    cb.onCombo && cb.onCombo(s.combo);
  }

  function update(dt) {
    s.t += dt;
    s.scroll = (s.scroll + dt * (50 + level() * 14)) % 40;
    const p = s.player;

    const speed = 560;
    if (keys.left) p.target -= speed * dt;
    if (keys.right) p.target += speed * dt;
    p.target = clamp(p.target, p.w / 2, W - p.w / 2);
    p.x += (p.target - p.x) * Math.min(1, dt * 20);

    s.spawnIn -= dt;
    if (s.spawnIn <= 0) {
      spawn();
      s.spawnIn = Math.max(0.3, 0.88 - level() * 0.065) * rnd(0.8, 1.2);
    }

    for (let i = s.items.length - 1; i >= 0; i--) {
      const it = s.items[i];
      it.y += it.vy * dt;
      it.rot += it.spin * dt;
      const hit =
        it.y + it.hh >= p.y &&
        it.y - it.hh <= p.y + p.h &&
        Math.abs(it.x - p.x) <= p.w / 2 + it.hw;
      if (hit) {
        s.items.splice(i, 1);
        onCatch(it);
        if (mode !== 'playing') return;
      } else if (it.y > H + 40) {
        s.items.splice(i, 1);
        if (it.type === 'candle' && s.combo > 0) {
          s.combo = 0;
          cb.onCombo && cb.onCombo(0);
        }
      }
    }

    for (let i = s.parts.length - 1; i >= 0; i--) {
      const q = s.parts[i];
      q.life -= dt;
      if (q.life <= 0) {
        s.parts.splice(i, 1);
        continue;
      }
      q.vy += 520 * dt;
      q.x += q.vx * dt;
      q.y += q.vy * dt;
    }
    for (let i = s.pops.length - 1; i >= 0; i--) {
      const q = s.pops[i];
      q.life -= dt;
      q.y -= 40 * dt;
      if (q.life <= 0) s.pops.splice(i, 1);
    }
    s.shake = Math.max(0, s.shake - dt * 46);
    s.flash = Math.max(0, s.flash - dt);
  }

  // ---------- drawing ----------
  function drawItem(it) {
    ctx.save();
    ctx.translate(it.x, it.y);
    if (it.type === 'candle') {
      ctx.strokeStyle = C.lime;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -it.hh);
      ctx.lineTo(0, it.hh);
      ctx.stroke();
      ctx.fillStyle = C.lime;
      ctx.shadowColor = C.lime;
      ctx.shadowBlur = 14;
      ctx.fillRect(-9, -13, 18, 28);
    } else if (it.type === 'coin') {
      ctx.shadowColor = C.purple;
      ctx.shadowBlur = 16;
      ctx.fillStyle = C.purple;
      ctx.beginPath();
      ctx.arc(0, 0, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = 'rgba(255,255,255,0.7)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 10.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = C.ink;
      ctx.font = '700 12px "DM Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('S', 0, 1);
    } else {
      ctx.rotate(it.rot);
      ctx.shadowColor = C.coral;
      ctx.shadowBlur = 14;
      ctx.fillStyle = 'rgba(255,122,107,0.18)';
      ctx.strokeStyle = C.coral;
      ctx.lineWidth = 2;
      ctx.fillRect(-it.hw, -it.hh, it.hw * 2, it.hh * 2);
      ctx.strokeRect(-it.hw, -it.hh, it.hw * 2, it.hh * 2);
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.moveTo(-9, -9);
      ctx.lineTo(9, 9);
      ctx.moveTo(9, -9);
      ctx.lineTo(-9, 9);
      ctx.stroke();
    }
    ctx.restore();
  }

  function render() {
    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = C.bg;
    ctx.fillRect(0, 0, W, H);

    if (s.shake > 0) ctx.translate(rnd(-s.shake, s.shake) * 0.5, rnd(-s.shake, s.shake) * 0.5);

    // moving grid
    ctx.strokeStyle = C.grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x <= W; x += 40) {
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, H);
    }
    for (let y = -40 + s.scroll; y <= H; y += 40) {
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(W, y + 0.5);
    }
    ctx.stroke();

    // floor line
    ctx.strokeStyle = 'rgba(198,255,98,0.25)';
    ctx.beginPath();
    ctx.moveTo(0, H - 30.5);
    ctx.lineTo(W, H - 30.5);
    ctx.stroke();

    s.items.forEach(drawItem);

    s.parts.forEach((q) => {
      ctx.globalAlpha = clamp(q.life / q.max, 0, 1);
      ctx.fillStyle = q.color;
      ctx.fillRect(q.x, q.y, q.size, q.size);
    });
    ctx.globalAlpha = 1;

    // player (the wallet)
    const p = s.player;
    ctx.save();
    ctx.shadowColor = C.lime;
    ctx.shadowBlur = 18;
    ctx.fillStyle = C.lime;
    ctx.fillRect(p.x - p.w / 2, p.y, p.w, p.h);
    ctx.fillRect(p.x - p.w / 2 + 8, p.y - 5, p.w - 16, 6);
    ctx.shadowBlur = 0;
    ctx.fillStyle = C.ink;
    ctx.font = '700 8px "DM Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('WALLET', p.x, p.y + p.h / 2 + 1);
    ctx.restore();

    ctx.font = '700 15px "DM Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    s.pops.forEach((q) => {
      ctx.globalAlpha = clamp(q.life / 0.8, 0, 1);
      ctx.fillStyle = q.color;
      ctx.fillText(q.text, q.x, q.y);
    });
    ctx.globalAlpha = 1;

    if (s.flash > 0) {
      ctx.fillStyle = `rgba(255,122,107,${s.flash * 0.9})`;
      ctx.fillRect(-20, -20, W + 40, H + 40);
    }
    ctx.restore();
  }

  // ---------- loop & state ----------
  function setMode(m) {
    mode = m;
    cb.onMode && cb.onMode(m);
  }
  function frame(ts) {
    if (mode !== 'playing') return;
    const dt = Math.min(0.033, (ts - last) / 1000 || 0);
    last = ts;
    update(dt);
    render();
    if (mode === 'playing') raf = requestAnimationFrame(frame);
  }
  function end() {
    cancelAnimationFrame(raf);
    stopMusic();
    sfx.over();
    setMode('over');
    render();
    cb.onOver && cb.onOver(s.score);
  }

  function start() {
    cancelAnimationFrame(raf);
    s = fresh();
    ensureAudio();
    if (audio && audio.state === 'suspended') audio.resume();
    musicStep = 0;
    startMusic();
    cb.onScore && cb.onScore(0);
    cb.onLives && cb.onLives(3);
    cb.onCombo && cb.onCombo(0);
    setMode('playing');
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }
  function pause() {
    if (mode !== 'playing') return;
    cancelAnimationFrame(raf);
    stopMusic();
    setMode('paused');
    render();
  }
  function resume() {
    if (mode !== 'paused') return;
    setMode('playing');
    startMusic();
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }
  function setMuted(m) {
    muted = m;
    if (musicGainNode && audio) {
      musicGainNode.gain.setValueAtTime(m ? 0 : 0.045, audio.currentTime);
    }
    if (!m) {
      ensureAudio();
      if (audio && audio.state === 'suspended') audio.resume();
      if (mode === 'playing') {
        startMusic();
      } else {
        tone(660, 0.08);
      }
    } else {
      stopMusic();
    }
  }

  // ---------- input ----------
  const pointerX = (e) => {
    const rect = canvas.getBoundingClientRect();
    return ((e.clientX - rect.left) / rect.width) * W;
  };
  const onPointer = (e) => {
    if (mode !== 'playing') return;
    s.player.target = clamp(pointerX(e), s.player.w / 2, W - s.player.w / 2);
  };
  const keyMap = { ArrowLeft: 'left', a: 'left', A: 'left', ArrowRight: 'right', d: 'right', D: 'right' };
  const onKeyDown = (e) => {
    const k = keyMap[e.key];
    if (!k || mode !== 'playing') return;
    e.preventDefault();
    keys[k] = true;
  };
  const onKeyUp = (e) => {
    const k = keyMap[e.key];
    if (k) keys[k] = false;
  };
  canvas.addEventListener('pointermove', onPointer);
  canvas.addEventListener('pointerdown', onPointer);
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);

  render();

  return {
    start,
    pause,
    resume,
    setMuted,
    getMode: () => mode,
    destroy() {
      cancelAnimationFrame(raf);
      stopMusic();
      canvas.removeEventListener('pointermove', onPointer);
      canvas.removeEventListener('pointerdown', onPointer);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      if (audio) {
        try {
          audio.close();
        } catch {
          /* ignore */
        }
      }
    },
  };
}
