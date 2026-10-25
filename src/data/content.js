// All editable portfolio content lives here.
// Search for "TODO" to find the placeholders you should replace before deploying.

export const contact = {
  x: 'https://x.com/', // TODO: your X profile URL
  telegram: 'https://t.me/', // TODO: your Telegram URL
  email: 'hello@example.com', // TODO: your email
  resumeUrl: '', // TODO: optional, e.g. '/resume.pdf'. Leave empty to hide the button.
  // TODO: your Formspree endpoint, e.g. 'https://formspree.io/f/abcdwxyz'. While empty, the form opens the visitor's email app instead.
  formEndpoint: '',
};

export const navLinks = [
  { id: 'work', label: 'WORK' },
  { id: 'skills', label: 'STACK' },
  { id: 'journey', label: 'JOURNEY' },
  { id: 'services', label: 'SERVICES' },
  { id: 'about', label: 'ABOUT' },
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
    id: 'bluzo',
    title: 'Bluzo',
    word: 'BLUZO',
    category: 'creative',
    kind: 'MEME CULTURE · CREATIVE CONCEPTS',
    theme: 'purple',
    featured: true,
    summary:
      'Meme-driven creative concepts that give a project a recognisable, internet-native voice.',
    highlights: [
      'Meme and visual concepts built to be shared',
      'A consistent tone across posts and replies',
      'Content shaped around the project’s identity',
    ],
    tags: ['Memes', 'Visual concepts', 'Social content'],
    links: [],
  },
  {
    id: 'zentrix',
    title: 'Zentrix Gaming',
    word: 'ZENTRIX',
    category: 'creative',
    kind: 'WEB3 GAMING · CONTENT & PROMOTION',
    theme: 'lime',
    summary:
      'Content and promotion for a Web3 gaming project, from social posts to campaign pushes.',
    highlights: [
      'Gaming-focused content and promotion',
      'Campaign ideas for community growth',
      'Messaging that fits the game’s world',
    ],
    tags: ['Web3 gaming', 'Promotion', 'Content'],
    links: [],
  },
  {
    id: 'hedge',
    title: 'Hedge Energy',
    word: 'HEDGE',
    category: 'creative',
    kind: 'SOLANA · CAMPAIGN STORYTELLING',
    theme: 'coral',
    summary:
      'Narrative-led campaign content on Solana that turns a project into a story people follow.',
    highlights: [
      'Campaign storytelling for a Solana project',
      'Clear messaging for a technical audience',
      'Content built around one central idea',
    ],
    tags: ['Solana', 'Storytelling', 'Campaigns'],
    links: [],
  },
  {
    id: 'prophet',
    title: 'The Prophet',
    word: 'PROPHET',
    category: 'creative',
    kind: 'COMMUNITY · SOCIAL CONTENT',
    theme: 'cyan',
    summary:
      'Community-first social content designed to keep members engaged and talking.',
    highlights: [
      'Community engagement and conversation',
      'Social content with a human voice',
      'Moderation-friendly, welcoming tone',
    ],
    tags: ['Community', 'Social', 'Engagement'],
    links: [],
  },
  {
    id: 'timekeep',
    title: 'Timekeep',
    word: 'TIMEKEEP',
    category: 'dev',
    kind: 'FULL-STACK · TASK REMINDER APP',
    theme: 'lime',
    featured: true,
    status: 'IN PROGRESS',
    summary:
      'A full-stack task reminder app with multi-user auth, a custom SVG time-ring that shows urgency at a glance, and a Web Audio alarm when a task is due.',
    highlights: [
      'JWT auth with bcrypt-hashed passwords, tasks scoped per user',
      'Full task CRUD with categories, tags and priority levels',
      'Overdue / Today / Upcoming / Done buckets',
      'Browser notifications plus a Web Audio two-tone alarm',
      '15-second polling with a notified flag to stop duplicate alarms',
    ],
    tags: ['React', 'Vite', 'Tailwind', 'Node', 'Express', 'Prisma', 'JWT'],
    links: [], // TODO: add { label: 'Live demo', href: '...' } and { label: 'GitHub', href: '...' }
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
    links: [], // TODO: add live demo / GitHub
  },
  {
    id: 'tradeai',
    title: 'TradeAI',
    word: 'TRADEAI',
    category: 'dev',
    kind: 'SOLANA · AUTO-TRADING AGENT',
    theme: 'coral',
    featured: true,
    status: 'IN PROGRESS',
    summary:
      'A Solana degen auto-trading agent. It starts in paper-trading mode so strategies can be tested safely, with a web dashboard to control and monitor it.',
    highlights: [
      'Paper trading first, so strategies are tested without real funds',
      'Web dashboard to control and monitor the agent',
      'Built for the fast-moving Solana memecoin market',
    ],
    tags: ['Solana', 'AI agent', 'Web dashboard'],
    links: [], // TODO: add GitHub / write-up
  },
  {
    id: 'alpha-kingdom',
    title: 'Alpha Kingdom Hub',
    word: 'ALPHA',
    category: 'dev',
    kind: 'WEB3 LANDING PAGE · COMMUNITY HUB',
    theme: 'purple',
    summary:
      'A Web3 marketing landing page for a crypto signals and community hub, built around a mega launch event.',
    highlights: [
      'Landing page for a crypto signals community',
      'Designed around a launch-event moment',
      'Clear calls to action to join the community',
    ],
    tags: ['Landing page', 'Web3 marketing', 'Launch event'],
    links: [], // TODO: add live site
  },
  {
    id: 'jeanne-phil',
    title: 'Jeanne Phil',
    word: 'JEANNE',
    category: 'dev',
    kind: 'SOLANA MEMECOIN · WEBSITE',
    theme: 'gold',
    summary:
      'The website for $JEANNEPHIL, a Solana memecoin with a pink, black and gold boxer-glam identity, built for its September 2026 launch.',
    highlights: [
      'Distinct pink, black and gold boxer-glam branding',
      'Built for a launch-day audience',
      'Memecoin site with a strong, playful personality',
    ],
    tags: ['Solana', 'Memecoin', 'Branding', 'Website'],
    links: [], // TODO: add live site
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

export const journey = [
  {
    when: 'NOW',
    title: 'Building TradeAI and Timekeep',
    org: 'Independent',
    text: 'Shipping full-stack products and a Solana trading agent side by side with my studies.',
  },
  {
    when: 'NOW',
    title: 'Team member, BitAdvantage',
    org: 'Web3 community engagement ecosystem',
    text: 'Part of the team behind a Web3 community engagement ecosystem, including Telegram bots and token systems.',
  },
  {
    when: 'NOW',
    title: 'Post Graduate Diploma, Software Engineering',
    org: 'Student',
    text: 'Formalising the engineering side: web development, systems and computer science fundamentals.',
  },
  {
    when: '2026',
    title: 'Postcheck, Alpha Kingdom Hub, Jeanne Phil',
    org: 'Independent',
    text: 'Shipped an AI post-risk scanner and built Web3 launch sites for a signals community and a Solana memecoin.',
  },
  {
    when: 'EARLIER',
    title: 'Web3 creative and community work',
    org: 'Bluzo, Zentrix Gaming, Hedge Energy, The Prophet',
    text: 'Meme culture, campaign storytelling, content and promotion across Web3 projects.',
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
