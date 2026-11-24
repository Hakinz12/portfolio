// All editable portfolio content lives here.
// Search for "TODO" to find the placeholders you should replace before deploying.

export const contact = {
  x: 'https://x.com/iam_hakinz03',
  telegram: 'https://t.me/iam_hakinzz',
  github: 'https://github.com/Hakinz12',
  email: 'blaqhakinz12@gmail.com',
  resumeUrl: '', // TODO: optional, e.g. '/resume.pdf'. Leave empty to hide the button.
  // TODO: your Formspree endpoint, e.g. 'https://formspree.io/f/abcdwxyz'. While empty, the form opens the visitor's email app instead.
  formEndpoint: '',
};

export const navLinks = [
  { id: 'about', label: 'ABOUT' },
  { id: 'work', label: 'WORK' },
  { id: 'skills', label: 'STACK' },
  { id: 'services', label: 'SERVICES' },
  { id: 'play', label: 'PLAY' },
  { id: 'contact', label: 'CONTACT' },
];

export const roles = [
  'Web3 campaigns',
  'Solana tools',
  'full-stack apps',
  'AI-powered content',
  'online communities',
];

export const tickerItems = [
  'WEB3 CULTURE',
  'FULL-STACK DEV',
  'SOLANA',
  'COMMUNITY ENERGY',
  'AI-POWERED CONTENT',
  'CREATIVE STRATEGY',
];

// category: 'creative' | 'dev'
// theme: purple | lime | coral | cyan | gold
// links: optional [{ label, href }]. Add live demo / GitHub / X thread links here.
// NOTE: the case-study text below is drafted from each project's focus. Edit it to match your real work.
export const projects = [
  {
    id: 'orhex',
    title: 'Orhex-OS',
    word: 'ORHEX',
    category: 'dev',
    kind: 'HACKATHON · WALRUS PROJECT',
    theme: 'cyan',
    status: 'COMPLETED',
    summary:
      'A Walrus hackathon project exploring a lightweight operating-system-style product with a separate MVP implementation.',
    highlights: [
      'Built for the Walrus hackathon',
      'Full project and MVP variants',
      'Python-based implementation',
    ],
    tags: ['Python', 'Walrus', 'Hackathon'],
    links: [
      { label: 'Live demo', href: 'https://orhexos.vercel.app' },
      { label: 'GitHub', href: 'https://github.com/Hakinz12/orhex-OS' },
    ],
  },
  {
    id: 'uniskillfy',
    title: 'Uniskill',
    word: 'UNISKILL',
    category: 'dev',
    kind: 'STUDENT MARKETPLACE · SKILL EXCHANGE',
    theme: 'lime',
    status: 'COMPLETED',
    summary:
      'A peer-to-peer student skills marketplace where classmates trade knowledge, schedule sessions and leave ratings instead of paying for tutors.',
    highlights: [
      'Student-to-student skill matching',
      'Requests, scheduling and ratings',
      'Web app built for a campus community',
    ],
    tags: ['JavaScript', 'Marketplace', 'Student platform'],
    links: [
      { label: 'Live demo', href: 'https://uniskillfy.vercel.app' },
      { label: 'GitHub', href: 'https://github.com/Hakinz12/uniskillfy' },
    ],
  },
  {
    id: 'tradeai',
    title: 'Trade AI',
    word: 'TRADEAI',
    category: 'dev',
    kind: 'SOLANA · AUTO-TRADING AGENT',
    theme: 'coral',
    status: 'IN PROGRESS',
    summary:
      'A Solana auto-trading agent with a web dashboard. The current version uses paper trading to test strategies without placing real orders.',
    highlights: [
      'Paper trading to test strategies without real orders',
      'Dashboard to monitor the agent',
      'Built for the Solana ecosystem',
    ],
    tags: ['Solana', 'AI agent', 'Web dashboard'],
    links: [
      { label: 'GitHub', href: 'https://github.com/Hakinz12/TradeAI' },
    ],
  },
  {
    id: 'telegram-ai-bot',
    title: 'AI Bot',
    word: 'AI BOT',
    category: 'dev',
    kind: 'PYTHON · TELEGRAM AI TOOL',
    theme: 'purple',
    status: 'COMPLETED',
    summary:
      'A Python Telegram bot project that connects AI workflows to conversations and community interactions.',
    highlights: [
      'Telegram bot integration',
      'Python implementation',
      'Designed for community and automation use cases',
    ],
    tags: ['Python', 'Telegram', 'AI'],
    links: [
      { label: 'GitHub', href: 'https://github.com/Hakinz12/telegram-ai-bot' },
    ],
  },
  {
    id: 'postcheck',
    title: 'Postcheck',
    word: 'POSTCHECK',
    category: 'dev',
    kind: 'AI TOOL · POST RISK SCANNER',
    theme: 'cyan',
    status: 'COMPLETED',
    summary:
      'A stateless tool that scans a draft social post for X policy risk, flags the risky phrases and suggests safer alternatives and full rewrites.',
    highlights: [
      'Scans across six policy risk categories',
      'AI-generated content detection',
      'Flagged phrase excerpts with safer alternatives',
      'Full suggested rewrites, no account needed',
    ],
    tags: ['React', 'Node', 'Express', 'Gemini API'],
    links: [
      { label: 'GitHub', href: 'https://github.com/Hakinz12/Postcheck' },
    ],
  },
];

