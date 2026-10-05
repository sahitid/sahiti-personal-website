import { useEffect, useRef, useState } from 'react';

import { boatStrokes } from '../lib/boat-strokes';

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
