import Head from 'next/head';
import { useState } from 'react';
import options from '../../data/vroom-media-options.json';

export default function VroomMedia() {
  const [selected, setSelected] = useState([]);
  const [copied, setCopied] = useState(false);
  const toggle = id => { setCopied(false); setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]); };
  const request = `Add Vroom media options ${selected.join(', ')} near the top of the project page.`;
  return <main className="media-picker">
    <Head><title>Choose Vroom media</title><meta name="robots" content="noindex,nofollow" /></Head>
    <h1>More from Vroom</h1>
    <p>Original assets recovered from the repositories. Select what you like, then send me the numbers. Nothing here has been added to the writeup.</p>
    <div className="selection"><strong>{selected.length ? `Selected: ${selected.join(', ')}` : 'Choose images or videos below'}</strong><button disabled={!selected.length} onClick={async () => {try {await navigator.clipboard.writeText(request);setCopied(true);}catch {setCopied(false);}}}>{copied ? 'Copied — paste in chat' : 'Copy selection'}</button></div>
    <div className="options">{options.map(item => <article key={item.id}>
      {item.type === 'video' ? <video src={item.src} muted loop playsInline controls preload="metadata" /> : <a href={item.src} target="_blank" rel="noreferrer"><img src={item.src} alt={item.title} loading="lazy" /></a>}
      <label><input type="checkbox" checked={selected.includes(item.id)} onChange={() => toggle(item.id)} />{item.id}. {item.title}</label><small>{item.source}</small>
    </article>)}</div>
    <style jsx>{`
      .media-picker{padding:32px 0 60px}h1{font:italic 44px 'Instrument Serif',serif;margin:0 0 16px}p{font-size:14px;line-height:1.7;color:#777}.selection{position:sticky;top:0;background:#fff9d9;padding:16px;z-index:2;border-radius:8px;margin:24px 0;display:flex;justify-content:space-between;gap:12px;align-items:center;font-size:13px}button{border:1px solid #ccc;border-radius:5px;padding:8px;background:white;cursor:pointer}button:disabled{opacity:.5}.options{display:grid;grid-template-columns:1fr 1fr;gap:28px 20px}article{min-width:0}img,video{width:100%;height:210px;object-fit:contain;background:#f5f5f3;border-radius:8px}label{display:flex;gap:8px;margin-top:12px;font-size:14px;cursor:pointer}input{accent-color:#333}small{display:block;overflow-wrap:anywhere;font-size:10px;color:#888;margin:6px 0 0 21px}@media(max-width:500px){.options{grid-template-columns:1fr}.selection{flex-direction:column;align-items:flex-start}}
    `}</style>
  </main>;
}
export function getServerSideProps() {
  return process.env.NODE_ENV === 'development' ? {props:{}} : {notFound:true};
}
