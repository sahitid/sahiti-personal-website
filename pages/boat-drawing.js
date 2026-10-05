import Head from 'next/head';
import { useRef, useState } from 'react';

const outline = 'M2 14L12.5455 38M2 14L33.6364 27.3333M2 14H16M12.5455 38H49.4545L60 14M12.5455 38L33.6364 27.3333M60 14L33.6364 27.3333M60 14H46M12 18L29.7333 2L50 18M24 22L29.6 4L38 22';
const pathFor = points => points.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ');

export default function BoatDrawing() {
  const [strokes, setStrokes] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [replay, setReplay] = useState(0);
  const [guide, setGuide] = useState(true);
  const current = useRef(null);
  function point(event) {
    const svg = event.currentTarget;
    const p = svg.createSVGPoint();
    p.x = event.clientX; p.y = event.clientY;
    const local = p.matrixTransform(svg.getScreenCTM().inverse());
    return { x: local.x, y: local.y, time: performance.now() };
  }
  function start(event) {
    if (event.button !== 0) return;
    event.preventDefault();
    setPlaying(false);
    const p = point(event);
    current.current = [p];
    event.currentTarget.setPointerCapture(event.pointerId);
    setStrokes(previous => [...previous, [p]]);
  }
  function move(event) {
    if (!current.current) return;
    const p = point(event);
    const last = current.current[current.current.length - 1];
    if (Math.hypot(last.x - p.x, last.y - p.y) < .15) return;
    current.current = [...current.current, p];
    setStrokes(previous => [...previous.slice(0, -1), current.current]);
  }
  function finish(event) {
    if (!current.current) return;
    if (current.current.length < 2) setStrokes(previous => previous.slice(0, -1));
    current.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }
  function download() {
    const data = { viewBox: '-6 -6 74 52', strokes: strokes.map(points => ({ path: pathFor(points), points: points.map(p => ({ x: p.x, y: p.y, time: Math.round(p.time - points[0].time) })) })) };
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    const a = document.createElement('a'); a.href = url; a.download = 'my-boat-drawing.json'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  let delay = 0;
  return <main className="standard-main boat-drawing-page">
    <Head><title>Draw the boat — Sahiti Dasari</title></Head>
    <header className="page-heading"><h1>Draw the boat</h1><p>Trace the faint outline in your preferred order. Lift your mouse or finger between strokes.</p></header>
    <div className="boat-drawing-tools">
      <button disabled={!strokes.length} onClick={() => { setPlaying(false); setStrokes(strokes.slice(0, -1)); }}>Undo stroke</button>
      <button disabled={!strokes.length} onClick={() => { setPlaying(false); setStrokes([]); }}>Start over</button>
      <button disabled={!strokes.length} onClick={() => { setPlaying(true); setReplay(replay + 1); }}>Replay</button>
      <label><input type="checkbox" checked={guide} onChange={e => setGuide(e.target.checked)} /> Show outline</label>
    </div>
    <svg className="boat-drawing-canvas" viewBox="-6 -6 74 52" aria-label="Boat tracing canvas. Draw with your mouse, pen, or finger."
      onPointerDown={start} onPointerMove={move} onPointerUp={finish} onPointerCancel={finish} onLostPointerCapture={() => { current.current = null; }}>
      {guide && <path d={outline} fill="none" stroke="#d9d7d0" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />}
      <g key={replay} fill="none" stroke="var(--ink)" strokeWidth=".6" strokeLinecap="round" strokeLinejoin="round">
        {strokes.map((points, index) => {
          const duration = Math.max(.15, (points[points.length - 1].time - points[0].time) / 1000);
          const startAt = delay; delay += duration + .18;
          return <path key={index} d={pathFor(points)} pathLength="1" style={playing ? { strokeDasharray: 1, strokeDashoffset: 1, animation: `boat-trace ${duration}s linear ${startAt}s forwards` } : undefined} />;
        })}
      </g>
      {!playing && strokes.map((points, index) => <text key={index} x={points[0].x + 1} y={points[0].y - 1.5} fontSize="1.6" fill="#8a8058" pointerEvents="none">{index + 1}</text>)}
    </svg>
    <div className="boat-drawing-bottom"><p aria-live="polite">{strokes.length} {strokes.length === 1 ? 'stroke' : 'strokes'} recorded</p><button disabled={!strokes.length} onClick={download}>Download drawing ↓</button></div>
    <p className="boat-drawing-note">When you're happy with it, download the drawing and attach the file in this chat. It includes your stroke order, direction, and timing.</p>
  </main>;
}
