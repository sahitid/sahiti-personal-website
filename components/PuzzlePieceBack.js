import { useId } from 'react';
import { inkWidth, noteLayout } from '../lib/puzzle-stories';
import styles from './PuzzleStory.module.css';

export default function PuzzlePieceBack({ piece, story, hideText = false }) {
  const id = useId().replace(/:/g, '');
  const { box, path } = piece;
  const mirror = `translate(${box.x * 2 + box.width} 0) scale(-1 1)`;
  const note = noteLayout(story, piece);

  return <>
    <defs>
      <linearGradient id={`${id}-paper`} x1="0" y1="0" x2=".8" y2="1">
        <stop offset="0" stopColor="#dedbd2" /><stop offset="1" stopColor="#c7c2b7" />
      </linearGradient>
      <filter id={`${id}-fiber`} x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency=".75" numOctaves="3" seed={piece.index + 3} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer><feFuncA type="linear" slope=".28" /></feComponentTransfer>
        <feComposite in2="SourceGraphic" operator="in" />
        <feBlend in="SourceGraphic" mode="soft-light" />
      </filter>
      <filter id={`${id}-ink`}><feGaussianBlur stdDeviation=".075" /></filter>
      <clipPath id={`${id}-clip`}><path d={path} transform={mirror} /></clipPath>
    </defs>
    <g transform={mirror}>
      <path d={path} fill="#8d887d" transform="translate(0 1.1)" />
      <path d={path} fill={`url(#${id}-paper)`} filter={`url(#${id}-fiber)`} />
      <path d={path} fill="none" stroke="#ece8df" strokeWidth="1" />
      <path d={path} fill="none" stroke="#918b7f" strokeWidth=".35" />
    </g>
    {!hideText && <g clipPath={`url(#${id}-clip)`} className={styles.print} filter={`url(#${id}-ink)`}>
      {note.lines.map((line, index) => {
        const highlight = story.id === 'yellow' && /\bYELLOW\b/.exec(line.text);
        const regularWord = story.id === 'chaos' && /\bI['’]M\b/.exec(line.text);
        return <g key={`${index}-${line.text}`}>
          {highlight && <rect
            x={line.x + inkWidth(line.text.slice(0, highlight.index), note.size) - note.size * .08}
            y={line.y - note.size * .82}
            width={inkWidth(highlight[0], note.size) + note.size * .16}
            height={note.size * .98}
            fill="#ffe66b" opacity=".86"
          />}
          <text x={line.x} y={line.y} fontSize={note.size} textLength={line.width} lengthAdjust="spacingAndGlyphs">
            {regularWord ? <>
              {line.text.slice(0, regularWord.index)}
              <tspan fontWeight="400">{regularWord[0]}</tspan>
              {line.text.slice(regularWord.index + regularWord[0].length)}
            </> : line.text}
          </text>
        </g>;
      })}
    </g>}
  </>;
}
