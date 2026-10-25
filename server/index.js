// Small Express server: serves the built site and proxies chat questions to Gemini
// so the API key never reaches the browser.
//
//   npm run build && npm start     (production, serves ./dist and /api)
//   npm run server                 (API only, use with `npm run dev`)
import express from 'express';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildPersona } from './persona.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Minimal .env loader (no dependency, works on any Node version).
const envFile = path.join(root, '.env');
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
}

const PORT = Number(process.env.PORT) || 8787;
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const API_BASE = process.env.GEMINI_API_BASE || 'https://generativelanguage.googleapis.com/v1beta';
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '';
const persona = buildPersona();

const app = express();
app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(express.json({ limit: '20kb' }));
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Optional CORS, only when the site is hosted somewhere other than this server.
app.use('/api', (req, res, next) => {
  if (ALLOWED_ORIGIN) {
    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
  }
  next();
});

// Simple per-IP limit: 20 questions per 10 minutes.
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 20;
const hits = new Map();
const limited = (ip) => {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > LIMIT;
};
setInterval(() => {
  const now = Date.now();
  for (const [ip, arr] of hits) {
    const keep = arr.filter((t) => now - t < WINDOW_MS);
    if (keep.length) hits.set(ip, keep);
    else hits.delete(ip);
  }
}, 60 * 1000).unref();

function cleanMessages(raw) {
  if (!Array.isArray(raw)) return null;
  const out = [];
  for (const m of raw.slice(-10)) {
    if (!m || (m.role !== 'user' && m.role !== 'assistant') || typeof m.text !== 'string') return null;
    const text = m.text.replace(/\s+/g, ' ').trim().slice(0, 600);
    if (text) out.push({ role: m.role, text });
  }
  while (out.length && out[0].role !== 'user') out.shift();
  if (!out.length || out[out.length - 1].role !== 'user') return null;
  return out;
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, agent: Boolean(process.env.GEMINI_API_KEY), model: MODEL });
});

app.post('/api/chat', async (req, res) => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(503).json({ error: 'agent_not_configured' });
  if (limited(req.ip)) return res.status(429).json({ error: 'rate_limited' });

  const msgs = cleanMessages(req.body && req.body.messages);
  if (!msgs) return res.status(400).json({ error: 'bad_request' });

  const body = {
    systemInstruction: { parts: [{ text: persona }] },
    contents: msgs.map((m) => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.text }] })),
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 500,
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT',
        properties: { reply: { type: 'STRING' }, startEnquiry: { type: 'BOOLEAN' } },
        required: ['reply', 'startEnquiry'],
      },
      // 2.5 Flash "thinks" by default and spends the output budget on it; turn that off.
      ...(/2\.5/.test(MODEL) && !/pro/.test(MODEL) ? { thinkingConfig: { thinkingBudget: 0 } } : {}),
    },
  };

  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 20000);
  try {
    const r = await fetch(`${API_BASE}/models/${MODEL}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify(body),
      signal: ctl.signal,
    });
    if (!r.ok) {
      const detail = (await r.text().catch(() => '')).slice(0, 300);
      console.error(`Gemini ${r.status}: ${detail}`);
      return res.status(r.status === 429 ? 429 : 502).json({ error: 'upstream' });
    }
    const data = await r.json();
    const cand = data.candidates && data.candidates[0];
    const text = ((cand && cand.content && cand.content.parts) || []).map((p) => p.text || '').join('').trim();
    if (!text) {
      return res.json({ reply: "I can't answer that one. Try asking about BlaqHakinz's projects, stack or availability.", startEnquiry: false });
    }
    let reply = text;
    let startEnquiry = false;
    try {
      const parsed = JSON.parse(text);
      if (typeof parsed.reply === 'string') reply = parsed.reply;
      startEnquiry = parsed.startEnquiry === true;
    } catch {
      /* model returned plain text, use it as the reply */
    }
    res.json({ reply: reply.trim().slice(0, 1200), startEnquiry });
  } catch (err) {
    console.error('Chat error:', err && err.name === 'AbortError' ? 'timeout' : err && err.message);
    res.status(504).json({ error: 'timeout' });
  } finally {
    clearTimeout(timer);
  }
});

// Serve the built site when it exists.
const dist = path.join(root, 'dist');
if (existsSync(dist)) {
  app.use(express.static(dist));
  app.get('*', (req, res) => res.sendFile(path.join(dist, 'index.html')));
}

app.listen(PORT, () => {
  console.log(`Portfolio server on http://localhost:${PORT}`);
  console.log(process.env.GEMINI_API_KEY ? `AI agent on (${MODEL})` : 'AI agent off: set GEMINI_API_KEY to turn it on');
});
