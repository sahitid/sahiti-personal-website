import { useEffect, useRef, useState } from 'react';

export default function EventVideo({ src, label, inline = false }) {
  const ref = useRef(null);
  const manuallyPaused = useRef(false);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const video = ref.current;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    const update = () => {
      if (visible && !document.hidden) {
        if (!video.getAttribute('src')) video.src = src;
        if (!manuallyPaused.current && !motion.matches && !navigator.connection?.saveData) video.play().catch(() => {});
      } else video.pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    }, { threshold: 0.15 });
    observer.observe(video);
    document.addEventListener('visibilitychange', update);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); video.pause(); };
  }, [src]);
  function toggle() {
    const video = ref.current;
    if (video.paused) {
      manuallyPaused.current = false;
      if (!video.getAttribute('src')) video.src = src;
      video.play().catch(() => {});
    } else {
      manuallyPaused.current = true;
      video.pause();
    }
  }
  const Wrapper = inline ? "span" : "div";
  return <Wrapper className="event-video">
    <video ref={ref} muted loop playsInline preload="none" aria-label={label} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
    <button type="button" className="event-video-toggle" onClick={toggle} aria-label={`${playing ? 'Pause' : 'Play'} ${label}`}>
      <span className={playing ? 'event-pause-icon' : 'event-play-icon'} aria-hidden="true" />
    </button>
  </Wrapper>;
}
