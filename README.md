# BlaqHakinz Portfolio

Vite + React site with a real contact form, an AI assistant and a small arcade game.

## Run it locally

```bash
npm install
npm run dev          # the site, http://localhost:5173
```

To try the AI assistant locally, open a second terminal:

```bash
copy .env.example .env      # Windows (use cp on Mac/Linux), then add your key
npm run server              # the AI proxy on http://localhost:8787
```

Without a key the assistant still works in offline mode. It answers from the site's own content.

## Make the contact form send real email (Formspree)

1. Create a free account at formspree.io and make a new form with your email address.
2. Copy the form URL, which looks like `https://formspree.io/f/abcdwxyz`.
3. Paste it into `formEndpoint` in `src/data/content.js`.

While `formEndpoint` is empty, the form opens the visitor's email app instead.

## Turn on the AI assistant (Gemini)

1. Get a free key at https://aistudio.google.com/apikey.
2. Put it in `.env` as `GEMINI_API_KEY=...` (never commit `.env`).

The browser never sees the key. It talks to `/api/chat` on `server/index.js`, which calls Gemini.
The assistant only knows what is in `src/data/content.js` (projects, skills, journey, services, bio),
so editing that file updates the assistant too. Visitors get 20 questions per 10 minutes, and names and
emails typed during an enquiry are never sent to the AI.

## Edit your content

Everything lives in `src/data/content.js`. Search for `TODO` to find what to replace:
X, Telegram and email links, `formEndpoint`, and live-demo or GitHub links for each project.

## Deploy

The assistant needs the small server, so deploy as a **Web Service**, not a Static Site.

On Render, use New → Blueprint and point it at the repo (it reads `render.yaml`), or create a Web Service by hand:

- Build command: `npm install --include=dev && npm run build`
- Start command: `npm start`
- Environment variable: `GEMINI_API_KEY`

If you only want the site without the assistant, a Static Site works too (build `npm run build`,
publish `dist`). The assistant then runs in offline mode.
