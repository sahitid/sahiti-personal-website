import NotePopup from './NotePopup';

export default function StudentPopover() {
  return <NotePopup label="student" icon={<span className="student-brand-pair" aria-hidden="true"><span className="inline-penn-shield"><img src="/images/previews/penn-shield.png" alt="" /></span><span className="inline-brand-mt"><img src="/images/previews/mt-inline.png" alt="" /></span></span>} title="currently studying" className="student-trigger">
    <p>Studying Computer Science & Wharton at University of Pennsylvania in the <a href="https://fisher.wharton.upenn.edu/" target="_blank" rel="noopener noreferrer">Jerome Fisher Management & Technology (M&T)</a> program.</p>
  </NotePopup>;
}
