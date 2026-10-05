import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useDragControls, useMotionValue } from 'framer-motion';

const focusable = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]';

function Panel({ anchor, id, title, children, close, panelClassName }) {
  const panel = useRef(null);
  const dragControls = useDragControls();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [moved, setMoved] = useState(false);
  const [placement, setPlacement] = useState(null);

  useLayoutEffect(() => {
    function place() {
      const rect = anchor.current.getBoundingClientRect();
      const width = panel.current.offsetWidth;
      const height = panel.current.offsetHeight;
      const inset = 16;
      const gap = 12;
      const above = rect.top - height - gap >= inset;
      const left = Math.max(inset, Math.min(rect.left - 20, window.innerWidth - width - inset));
      const top = Math.max(inset, Math.min(above ? rect.top - height - gap : rect.bottom + gap, window.innerHeight - height - inset));
      x.set(0);
      y.set(0);
      setMoved(false);
      setPlacement({ bounds: { left: inset - left, right: window.innerWidth - inset - left - width, top: inset - top, bottom: window.innerHeight - inset - top - height }, left, top, side: above ? 'top' : 'bottom', tip: Math.max(22, Math.min(rect.left + rect.width / 2 - left, width - 22)) });
    }
    place();
    panel.current.focus({ preventScroll: true });
    const observer = new ResizeObserver(place);
    observer.observe(panel.current);
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [anchor, x, y]);

  useEffect(() => {
    function outside(event) {
      if (!panel.current?.contains(event.target) && !anchor.current?.contains(event.target)) close(false);
    }
    function escape(event) {
      if (event.key === 'Escape') { event.preventDefault(); close(true); }
    }
    document.addEventListener('pointerdown', outside);
    document.addEventListener('focusin', outside);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('focusin', outside);
      document.removeEventListener('keydown', escape);
    };
  }, [anchor, close]);

  function onKeyDown(event) {
    if (event.key !== 'Tab') return;
    const items = [...panel.current.querySelectorAll(focusable)];
    if (event.shiftKey && (document.activeElement === panel.current || document.activeElement === items[0])) {
      event.preventDefault(); close(true);
    } else if (!event.shiftKey && document.activeElement === items[items.length - 1]) {
      event.preventDefault();
      const pageItems = [...document.querySelectorAll(focusable)].filter(el => !panel.current.contains(el) && el.getClientRects().length);
      const next = pageItems[pageItems.indexOf(anchor.current) + 1];
      close(false);
      (next || anchor.current).focus({ preventScroll: true });
    }
  }

  return createPortal(
    <motion.div ref={panel} id={id} role="dialog" aria-label={title} aria-describedby={`${id}-content`} tabIndex={-1}
      className={`note-popup ${panelClassName || ''}`} data-moved={moved} drag dragControls={dragControls} dragListener={false} dragMomentum={false} dragElastic={0} dragConstraints={placement?.bounds}
      onDragStart={() => setMoved(true)}
      onPointerDown={event => { if (!event.target.closest('a, button')) dragControls.start(event); }}
      data-side={placement?.side} data-ready={!!placement} onKeyDown={onKeyDown}
      style={{ x, y, left: placement?.left, top: placement?.top, '--tip-left': `${placement?.tip || 32}px`, visibility: placement ? 'visible' : 'hidden' }}>
      <div id={`${id}-content`} className="note-popup-content">{children}</div>
      <button className="note-popup-close" aria-label={`Close ${title}`} onClick={() => close(true)}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
      </button>
    </motion.div>, document.body
  );
}

export default function NotePopup({ label, title, className, children, icon, panelClassName }) {
  const [open, setOpen] = useState(false);
  const anchor = useRef(null);
  const id = useId();
  const close = useCallback((restoreFocus) => {
    setOpen(false);
    if (restoreFocus) anchor.current?.focus({ preventScroll: true });
  }, []);
  return <>
    <button ref={anchor} className={className} aria-haspopup="dialog" aria-expanded={open} aria-controls={open ? id : undefined} onClick={() => setOpen(value => !value)}>{icon}<span className="note-trigger-label">{label}</span></button>
    {open && <Panel panelClassName={panelClassName} anchor={anchor} id={id} title={title} close={close}>{children}</Panel>}
  </>;
}
