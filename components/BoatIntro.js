import { useEffect, useRef, useState } from 'react';

// Stroke order and direction traced by Sahiti; relative timing scaled to the original intro speed.
const boatStrokes = [
  { d: 'M2 14 L12.5455 38', duration: 0.122649, delay: 0.000000 },
  { d: 'M12.5455 38 H49.4545', duration: 0.105061, delay: 0.122649 },
  { d: 'M49.4545 38 L60 14', duration: 0.159805, delay: 0.227711 },
  { d: 'M60 14 L33.6364 27.3333 L12.5455 38', duration: 0.146294, delay: 0.387516 },
  { d: 'M2 14 L33.6364 27.3333', duration: 0.123931, delay: 0.533810 },
  { d: 'M12 18 L29.7333 2', duration: 0.101684, delay: 0.657740 },
  { d: 'M29.7333 2 L50 18', duration: 0.072099, delay: 0.759424 },
  { d: 'M29.6 4 L24 22', duration: 0.078971, delay: 0.831523 },
  { d: 'M29.6 4 L38 22', duration: 0.071749, delay: 0.910493 },
  { d: 'M2 14 H16', duration: 0.062548, delay: 0.982243 },
  { d: 'M46 14 H60', duration: 0.055210, delay: 1.044790 },
];

const INTRO_SEEN_KEY = 'sahiti-boat-intro-seen';
let introSeenInMemory = false;

// Shared across tabs; an explicit homepage reload can replay the intro.
export default function BoatIntro() {
  const [active, setActive] = useState(false);
  const overlay = useRef(null);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const navigation = window.performance.getEntriesByType('navigation')[0];
    const homeReload = window.location.pathname === '/' && navigation?.type === 'reload';
    let seen = introSeenInMemory;
    try {
      seen = seen || window.localStorage.getItem(INTRO_SEEN_KEY) === 'true';
      window.localStorage.setItem(INTRO_SEEN_KEY, 'true');
    } catch {
      // Keep navigation working if browser storage is unavailable.
    }
    introSeenInMemory = true;
    if (!seen || homeReload) setActive(true);
  }, []);
  useEffect(() => {
    if (!active) return;
    let flight;
    let disposed = false;
    const timer = setTimeout(() => {
      const target = document.querySelector('.home-boat .boat-icon');
      const drawing = overlay.current?.querySelector('.boat-intro-drawing');
      if (!target || !drawing) { setActive(false); return; }
      // Measure after the header entrance finishes; use actual fixed viewport coordinates.
      const destination = target.getBoundingClientRect();
      const start = drawing.getBoundingClientRect();
      flight = drawing.animate([
        { left: `${start.left}px`, top: `${start.top}px`, width: `${start.width}px`, height: `${start.height}px`, transform: 'rotate(0deg)' },
        { left: `${destination.left}px`, top: `${destination.top}px`, width: `${destination.width}px`, height: `${destination.height}px`, transform: 'rotate(0deg)' },
      ], { duration: 1260, easing: 'cubic-bezier(.65,0,.25,1)', fill: 'forwards' });
      flight.finished.then(() => { if (!disposed) setActive(false); }).catch(() => {});
    }, 1540);
    return () => { disposed = true; clearTimeout(timer); flight?.cancel(); };
  }, [active]);
  if (!active) return null;
  return <div ref={overlay} className="boat-intro" aria-hidden="true">
    <div className="boat-intro-paper" />
    <svg className="boat-intro-wave" viewBox="0 0 1440 1000" preserveAspectRatio="none"><path d="M0 150 C240 -60 480 350 720 150 S1200 -60 1440 150 V1000 H0Z" fill="currentColor" /></svg>
    <div className="boat-intro-drawing">
    <svg viewBox="0 0 62 40" fill="none" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      {boatStrokes.map((stroke, index) => <path
        key={index}
        pathLength="1"
        d={stroke.d}
        style={{ animationDuration: `${stroke.duration}s`, animationDelay: `${stroke.delay}s` }}
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />)}
    </svg>
    </div>
  </div>;
}
