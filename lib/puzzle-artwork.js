import photoCrop from './puzzle-photo-crop.json';

// The printed surface can change without changing the cut geometry or flips.
export const puzzleArtwork = {
  src: '/images/puzzle/photographic-paper.webp',
  ink: '/images/puzzle/personal-ink.webp',
  // The candid photo fills one complete silhouette, including its tabs.
  photo: { src: '/images/puzzle/sahiti-gallery-8208.webp', piece: 13, frame: photoCrop },
};

// Crop the transparent artwork atlas in SVG so each print can retain the
// reference's scale, stroke weight, and generous areas of white cardboard.
export const inkFragments = [
  { name: 'snake plant', source: [0, 0, 330, 570], x: 12, y: 8, width: 119, height: 205 },
  { name: 'eight ball', asset: '/images/puzzle/eight-ball.webp', imageWidth: 640, imageHeight: 645, source: [0, 0, 640, 645], x: 266, y: 14, width: 74, height: 74 },
  { name: 'labyrinth and thread', asset: '/images/puzzle/labyrinth.webp', imageWidth: 962, imageHeight: 952, source: [0, 0, 962, 952], x: 474, y: 8, width: 164, height: 164 },
  { name: 'hummingbird', asset: '/images/puzzle/hummingbird.webp', imageWidth: 800, imageHeight: 672, source: [0, 0, 800, 672], x: 505, y: 338, width: 79, height: 76 },
  { name: 'people and bridge', source: [165, 800, 580, 230], x: 137, y: 443, width: 214, height: 85 },
  { name: 'boat and waves', asset: '/images/puzzle/boat-waves.webp', imageWidth: 800, imageHeight: 531, source: [0, 0, 800, 531], x: 3, y: 628, width: 140, height: 104 },
  { name: 'tea party', asset: '/images/puzzle/tea-party.webp', imageWidth: 1706, imageHeight: 922, source: [0, 0, 1706, 922], x: 269, y: 558, width: 310, height: 167 },
];

// Keep typography editable and use the reference's compact printed sans serif.
// The two retained captions are part of the photographic paper itself.
export const puzzleLettering = [
  { text: ['YOU TWO', 'SHOULD', 'MEET'], x: 365, y: 32, size: 14, leading: 14 },
  { text: ['LOVELY'], x: 147, y: 250, size: 14 },
  { text: ['EVERYTHING', 'IS', 'PROFOUND'], x: 507, y: 243, size: 12.5, leading: 14 },
  { text: ['JUST', 'ASK'], x: 43, y: 365, size: 15, leading: 16 },
  { text: ['NAÏVETÉ'], x: 145, y: 370, size: 15 },
  { text: ['IN OTHER', 'WORDS'], x: 296, y: 352, size: 14, leading: 15, anchor: 'middle' },
  { text: ['SONDER'], x: 382, y: 474, size: 15 },
  { text: ['ENERGY'], x: 492, y: 489, size: 15 },
  { text: ['YOU', 'NEED', 'COLOR'], x: 153, y: 680, size: 16, leading: 16 },
];

export const puzzleWords = [
  'YOU TWO SHOULD MEET',
  'LOVELY',
  'EVERYTHING IS PROFOUND',
  'IN OTHER WORDS',
  'YOU NEED COLOR',
  'JUST ASK',
  'SONDER',
  'NAÏVETÉ',
  'ENERGY',
  '?(INTERLUDE)',
  'AROUND THE WORLD IN A DAY',
];

export const puzzleDoodles = [
  'a paper boat',
  'a thread winding through a labyrinth',
  'ocean waves',
  'a snake plant',
  'a tea party with mismatched chairs, a teapot, cups, and cake',
  'a billiard eight ball',
  'a hummingbird',
  'two groups of people connected by a bridge',
];
