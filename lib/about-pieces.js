export const aboutPieces = [
  {
    id: 'becoming', cell: 0, label: ['still', 'becoming'], title: 'Still becoming',
    statement: 'I am the amalgamation of many values, and I am changing (I grow and learn from my understanding of the world).',
    photo: 'becoming', position: 'xMidYMid',
  },
  {
    id: 'sponge', cell: 1, label: ['a sponge', 'with a spine'], title: 'A sponge, with a spine',
    statement: 'I am a sponge 🧽 but closer to Scrub Daddy material. I hold my own, provide good value, but love soaking up the ideas and energies around me when they are warm.',
    photo: 'sponge',
  },
  {
    id: 'yellow', cell: 2, label: ['a little', 'brighter'], title: 'A little brighter',
    statement: 'I am bright; color matters to me, and so does yellow.',
    photo: 'yellow', yellow: true,
  },
  {
    id: 'ambition', cell: 3, label: ['an appetite', 'for more'], title: 'An appetite for more',
    statement: 'I am ambitious; I want more than I can fit in my mouth.',
    photo: 'ambition',
  },
  {
    id: 'leader', cell: 4, label: ['when the', 'moment calls'], title: 'When the moment calls',
    statement: 'I am a situational leader.',
    photo: 'leader',
  },
  {
    id: 'profound', cell: 6, label: ['everything', 'is profound'], title: 'Everything is profound',
    statement: 'To me, everything is profound.',
    photo: 'profound',
  },
  {
    id: 'gathering', cell: 7, label: ['let’s get', 'together'], title: 'Let’s get together',
    statement: 'I will always plan a trip or party.',
    photo: 'gathering',
  },
  {
    id: 'bridge', cell: 8, label: ['connecting', 'the pieces'], title: 'Connecting the pieces',
    statement: 'I am a node (with a high degree of centrality) in your social network. When I realize I’m a bridge, I take the time to connect the pieces on the graph on either side.',
    photo: 'bridge',
  },
  {
    id: 'authentic', cell: 9, label: ['myself,', 'always'], title: 'Myself, always',
    statement: 'I believe authenticity > PR trained, but casual professionalism > brazenness.',
    photo: 'authentic',
  },
  {
    id: 'audacious', cell: 11, label: ['just', 'ask'], title: 'Just ask',
    statement: 'I am not afraid to ask & believe “closed mouths don’t get fed”. I am not afraid to be audacious.',
    photo: 'audacious',
  },
  {
    id: 'visual', cell: 12, label: ['thinking', 'in pictures'], title: 'Thinking in pictures',
    statement: 'I am a visual thinker and listener.',
    photo: 'visual',
  },
  {
    id: 'artist', cell: 13, label: ['an artist', 'at heart'], title: 'An artist at heart',
    statement: 'As a child, I wanted to be an artist.',
    photo: 'artist',
  },
  {
    id: 'metaphor', cell: 14, label: ['a world', 'of metaphors'], title: 'A world of metaphors',
    statement: 'I am dependent on symbols and metaphors.',
    photo: 'metaphor',
  },
  {
    id: 'playlist', cell: 15, label: ['a soundtrack', 'to all of this'], title: 'A soundtrack to all of this',
    statement: 'I am this playlist:',
    photo: 'playlist',
    playlist: 'https://open.spotify.com/embed/playlist/1u1PtKkhdkbh900KC9Q1Q0',
  },
];

// Each shared cut is generated once, then traversed in reverse by its neighbor.
// The two empty interior cells leave a square silhouette with room to grow.
const horizontalCuts = [[1, -1, 1, -1], [-1, 1, -1, 1], [1, -1, 1, -1]];
const verticalCuts = [[1, -1, 1], [-1, 1, -1], [1, -1, 1], [-1, 1, -1]];
export const PIECE_SIZE = 150;

function edge(x, y, dx, dy, direction) {
  const point = (along, out = 0) => `${x + dx * along + dy * out} ${y + dy * along - dx * out}`;
  if (!direction) return `L ${point(PIECE_SIZE)}`;
  const depth = direction * 23;
  return [
    `L ${point(53)}`,
    `C ${point(65)} ${point(64, depth * 0.28)} ${point(61, depth * 0.58)}`,
    `C ${point(48, depth * 1.55)} ${point(102, depth * 1.55)} ${point(89, depth * 0.58)}`,
    `C ${point(86, depth * 0.28)} ${point(85)} ${point(97)}`,
    `L ${point(PIECE_SIZE)}`,
  ].join(' ');
}

export function piecePath(cell) {
  const row = Math.floor(cell / 4);
  const col = cell % 4;
  return [
    'M 0 0',
    edge(0, 0, 1, 0, row ? -horizontalCuts[row - 1][col] : 0),
    edge(150, 0, 0, 1, col < 3 ? verticalCuts[row][col] : 0),
    edge(150, 150, -1, 0, row < 3 ? horizontalCuts[row][col] : 0),
    edge(0, 150, 0, -1, col ? -verticalCuts[row][col - 1] : 0),
    'Z',
  ].join(' ');
}
