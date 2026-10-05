import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export default function LinkPreview({ label, title, description, href, image, imageBackground = '#fff', button = false }) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState(null);
  const anchor = useRef(null);
  const card = useRef(null);
  const timer = useRef(null);
  const id = useId();
  const show = () => { clearTimeout(timer.current); setOpen(true); };
  const hide = () => { clearTimeout(timer.current); timer.current = setTimeout(() => setOpen(false), 160); };
  useEffect(() => () => clearTimeout(timer.current), []);
  useLayoutEffect(() => {
    if (!open) { setPosition(null); return; }
    const place = () => {
      const rect = anchor.current.getBoundingClientRect();
      const height = card.current.offsetHeight;
      const width = card.current.offsetWidth;
      setPosition({ left: Math.max(12, Math.min(rect.left + rect.width / 2 - width / 2, innerWidth - width - 12)), top: rect.top >= height + 20 ? rect.top - height - 10 : Math.min(rect.bottom + 10, innerHeight - height - 12) });
    };
    place();
    const observer = new ResizeObserver(place);
    observer.observe(card.current);
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    const outside = event => {
      if (!anchor.current?.contains(event.target) && !card.current?.contains(event.target)) setOpen(false);
    };
    const escape = event => { if (event.key === 'Escape') { setOpen(false); anchor.current?.focus(); } };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => { observer.disconnect(); window.removeEventListener('resize', place); window.removeEventListener('scroll', place, true); document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); };
  }, [open]);
  const shared = { ref: anchor, onMouseEnter: show, onMouseLeave: hide, onFocus: show, onBlur: hide, 'aria-describedby': open ? id : undefined };
  return <>
    {button ? <button {...shared} type="button" className="student-trigger" aria-expanded={open} onClick={() => { clearTimeout(timer.current); setOpen(true); }}><span className="note-trigger-label">{label}</span></button> : <a {...shared} className="highlight-link" href={href} target="_blank" rel="noopener noreferrer">{label}</a>}
    {open && createPortal(<div ref={card} id={id} className="link-preview-card" onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide} style={{ ...position, visibility: position ? 'visible' : 'hidden' }}>
      <a href={href} target="_blank" rel="noopener noreferrer" className="link-preview-destination">
        <img src={image} alt={`${title} preview`} style={{ background: imageBackground }} />
        <span className="link-preview-copy"><strong>{title}<span className="site-arrow" aria-hidden="true">↗</span></strong><span>{description}</span></span>
      </a>
    </div>, document.body)}
  </>;
}
