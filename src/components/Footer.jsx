import { contact } from '../data/content.js';
import { scrollToId } from '../utils.js';

export default function Footer() {
  return (
    <footer>
      <div className="wrap footer-inner">
        <span className="footer-brand">BLAQHAKINZ.</span>
        <span>INDEPENDENTLY BUILDING ON THE INTERNET.</span>
        <span className="footer-links">
          <a href={contact.x} target="_blank" rel="noreferrer">
            X
          </a>
          <a href={contact.telegram} target="_blank" rel="noreferrer">
            TELEGRAM
          </a>
          <a href={`mailto:${contact.email}`}>EMAIL</a>
        </span>
        <span>© {new Date().getFullYear()} · ALL IDEAS IN MOTION.</span>
        <button className="to-top" onClick={() => scrollToId('top')} aria-label="Back to top">
          TOP ↑
        </button>
      </div>
    </footer>
  );
}