export const skillGroups = [
  {
    title: 'FRONTEND',
    items: ['React', 'Vite', 'Tailwind CSS', 'JavaScript', 'Responsive UI', 'SVG & animation'],
  },
  {
    title: 'BACKEND & DATA',
    items: ['Node.js', 'Express', 'Prisma', 'JWT & bcrypt auth', 'SQLite', 'PostgreSQL', 'Render'],
  },
  {
    title: 'WEB3',
    items: ['Solana', 'Telegram bots', 'Token systems', 'Memecoin sites', 'Community tooling'],
  },
  {
    title: 'AI',
    items: ['Gemini API', 'Anthropic API', 'AI agents', 'AI imagery & video', 'Python scripting'],
  },
  {
    title: 'CREATIVE',
    items: ['Meme content', 'Campaign strategy', 'Storytelling', 'Content creation', 'Crypto / Web3 content'],
  },
  {
    title: 'COMMUNITY',
    items: ['Engagement', 'Moderation', 'Growth', 'Human-first conversations'],
  },
];

export const services = [
  {
    no: '01',
    title: 'Creative & Meme Content',
    body: 'Distinctive visual ideas, memes and content built to earn attention and make a project memorable.',
  },
  {
    no: '02',
    title: 'Community Growth',
    body: 'Community engagement, moderation and human-first conversations that turn attention into belonging.',
  },
  {
    no: '03',
    title: 'Social & Campaign Strategy',
    body: "Clear messaging, campaign concepts and social content designed around a project's identity.",
  },
  {
    no: '04',
    title: 'AI-Powered Production',
    body: 'AI-assisted images, cinematic video concepts and creative workflows that push ideas further.',
  },
  {
    no: '05',
    title: 'Full-Stack & Web3 Development',
    body: 'Web apps, dashboards, landing pages and Solana-focused tools built end to end, from interface to API to deployment.',
  },
];

export const projectTypes = [
  'Web3 campaign or content',
  'Website or landing page',
  'Web app or dashboard',
  'Community management',
  'Something else',
];

export const principles = ['STAY CURIOUS', 'MAKE IT MATTER', 'BUILD IN PUBLIC'];

export const bio =
  'BlaqHakinz is a Web3 creative and full-stack developer and a Post Graduate Diploma software engineering student. Work spans Solana tools, full-stack web apps, community growth and AI-powered content, and BlaqHakinz is on the team at BitAdvantage, a Web3 community engagement ecosystem.';

// The AI assistant widget. `endpoint` is the server route that talks to Gemini.
export const agent = {
  endpoint: '/api/chat',
  name: 'BLAQ ASSISTANT',
  intro:
    "Hi, I'm the assistant for this portfolio. Ask about BlaqHakinz's projects, stack or availability, or start a project enquiry.",
  suggestions: ['What has BlaqHakinz built?', "What's the tech stack?", 'Is BlaqHakinz open to work?'],
};
