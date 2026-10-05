import { useEffect, useRef, useState } from 'react';

export default function VideoThumbnail({ src, poster, title }) {
  const ref = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video || failed) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    const update = () => {
      if (visible && !document.hidden && !motion.matches && !navigator.connection?.saveData) {
        if (video.getAttribute('src') !== src) video.src = src;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    }, { threshold: 0.15 });
    observer.observe(video);
    motion.addEventListener('change', update);
    document.addEventListener('visibilitychange', update);
    return () => {
      observer.disconnect();
      motion.removeEventListener('change', update);
      document.removeEventListener('visibilitychange', update);
      video.pause();
    };
  }, [src, failed]);

  if (failed) return <img src={poster} alt={`${title} preview`} loading="lazy" />;
  return <video ref={ref} poster={poster} muted loop playsInline preload="none" aria-label={`${title} video preview`} onError={() => setFailed(true)} />;
}
