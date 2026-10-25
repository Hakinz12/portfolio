import { Fragment } from 'react';
import { tickerItems } from '../data/content.js';

export default function Ticker() {
  // Render the list twice so the -50% marquee loop is seamless.
  const loop = [...tickerItems, ...tickerItems];
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        {loop.map((item, i) => (
          <Fragment key={i}>
            <span>{item}</span>
            <b>✳</b>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
