import { useEffect, useId, useRef, useState } from 'react';
import { puzzleStories } from '../lib/puzzle-stories';
import { referencePieces } from '../lib/reference-puzzle';
import PuzzlePieceBack from './PuzzlePieceBack';
import styles from './PuzzleStory.module.css';

export default function PuzzleStory({ story, stories = puzzleStories, onClose, onSelect }) {
  const id = useId().replace(/:/g, '');
  const dialog = useRef(null);
  const [closing, setClosing] = useState(false);
  const piece = referencePieces[story.piece];
  const { box } = piece;
  useEffect(() => { if (!dialog.current.open) dialog.current.showModal(); }, []);
  useEffect(() => {
    if (!closing) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = window.setTimeout(onClose, reducedMotion ? 0 : 200);
    return () => window.clearTimeout(timer);
  }, [closing, onClose]);

  function step(direction) {
    if (closing) return;
    const index = stories.findIndex(item => item.id === story.id);
    onSelect(stories[(index + direction + stories.length) % stories.length].piece);
  }

  function dismissOutsidePiece(event) {
    if (event.target.closest('button, a, iframe, [data-puzzle-surface]')) return;
    setClosing(true);
  }

  return <dialog
    ref={dialog} className={`${styles.dialog} ${closing ? styles.closing : ''}`} aria-labelledby={`${id}-title`} aria-describedby={`${id}-statement`}
    onCancel={event => { event.preventDefault(); setClosing(true); }}
    onClick={dismissOutsidePiece}
  >
    <h2 id={`${id}-title`} className={styles.visuallyHidden}>{story.title}</h2>
    <p id={`${id}-statement`} className={styles.visuallyHidden}>{story.statement}</p>
    <div className={styles.stage} style={{ '--piece-ratio': (box.width + 12) / (box.height + 12) }}>
      <button type="button" className={styles.arrow} onClick={() => step(-1)} aria-label="Read previous piece">
        <span className={styles.arrowGlyph} aria-hidden="true">←</span>
      </button>
      <div key={story.id} className={styles.cardMotion}>
        <svg className={styles.card} viewBox={`${box.x - 6} ${box.y - 6} ${box.width + 12} ${box.height + 12}`} aria-hidden="true">
          <g pointerEvents="none"><PuzzlePieceBack piece={piece} story={story} /></g>
          <path
            data-puzzle-surface="" d={piece.path}
            transform={`translate(${box.x * 2 + box.width} 0) scale(-1 1)`}
            fill="transparent" stroke="transparent" strokeWidth="2.2" pointerEvents="all"
          />
        </svg>
      </div>
      <button type="button" className={styles.arrow} onClick={() => step(1)} aria-label="Read next piece">
        <span className={styles.arrowGlyph} aria-hidden="true">→</span>
      </button>
    </div>
    <p className={styles.counter}>{String(story.number).padStart(2, '0')} / {stories.length}</p>
    {story.playlist && <div className={styles.playlist}>
      <iframe src={story.playlist} title="Sahiti’s playlist" width="100%" height="152" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" />
      <a href="https://open.spotify.com/playlist/1u1PtKkhdkbh900KC9Q1Q0" target="_blank" rel="noopener noreferrer">Open in Spotify<span className="site-arrow" aria-hidden="true"> ↗</span></a>
    </div>}
  </dialog>;
}
