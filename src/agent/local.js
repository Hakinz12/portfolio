// Offline answers built from the site's own content. Used when the AI server
// is not reachable (static hosting, no API key, no network).
import { bio, projects, skillGroups, services } from '../data/content.js';

const group = (title) => skillGroups.find((g) => g.title === title);

export function localAnswer(input) {
  const t = input.toLowerCase().trim();
  const out = (reply, startEnquiry = false) => ({ reply, startEnquiry });

  if (t.length <= 12 && /^(hi|hello|hey|yo|sup)\b/.test(t)) {
    return out('Hi! Ask about the projects, the tech stack, services or availability, or start a project enquiry.');
  }

  if (/\b(hire|hiring|collab\w*|quote|enquir\w*|inquir\w*|start a project|get started|work with|commission|get in touch|reach|contact)\b/.test(t)) {
    return out("Happy to help you reach BlaqHakinz. I'll take a few details and fill in the contact form for you.", true);
  }

  const proj = projects.find((p) => t.includes(p.word.toLowerCase()) || t.includes(p.title.toLowerCase()));
  if (proj) {
    const status = proj.status ? ` (${proj.status.toLowerCase()})` : '';
    return out(`${proj.title}${status}: ${proj.summary}`);
  }

  if (/\b(game|play|arcade|catch the pump)\b/.test(t)) {
    return out('There is a small canvas game on this page called Catch the Pump. Scroll to the Arcade section and try to beat your best score.');
  }

  if (/\b(stack|skills?|tech|tools?|languages?|frameworks?|react|node|prisma|code|coding|develop\w*)\b/.test(t)) {
    const parts = ['FRONTEND', 'BACKEND & DATA', 'WEB3', 'AI']
      .map(group)
      .filter(Boolean)
      .map((g) => `${g.title.toLowerCase()}: ${g.items.slice(0, 4).join(', ')}`);
    return out(`The main tools are ${parts.join('; ')}.`);
  }

  if (/\b(solana|web3|crypto|token|bots?|community)\b/.test(t)) {
    const w = group('WEB3');
    return out(
      `Web3 work covers ${w ? w.items.join(', ').toLowerCase() : 'Solana tools and community projects'}. BlaqHakinz is also on the team at BitAdvantage, a Web3 community engagement ecosystem.`
    );
  }

  if (/\b(projects?|built|build|made|portfolio|ship\w*|work)\b/.test(t)) {
    const dev = projects.filter((p) => p.category === 'dev').map((p) => p.title);
    const cre = projects.filter((p) => p.category === 'creative').map((p) => p.title);
    return out(`Development: ${dev.join(', ')}. Creative: ${cre.join(', ')}. Name any of them and I'll tell you more.`);
  }

  if (/\b(services?|offer|help with|can you|what do you do)\b/.test(t)) {
    return out(`Services: ${services.map((s) => s.title).join('; ')}.`);
  }

  if (/\b(who|about|background|student|study|studying|bitadvantage|experience)\b/.test(t)) {
    return out(bio);
  }

  if (/\b(available|availability|open to|freelance|rates?|price|pricing|cost|budget)\b/.test(t)) {
    return out('BlaqHakinz is open to collaborations. Pricing depends on the scope, so the best step is a short project enquiry.');
  }

  return out("I can talk about BlaqHakinz's projects, stack, services and availability. Try one of those, or start a project enquiry.");
}
