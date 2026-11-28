import { useId, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { PUZZLE_WIDTH, PUZZLE_HEIGHT, referencePieces } from '../lib/reference-puzzle';
import { inkFragments, puzzleArtwork, puzzleDoodles, puzzleLettering, puzzleWords } from '../lib/puzzle-artwork';
import styles from './ReferencePuzzle.module.css';
import PuzzlePieceBack from './PuzzlePieceBack';
import PuzzleStory from './PuzzleStory';
import { initialPairings, initialNoteEdits, storyById, puzzleStories } from '../lib/puzzle-stories';
import PuzzlePairingEditor from './PuzzlePairingEditor';

export default function ReferencePuzzle() {
  const id = useId().replace(/:/g, '');
  const [flipped, setFlipped] = useState(() => new Set());
  const [activePiece, setActivePiece] = useState(null);
  const buttons = useRef([]);
  const router = useRouter();
  const photoFrame = puzzleArtwork.photo.frame;
  const canPair = process.env.NODE_ENV === 'development' && router.query.pair === '1';
  const [pairings, setPairings] = useState(initialPairings);
  const noteEdits = initialNoteEdits;
  const [pairingPiece, setPairingPiece] = useState(null);
  const storyByPiece = Object.fromEntries(Object.entries(pairings).map(([piece, storyId]) => [piece, {
    ...storyById[storyId], piece: Number(piece),
    statement: noteEdits[storyId]?.text || storyById[storyId].statement,
    layout: noteEdits[storyId]?.layouts?.[piece],
  }]));
  const orderedStories = Object.values(storyByPiece).sort((a, b) => a.number - b.number);
  const [readingPiece, setReadingPiece] = useState(null);

  function readStory(index) {
    setFlipped(previous => {
      const next = new Set(previous);
      if (readingPiece !== null) next.delete(readingPiece);
      next.add(index);
      return next;
    });
    setReadingPiece(index);
  }

  function closeStory() {
    const index = readingPiece;
    setFlipped(previous => {
      const next = new Set(previous);
      next.delete(index);
      return next;
    });
    setReadingPiece(null);
    requestAnimationFrame(() => buttons.current[index]?.focus());
  }

  function flip(index) {
    if (!canPair && !storyByPiece[index]) return;
    setActivePiece(index);
    if (canPair) { setPairingPiece(index); return; }
    readStory(index);
  }

  function navigate(event, index) {
    const offsets = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 5, ArrowUp: -5 };
    const available = referencePieces.filter(piece => canPair || storyByPiece[piece.index]).map(piece => piece.index);
    let next;
    if (event.key in offsets) {
      for (let step = 1; step <= referencePieces.length; step++) {
        const candidate = (index + offsets[event.key] * step + referencePieces.length * 5) % referencePieces.length;
        if (available.includes(candidate)) { next = candidate; break; }
      }
    }
    else if (event.key === 'Home') next = available[0];
    else if (event.key === 'End') next = available.at(-1);
    else return;
    event.preventDefault();
    buttons.current[next]?.focus();
  }

  return <><div className={styles.puzzle} role="group" aria-label="Pieces of Me, Sahiti’s illustrated puzzle" aria-describedby={`${id}-instructions ${id}-artwork`}>
    <p id={`${id}-instructions`} className={styles.visuallyHidden}>{puzzleStories.length} pieces have personal notes and can be clicked to open an enlarged view. The other pieces are decorative. Use the side arrows to read another note. Click outside the piece or press Escape to return to the puzzle. You can also use Tab or the arrow keys to choose a piece with a note and Enter or Space to open it.</p>
    <p id={`${id}-artwork`} className={styles.visuallyHidden}>A white cardboard puzzle printed with black ink drawings of {puzzleDoodles.join(', ')}. The words on the puzzle are: {puzzleWords.join('; ')}. A grainy photograph shows Sahiti holding a blue camera, wearing a pink dress.</p>
    {referencePieces.map(piece => {
      const { index, box, path } = piece;
      const story = storyByPiece[index];
      const interactive = canPair || Boolean(story);
      const Piece = interactive ? 'button' : 'div';
      const turned = Boolean(story) && flipped.has(index);
      const clip = `${id}-piece-${index}`;
      const print = `${id}-print-${index}`;
      const hasPhoto = puzzleArtwork.photo.src && index === puzzleArtwork.photo.piece;
      const photoMask = `${id}-photo-${index}`;
      return <Piece
        type={interactive ? 'button' : undefined} key={index}
        ref={node => { buttons.current[index] = interactive ? node : null; }}
        className={`${styles.piece} ${interactive ? styles.interactive : styles.staticPiece} ${turned ? styles.flipped : ''}`}
        style={{
          left: `${box.x / PUZZLE_WIDTH * 100}%`, top: `${box.y / PUZZLE_HEIGHT * 100}%`,
          width: `${box.width / PUZZLE_WIDTH * 100}%`, height: `${box.height / PUZZLE_HEIGHT * 100}%`,
          zIndex: interactive && activePiece === index ? 100 : turned ? 50 : 1,
        }}
        aria-label={canPair ? `Pair piece ${index + 1}` : story ? `Read ${story.title}, piece ${index + 1}` : undefined}
        aria-hidden={!interactive || undefined}
        aria-pressed={interactive ? turned : undefined}
        aria-haspopup={interactive ? 'dialog' : undefined}
        onClick={interactive ? () => flip(index) : undefined}
        onPointerEnter={interactive ? () => setActivePiece(index) : undefined} onPointerLeave={interactive ? () => setActivePiece(null) : undefined}
        onFocus={interactive ? () => setActivePiece(index) : undefined} onBlur={interactive ? () => setActivePiece(null) : undefined}
        onKeyDown={interactive ? event => navigate(event, index) : undefined}
      >
        <span className={styles.turn}>
          <span className={styles.front} aria-hidden="true">
            <svg viewBox={`${box.x} ${box.y} ${box.width} ${box.height}`}>
              <defs>
                <clipPath id={clip}><path d={path} /></clipPath>
                <filter id={print} x="-2%" y="-2%" width="104%" height="104%"><feGaussianBlur stdDeviation=".12" /></filter>
                {hasPhoto && <mask id={photoMask} maskUnits="userSpaceOnUse" x={box.x} y={box.y} width={box.width} height={box.height}>
                  <path d={path} fill="white" stroke="black" strokeWidth="2.2" strokeLinejoin="round" />
                </mask>}
              </defs>
              <g clipPath={`url(#${clip})`} id={`${clip}-artwork`}>
                <image href={puzzleArtwork.src} x="0" y="0" width={PUZZLE_WIDTH} height={PUZZLE_HEIGHT} preserveAspectRatio="none" />
                <g className={styles.printedInk} filter={`url(#${print})`}>
                  {inkFragments.map(fragment => <svg
                    key={fragment.name} x={fragment.x} y={fragment.y}
                    width={fragment.width} height={fragment.height}
                    viewBox={fragment.source.join(' ')} preserveAspectRatio="xMidYMid meet"
                    className={styles.inkFragment}
                  ><image href={fragment.asset || puzzleArtwork.ink} x="0" y="0" width={fragment.imageWidth || 1124} height={fragment.imageHeight || 1399} /></svg>)}
                  <path d="M 153 723 L 206 718" stroke="#d8b143" strokeWidth="3.5" opacity=".65" />
                  {puzzleLettering.map(label => <text
                    key={label.text.join(' ')} x={label.x} y={label.y}
                    className={styles.printedWords} fontSize={label.size}
                    textAnchor={label.anchor || 'start'}
                  >
                    {label.text.map((line, lineIndex) => <tspan key={line} x={label.x} dy={lineIndex ? label.leading || label.size : 0}>{line}</tspan>)}
                  </text>)}
                </g>
                {hasPhoto && <g mask={`url(#${photoMask})`}>
                  <image
                    href={puzzleArtwork.photo.src}
                    x={photoFrame.x}
                    y={photoFrame.y}
                    width={photoFrame.width} height={photoFrame.height}
                    preserveAspectRatio="xMaxYMid slice"
                  />
                  <image href={puzzleArtwork.src} x="0" y="0" width={PUZZLE_WIDTH} height={PUZZLE_HEIGHT} preserveAspectRatio="none" className={styles.photoPaper} />
                </g>}
              </g>
              <path d={path} className={styles.hitArea} />
              <path d={path} className={styles.focusOutline} />
            </svg>
          </span>
          {story && <span className={styles.back} aria-hidden="true">
            <svg viewBox={`${box.x} ${box.y} ${box.width} ${box.height}`}>
                <PuzzlePieceBack piece={piece} story={story} />
                <g transform={`translate(${box.x * 2 + box.width} 0) scale(-1 1)`}>
                  <path d={path} className={styles.hitArea} />
                  <path d={path} className={styles.focusOutline} />
                </g>
            </svg>
          </span>}
        </span>
      </Piece>;
    })}
  </div>
    {canPair && <PuzzlePairingEditor pieceIndex={pairingPiece} pairings={pairings} frontId={`${id}-piece-${pairingPiece}-artwork`}
      onSave={next => { setPairings(next); setPairingPiece(null); }} onClose={() => setPairingPiece(null)} />}
    {readingPiece !== null && <PuzzleStory story={storyByPiece[readingPiece]} stories={orderedStories} onClose={closeStory} onSelect={readStory} />}
  </>;
}
