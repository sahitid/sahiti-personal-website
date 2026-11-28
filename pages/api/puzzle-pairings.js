import { readFile, writeFile, rename, unlink } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { pairNote, storyById } from '../../lib/puzzle-stories';
import { allowLocalPuzzleEdit } from '../../lib/local-puzzle-editor';

export const config = { api: { bodyParser: { sizeLimit: '2kb' } } };

export default async function handler(req, res) {
  if (!allowLocalPuzzleEdit(req, res)) return;
  const { piece, storyId } = req.body || {};
  if (!Number.isInteger(piece) || piece < 0 || piece >= 35 || !Object.hasOwn(storyById, storyId)) return res.status(400).json({ error: 'Choose a piece and a note.' });
  const filename = path.join(process.cwd(), 'lib', 'puzzle-pairings.json');
  const temporary = `${filename}.${randomUUID()}.tmp`;
  try {
    const current = JSON.parse(await readFile(filename, 'utf8'));
    const pairings = pairNote(current, piece, storyId);
    await writeFile(temporary, `${JSON.stringify(pairings, null, 2)}\n`, 'utf8');
    await rename(temporary, filename);
    res.status(200).json({ pairings });
  } catch {
    await unlink(temporary).catch(() => {});
    res.status(500).json({ error: 'The pairing could not be saved. Please try again.' });
  }
}
