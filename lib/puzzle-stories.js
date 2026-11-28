import { aboutPieces } from './about-pieces.js';
import savedPairings from './puzzle-pairings.json';
import savedNoteEdits from './puzzle-note-edits.json';

const statements = Object.fromEntries(aboutPieces.map(piece => [piece.id, piece]));
statements.creating = {
  id: 'creating', title: 'Taking in, making something',
  statement: 'I AM FULFILLED BY NOVELTY: FINDING IT AND CREATING IT.',
};
statements.chaos = {
  id: 'chaos', title: 'Organizing the chaos',
  statement: "I feel the most in control when I'm the one organizing the chaos.",
};

export const initialPairings = savedPairings;
export const initialNoteEdits = savedNoteEdits;
export const puzzleStories = [
  'becoming', 'sponge', 'yellow', 'ambition', 'leader', 'profound', 'gathering', 'bridge',
  'chaos', 'authentic', 'audacious', 'creating', 'visual', 'artist', 'metaphor', 'playlist',
].map((id, index) => ({ ...statements[id], piece: Number(Object.keys(savedPairings).find(piece => savedPairings[piece] === id)), number: index + 1 }));
export const storyById = Object.fromEntries(puzzleStories.map(story => [story.id, story]));

export function pairNote(pairings, piece, storyId) {
  const next = { ...pairings };
  const previousPiece = Object.keys(next).find(key => next[key] === storyId);
  const displaced = next[piece];
  if (previousPiece !== undefined) {
    if (displaced) next[previousPiece] = displaced;
    else delete next[previousPiece];
  }
  next[piece] = storyId;
  return next;
}

export const storyByPiece = Object.fromEntries(puzzleStories.map(story => [story.piece, story]));

const glyphs = {
  A: .722, B: .722, C: .722, D: .722, E: .667, F: .611, G: .778,
  H: .722, I: .278, J: .556, K: .722, L: .611, M: .833, N: .722,
  O: .778, P: .667, Q: .778, R: .722, S: .667, T: .611, U: .722,
  V: .722, W: .944, X: .722, Y: .667, Z: .611,
  ' ': .278, '.': .278, ',': .278, ';': .333, ':': .333,
  '’': .278, '“': .5, '”': .5, '(': .333, ')': .333, '&': .722, '>': .584,
};
export const inkWidth = (text, size) => [...text].reduce((total, letter) => total + (glyphs[letter] ?? (/\d/.test(letter) ? .556 : 1)), 0) * size;
const shapeCache = new WeakMap();

function intersectIntervals(first, second) {
  const result = [];
  for (const a of first) for (const b of second) {
    const left = Math.max(a[0], b[0]);
    const right = Math.min(a[1], b[1]);
    if (right > left) result.push([left, right]);
  }
  return result;
}

function shapeRows(piece) {
  if (shapeCache.has(piece)) return shapeCache.get(piece);
  const mirrorX = piece.box.x * 2 + piece.box.width;
  const polygon = piece.outline.map(([x, y]) => [mirrorX - x, y]);
  const top = Math.floor(Math.min(...polygon.map(point => point[1])) * 2) / 2;
  const bottom = Math.ceil(Math.max(...polygon.map(point => point[1])) * 2) / 2;
  const rows = [];
  for (let y = top; y <= bottom; y += .5) {
    const crossings = [];
    for (let i = 0; i < polygon.length; i++) {
      const a = polygon[i];
      const b = polygon[(i + 1) % polygon.length];
      if ((a[1] > y) !== (b[1] > y)) crossings.push(a[0] + (y - a[1]) * (b[0] - a[0]) / (b[1] - a[1]));
    }
    crossings.sort((a, b) => a - b);
    const intervals = [];
    for (let i = 0; i + 1 < crossings.length; i += 2) intervals.push([crossings[i], crossings[i + 1]]);
    rows.push(intervals);
  }
  const shape = { top, bottom, rows, notes: new Map() };
  shapeCache.set(piece, shape);
  return shape;
}

export function textFitsPiece(piece, line, size) {
  if (!line.text.trim()) return true;
  const shape = shapeRows(piece);
  const width = inkWidth(line.text, size);
  const first = Math.floor((line.y - size * .9 - shape.top) * 2);
  const last = Math.ceil((line.y + size * .22 - shape.top) * 2);
  if (first < 0 || last >= shape.rows.length) return false;
  for (let row = first; row <= last; row++) {
    if (!shape.rows[row].some(([left, right]) => line.x >= left + .5 && line.x + width <= right - .5)) return false;
  }
  return true;
}

export function noteLayout(story, piece) {
  if (!story.layout) return printedNote(story.statement, piece);
  return { size: story.layout.size, lines: story.layout.lines.map(line => ({ ...line, width: inkWidth(line.text, story.layout.size) })) };
}

// Flow text through the actual silhouette. A row may contain two separate
// runs, leaving a real blank around a socket instead of hiding printed words.
export function printedNote(statement, piece) {
  const shape = shapeRows(piece);
  if (shape.notes.has(statement)) return shape.notes.get(statement);
  const words = statement.toLocaleUpperCase().split(/\s+/);
  const margin = 3;
  for (let size = 24; size >= 2; size -= .25) {
    for (const offset of [0, .35, .7]) {
      const lines = [];
      let word = 0;
      for (let y = shape.top + margin + size * (.9 + offset); y + size * .22 + margin < shape.bottom; y += size * 1.14) {
        let slots = [[-Infinity, Infinity]];
        const first = Math.max(0, Math.floor((y - size * .9 - margin - shape.top) * 2));
        const last = Math.min(shape.rows.length - 1, Math.ceil((y + size * .22 + margin - shape.top) * 2));
        for (let row = first; row <= last && slots.length; row++) slots = intersectIntervals(slots, shape.rows[row]);
        for (const [left, right] of slots) {
          const available = right - left - margin * 2;
          let line = '';
          while (word < words.length) {
            const candidate = line ? `${line} ${words[word]}` : words[word];
            if (inkWidth(candidate, size) > available) break;
            line = candidate;
            word++;
          }
          if (line === 'I' && lines.length === 0 && word < words.length) { word--; line = ''; }
          if (line) {
            const width = inkWidth(line, size);
            lines.push({ text: line, x: left + (right - left - width) / 2, y, width, left: left + margin, right: right - margin });
          }
          if (word === words.length) break;
        }
        if (word === words.length) break;
      }
      if (word === words.length) {
        const note = { size, lines };
        shape.notes.set(statement, note);
        return note;
      }
    }
  }
  throw new Error('This note is too long to fit on a puzzle piece.');
}
