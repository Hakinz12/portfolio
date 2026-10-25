import useReveal from '../hooks/useReveal.js';

// Wrapper that fades/slides its child in on scroll. `delay` is in seconds.
export default function Reveal({ as: Tag = 'div', className = '', delay = 0, style, children, ...rest }) {
  const ref = useReveal();
  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`.trim()}
      style={{ ...style, '--d': `${delay}s` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
