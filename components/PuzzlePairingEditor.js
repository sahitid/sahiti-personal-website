import { useEffect, useId, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { puzzleStories, storyById } from '../lib/puzzle-stories';
import { referencePieces } from '../lib/reference-puzzle';
import controls from './PuzzleEditorControls.module.css';
import styles from './PuzzlePairingEditor.module.css';

function PairingDialog({ pieceIndex, pairings, frontId, onSave, onClose }) {
  const id = useId().replace(/:/g, '');
  const dialog = useRef(null);
  const [selected, setSelected] = useState(pairings[pieceIndex] || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const { box } = referencePieces[pieceIndex];
  const elsewhere = Object.keys(pairings).find(piece => pairings[piece] === selected && Number(piece) !== pieceIndex);
  useEffect(() => { dialog.current.showModal(); }, []);

  async function save() {
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/puzzle-pairings', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ piece: pieceIndex, storyId: selected }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'The pairing could not be saved.');
      onSave(result.pairings);
    } catch (failure) {
      setError(failure.message || 'The pairing could not be saved.');
    } finally {
      setBusy(false);
    }
  }

  return <dialog ref={dialog} className={controls.dialog} aria-labelledby={`${id}-title`} onCancel={event => { event.preventDefault(); if (!busy) onClose(); }}>
    <header className={controls.header}>
      <div><h2 id={`${id}-title`}>Pair this piece</h2><p>Choose the note you want to find on the back.</p></div>
      <button type="button" className={controls.close} aria-label="Cancel pairing" onClick={onClose} disabled={busy}>×</button>
    </header>
    <svg className={styles.preview} viewBox={`${box.x - 5} ${box.y - 5} ${box.width + 10} ${box.height + 10}`} aria-label={`Selected puzzle piece ${pieceIndex + 1}`} role="img">
      <use href={`#${frontId}`} />
    </svg>
    <label className={styles.label} htmlFor={`${id}-note`}>Note</label>
    <select id={`${id}-note`} className={styles.select} value={selected} disabled={busy} onChange={event => { setSelected(event.target.value); setError(''); }}>
      <option value="" disabled>Choose a note…</option>
      {puzzleStories.map(story => <option key={story.id} value={story.id}>{story.number}. {story.title}</option>)}
    </select>
    {selected && <p className={styles.statement}>{storyById[selected].statement}</p>}
    {elsewhere !== undefined && <p className={styles.swap}>{pairings[pieceIndex] ? 'These two notes will swap places.' : 'This note will move here from its current piece.'}</p>}
    {error && <p className={controls.error} role="alert">{error}</p>}
    <footer className={controls.actions}>
      <span className={styles.spacer} />
      <button type="button" className={controls.cancel} disabled={busy} onClick={onClose}>Cancel</button>
      <button type="button" className={controls.save} disabled={!selected || busy} onClick={save}>{busy ? 'Saving…' : 'Save pairing'}</button>
    </footer>
  </dialog>;
}

export default function PuzzlePairingEditor({ pieceIndex, pairings, frontId, onSave, onClose }) {
  const router = useRouter();
  const [notice, setNotice] = useState('Click a piece to choose its note');
  return <>
    <div className={styles.toolbar}>
      <span role="status">{notice}</span>
      <button type="button" onClick={() => router.push('/about')}>Done</button>
    </div>
    {pieceIndex !== null && <PairingDialog key={pieceIndex} pieceIndex={pieceIndex} pairings={pairings} frontId={frontId}
      onSave={next => { onSave(next); setNotice('Saved. Choose another piece.'); }} onClose={onClose} />}
  </>;
}
