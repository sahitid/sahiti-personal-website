// Local interaction study of the user-supplied photograph:
// https://x.com/haroonisdreamin/status/2125895860508856595
// The surface is photographic; each silhouette and reverse side is independent.
export const PUZZLE_WIDTH = 592;
export const PUZZLE_HEIGHT = 737;

const columns = [0, 123, 236, 353, 470, 592];
const rows = [0, 100, 208, 313, 420, 526, 632, 737];
const xOffsets = [
  [0, 0, -1, -1, -3, 0], [0, -2, 0, 0, -1, 0],
  [0, -1, -1, -.5, -1.5, 0], [0, -2, 1, -1, -.5, 0],
  [0, 0, 0, -1, 0, 0], [0, -2, 1, 0, 0, 0],
  [0, -1, 0, 0, 1, 0], [0, 0, 0, 0, 0, 0],
];
const yOffsets = [
  [0, 0, 0, 0, 0, 0], [-2, 2, 0, 2, 0, -2],
  [1, 0, 0, -.5, -.5, 1], [-3, -2, -2, -.5, -3.5, -4],
  [0, 1, -2, -1, -2, 0], [-1, 0, 0, -1, 0, 1],
  [1, -2, -3, 0, -2, -2], [0, 0, 0, 0, 0, 0],
];
const vertex = (row, col) => [columns[col] + xOffsets[row][col], rows[row] + yOffsets[row][col]];

// Both neighbors share every control point of a seam, traversed in reverse.
function seam(start, end, direction, depth = 24, shift = 0) {
  const length = Math.hypot(end[0] - start[0], end[1] - start[1]);
  const dx = (end[0] - start[0]) / length;
  const dy = (end[1] - start[1]) / length;
  const point = (along, out = 0) => [start[0] + dx * along - dy * out, start[1] + dy * along + dx * out];
  const center = length / 2 + shift;
  const d = depth * direction;
  const curves = [];
  let cursor = start;
  const curve = (a, b, to) => { curves.push([cursor, a, b, to]); cursor = to; };
  if (!direction) {
    curve(point(length / 3), point(length * 2 / 3), end);
    return curves;
  }
  curve(point(center * .35, -.6), point(center - 16, -1.8), point(center - 12));
  curve(point(center - 5), point(center - 9, d * .45), point(center - 12, d * .7));
  curve(point(center - 23, d * 1.65), point(center + 23, d * 1.65), point(center + 12, d * .7));
  curve(point(center + 9, d * .45), point(center + 5), point(center + 12));
  curve(point(center + 22, -1.8), point(length * .85, -.6), end);
  return curves;
}

const horizontal = rows.map((_, row) => Array.from({ length: 5 }, (_, col) => {
  const outer = row === 0 || row === 7;
  // Two open sockets are visible on the photograph's top edge.
  const direction = row === 0 && (col === 1 || col === 3) ? 1 : outer ? 0 : (row + col) % 2 ? 1 : -1;
  return seam(vertex(row, col), vertex(row, col + 1), direction, row === 0 ? 19 : 23, [2, -1, 0, -2, 0][col]);
}));
const vertical = Array.from({ length: 7 }, (_, row) => columns.map((_, col) => {
  const outer = col === 0 || col === 5;
  const direction = outer || (row === 0 && col === 1) ? 0 : (row + col) % 2 ? 1 : -1;
  return seam(vertex(row, col), vertex(row + 1, col), direction, 23, [0, -1, 2, -1, 1, 0][col]);
}));

// Trace the photo tile's four seams from the actual paper photograph. Sharing
// these curves with its neighbors keeps both faces fitted during a flip.
function tracedSeam(start, segments) {
  let cursor = start;
  return segments.map(([a, b, end]) => {
    const curve = [cursor, a, b, end];
    cursor = end;
    return curve;
  });
}
horizontal[2][3] = tracedSeam(vertex(2, 3), [
  [[369, 205], [394, 202.5], [400, 206.5]],
  [[405, 208.5], [396.5, 217.5], [397, 229]],
  [[397, 238.5], [408, 244], [416.5, 238.5]],
  [[428, 231.5], [422, 220], [419, 211.5]],
  [[413, 200], [450, 204], vertex(2, 4)],
]);
vertical[2][4] = tracedSeam(vertex(2, 4), [
  [[467, 220], [466, 238], [468, 247]],
  [[470, 254], [480, 243], [488.5, 245]],
  [[507, 247], [507, 267], [496, 273]],
  [[486, 280], [476, 266], [469.5, 270]],
  [[464, 273], [468, 296], vertex(3, 4)],
]);
horizontal[3][3] = tracedSeam(vertex(3, 3), [
  [[368, 316], [391, 316], [400.5, 314]],
  [[408, 313], [396, 302], [398, 289.5]],
  [[400, 278], [416, 277], [423, 283.5]],
  [[434, 293], [416, 305], [422, 313]],
  [[429, 316], [451, 312.5], vertex(3, 4)],
]);
vertical[2][3] = tracedSeam(vertex(2, 3), [
  [[355, 223], [355, 239], [352.5, 247]],
  [[350, 253], [339, 244], [331.5, 244]],
  [[316.5, 244], [312, 260], [323.5, 270.5]],
  [[332, 278], [345, 268], [351, 269.5]],
  [[356, 272], [354, 300], vertex(3, 3)],
]);
const reverse = curves => [...curves].reverse().map(([start, a, b, end]) => [end, b, a, start]);
const coordinates = point => point.map(value => Math.round(value * 100) / 100).join(' ');

export const referencePieces = Array.from({ length: 35 }, (_, index) => {
  const row = Math.floor(index / 5);
  const col = index % 5;
  const curves = [...horizontal[row][col], ...vertical[row][col + 1], ...reverse(horizontal[row + 1][col]), ...reverse(vertical[row][col])];
  const points = curves.flat();
  const left = Math.floor(Math.min(...points.map(point => point[0]))) - 3;
  const top = Math.floor(Math.min(...points.map(point => point[1]))) - 3;
  const right = Math.ceil(Math.max(...points.map(point => point[0]))) + 3;
  const bottom = Math.ceil(Math.max(...points.map(point => point[1]))) + 3;
  const outline = curves.flatMap(([start, a, b, end]) => Array.from({ length: 25 }, (_, step) => {
    const t = step / 24;
    const u = 1 - t;
    return [0, 1].map(axis => u ** 3 * start[axis] + 3 * u ** 2 * t * a[axis] + 3 * u * t ** 2 * b[axis] + t ** 3 * end[axis]);
  }));
  return {
    index, row, col,
    outline,
    body: { x: columns[col], y: rows[row], width: columns[col + 1] - columns[col], height: rows[row + 1] - rows[row] },
    path: `M ${coordinates(curves[0][0])} ${curves.map(([, a, b, end]) => `C ${coordinates(a)} ${coordinates(b)} ${coordinates(end)}`).join(' ')} Z`,
    box: { x: left, y: top, width: right - left, height: bottom - top },
  };
});
