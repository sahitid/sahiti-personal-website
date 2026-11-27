import test from 'node:test';
import assert from 'node:assert/strict';
import { currentHeading, groupHeadings } from '../lib/article-contents.mjs';

test('subsections stay with their chapter; overview remains independent', () => {
  const entries = [
    { slug: 'top', depth: 2, introduction: true },
    { slug: 'first-subheading', depth: 3 },
    { slug: 'chapter', depth: 2 },
    { slug: 'part-a', depth: 3 },
    { slug: 'part-b', depth: 3 },
    { slug: 'end', depth: 2 },
  ];
  const groups = groupHeadings(entries);
  assert.deepEqual(groups.map(group => [group.slug, group.children.map(child => child.slug)]), [
    ['top', []], ['first-subheading', []], ['chapter', ['part-a', 'part-b']], ['end', []],
  ]);
  assert.equal(entries[2].children, undefined, 'does not mutate shared article data');
});

test('a heading activates exactly at the reading line, including on reverse scroll', () => {
  const positions = [{ slug: 'intro', top: -600 }, { slug: 'chapter', top: -50 }, { slug: 'child', top: 216 }];
  assert.equal(currentHeading(positions, 215), 'chapter');
  assert.equal(currentHeading(positions, 216), 'child');
  assert.equal(currentHeading(positions, 0), 'chapter');
});

test('before any chapter begins, the introduction remains active', () => {
  assert.equal(currentHeading([{ slug: 'intro', top: 300 }, { slug: 'chapter', top: 800 }], 216), 'intro');
  assert.equal(currentHeading([], 216), null);
  assert.deepEqual(groupHeadings([]), []);
});
