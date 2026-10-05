import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const A = [2, 14, 0], B = [12.5455, 38, 0], C = [33.6364, 27.3333, 0];
const D = [49.4545, 38, 0], E = [60, 14, 0];
const T = [29.7333, 2, 0], K = [31, 23, 0];
const outline = 'M2 14L12.5455 38M2 14L33.6364 27.3333M2 14H16M12.5455 38H49.4545L60 14M12.5455 38L33.6364 27.3333M60 14L33.6364 27.3333M60 14H46M12 18L29.7333 2L50 18M24 22L29.6 4L38 22';

// Rigid paper faces rotate about shared crease edges; no outline interpolation.
const faces = [
  { points: [[2, 14, 0], [60, 14, 0], K], hinge: [B, D], angle: -.18, shade: 237 },
  { points: [[12, 18, 0], T, K], hinge: [T, K], angle: -.48, shade: 251 },
  { points: [T, [50, 18, 0], K], hinge: [T, K], angle: .48, shade: 242 },
  { points: [B, D, C], hinge: [B, D], angle: 0, shade: 250 },
  { points: [A, B, C], hinge: [B, C], angle: -.58, shade: 255 },
  { points: [C, D, E], hinge: [C, D], angle: -.58, shade: 246 },
];

function rotateAroundEdge(point, start, end, angle) {
  const axis = end.map((value, i) => value - start[i]);
  const length = Math.hypot(...axis);
  const [u, v, w] = axis.map(value => value / length);
  const [x, y, z] = point.map((value, i) => value - start[i]);
  const c = Math.cos(angle), s = Math.sin(angle), dot = u * x + v * y + w * z;
  return [
    x * c + (v * z - w * y) * s + u * dot * (1 - c) + start[0],
    y * c + (w * x - u * z) * s + v * dot * (1 - c) + start[1],
    z * c + (u * y - v * x) * s + w * dot * (1 - c) + start[2],
  ];
}

function project(point, openness) {
  // A slight change of viewpoint reveals the depth of the opening panels.
  const turned = rotateAroundEdge(point, [31, 20, 0], [31, 21, 0], -.14 * openness);
  const [x, y, z] = rotateAroundEdge(turned, [31, 20, 0], [32, 20, 0], .16 * openness);
  const perspective = 180 / (180 - z);
  return [31 + (x - 31) * perspective, 20 + (y - 20) * perspective - openness * 2];
}

export default function HomeBoat() {
  const router = useRouter();
  const paper = useRef(null);
  const resting = useRef(null);
  const panels = useRef([]);
  const frame = useRef(null);
  const busy = useRef(false);
  useEffect(() => () => { cancelAnimationFrame(frame.current); }, []);

  function foldHome(event) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    event.preventDefault();
    if (busy.current) return;
    busy.current = true;
    const origin = router.asPath;
    const start = performance.now();
    const duration = 1150;
    function draw(now) {
      const progress = Math.min(1, (now - start) / duration);
      // Slow opening, a soft turnaround, then a slightly quicker return.
      const phase = progress < .55 ? progress / .55 : (1 - progress) / .45;
      const openness = (1 - Math.cos(Math.PI * phase)) / 2;
      const visibility = Math.min(1, progress * 12, (1 - progress) * 12);
      paper.current.style.opacity = visibility;
      resting.current.style.opacity = 1 - visibility;
      faces.forEach((face, index) => {
        const points = face.points.map(point => project(
          rotateAroundEdge(point, ...face.hinge, face.angle * openness), openness,
        ));
        panels.current[index].setAttribute('d', points.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(3)} ${y.toFixed(3)}`).join(' ') + 'Z');
        const shade = Math.round(255 - (255 - face.shade) * openness);
        panels.current[index].setAttribute('fill', `rgb(${shade},${shade},${shade})`);
      });
      if (progress < 1) frame.current = requestAnimationFrame(draw);
      else {
        busy.current = false;
        frame.current = null;
        if (origin === router.asPath && router.pathname !== '/') void router.push('/');
      }
    }
    frame.current = requestAnimationFrame(draw);
  }

  return <Link href="/" className="home-boat" aria-label="Home" title="Home" onClick={foldHome}>
    <svg className="boat-icon boat-origami" viewBox="0 -11 62 62" fill="none" aria-hidden="true">
      <path ref={resting} d={outline} stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <g ref={paper} opacity="0" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round">
        {faces.map((face, index) => <path key={index} ref={element => { panels.current[index] = element; }} />)}
      </g>
    </svg>
  </Link>;
}
