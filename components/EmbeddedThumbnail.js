import { useEffect, useRef, useState } from 'react';

export default function EmbeddedThumbnail({ src, poster, title }) {
  const ref = useRef(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    const update = () => setActive(visible && !document.hidden && !motion.matches && !navigator.connection?.saveData);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    }, { threshold: 0.15 });
    observer.observe(ref.current);
    motion.addEventListener('change', update);
    document.addEventListener('visibilitychange', update);
    return () => {
      observer.disconnect();
      motion.removeEventListener('change', update);
      document.removeEventListener('visibilitychange', update);
    };
  }, []);
  return <div className="embedded-thumbnail" ref={ref}>
    <img src={poster} alt={`${title} preview`} loading="lazy" />
    {active && <iframe src={src} title={`${title} video preview`} allow="autoplay" tabIndex={-1} aria-hidden="true" />}
  </div>;
}
