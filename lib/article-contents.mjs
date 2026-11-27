// Shared reading behavior for every blog post and project writeup.
export const READING_LINE = 0.3;
export const HEADING_OFFSET = 96;
export const HERO_EXIT = 72;

export function groupHeadings(entries) {
  const groups = [];
  for (const entry of entries) {
    if (entry.depth === 3 && groups.length && !groups.at(-1).introduction) {
      groups.at(-1).children.push(entry);
    } else {
      groups.push({ ...entry, children: [] });
    }
  }
  return groups;
}

export function currentHeading(positions, line) {
  let current = positions[0]?.slug ?? null;
  for (const position of positions) {
    if (position.top <= line) current = position.slug;
  }
  return current;
}
