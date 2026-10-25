import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '../utils.js';

// Typewriter effect that cycles through `words`.
export default function useTyped(words, { type = 65, erase = 32, hold = 1500 } = {}) {
  const [text, setText] = useState(prefersReducedMotion() ? words[0] : '');

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let i = 0;
    let j = 0;
    let deleting = false;
    let timer;

    const tick = () => {
      const word = words[i];
      if (!deleting) {
        j += 1;
        setText(word.slice(0, j));
        if (j === word.length) {
          deleting = true;
          timer = setTimeout(tick, hold);
          return;
        }
      } else {
        j -= 1;
        setText(word.slice(0, j));
        if (j === 0) {
          deleting = false;
          i = (i + 1) % words.length;
        }
      }
      timer = setTimeout(tick, deleting ? erase : type);
    };

    timer = setTimeout(tick, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return text;
}
