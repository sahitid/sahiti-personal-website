import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { boatStrokes } from '../lib/boat-strokes';

export default function HomeBoat() {
  const router = useRouter();
  const strokes = useRef([]);
  const frame = useRef(null);
  const busy = useRef(false);
  useEffect(() => () => { cancelAnimationFrame(frame.current); }, []);

  function drawHome(event) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    event.preventDefault();
    if (busy.current) return;
    busy.current = true;
    const origin = router.asPath;
    const start = performance.now();
    const last = boatStrokes[boatStrokes.length - 1];
    const total = last.delay + last.duration;

    function draw(now) {
      const elapsed = (now - start) / 1000;
      boatStrokes.forEach((stroke, index) => {
        const progress = Math.max(0, Math.min(1, (elapsed - stroke.delay) / stroke.duration));
        strokes.current[index].style.strokeDashoffset = 1 - progress;
        // Hide rounded end caps until their stroke starts.
        strokes.current[index].style.opacity = progress > 0 ? 1 : 0;
      });
      if (elapsed < total) frame.current = requestAnimationFrame(draw);
      else {
        busy.current = false;
        frame.current = null;
        if (origin === router.asPath && router.pathname !== '/') void router.push('/');
      }
    }
    draw(start);
  }

  return <Link href="/" className="home-boat" aria-label="Home" title="Draw the boat · Home" onClick={drawHome}>
    <svg className="boat-icon boat-origami" viewBox="0 -11 62 62" fill="none" aria-hidden="true">
      {boatStrokes.map((stroke, index) => <path key={stroke.d}
        ref={element => { strokes.current[index] = element; }}
        d={stroke.d} pathLength="1" strokeDasharray="1" strokeDashoffset="0"
        stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
      />)}
    </svg>
  </Link>;
}
