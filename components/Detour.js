import { useState } from 'react';
import Link from 'next/link';
const stops = [
  { label: 'a day worth going outside for', title: 'Adult Field Day', href: '/projects/adult-field-day', text: 'Water balloons, a giant parachute, and permission to be a kid again.' },
  { label: 'something to get lost in', title: 'The photo archive', href: '/photos', text: 'Small moments, collected on my Kodak. Take a look around.' },
  { label: 'a thought to take with you', title: 'A few words', href: '/writing', text: 'Essays on figuring things out, paying attention, and being human.' },
  { label: 'a little thing I made', title: 'Selected projects', href: '/projects', text: 'Experiments in making technology feel a little more human.' },
];
export default function Detour() {
 const [stop,setStop]=useState(-1);
 return <section className="detour" aria-label="Take a little detour"><div className="detour-top"><span className="eyebrow">take the scenic route</span><span className="detour-count">{stop < 0 ? '01 — 04' : `0${stop+1} / 04`}</span></div><div className="water"><svg viewBox="0 0 600 90" preserveAspectRatio="none" aria-hidden="true"><path d="M0 50 Q75 25 150 50 T300 50 T450 50 T600 50 M0 62 Q75 37 150 62 T300 62 T450 62 T600 62" /></svg><button className="sailing-boat" style={{left:`${stop<0 ? 12 : 18+stop*21}%`}} onClick={()=>setStop((stop+1)%stops.length)} aria-label="Sail to the next detour"><svg viewBox="0 0 80 70" aria-hidden="true"><path d="M9 48 H72 L59 62 H23 Z M39 5 L13 42 H39 Z M44 16 L65 42 H44 Z" fill="currentColor"/><path d="M40 3V49" stroke="currentColor" strokeWidth="2"/></svg></button></div><div className="detour-bottom" aria-live="polite">{stop<0 ? <><p>a little exploring?</p><button className="text-link" onClick={()=>setStop(0)}>take a detour <span className="site-arrow" aria-hidden="true">↗</span></button></> : <div key={stop} className="detour-discovery"><span className="eyebrow">{stops[stop].label}</span><Link target="_blank" rel="noopener noreferrer" href={stops[stop].href}>{stops[stop].title} <span className="site-arrow" aria-hidden="true">↗</span></Link><p>{stops[stop].text}</p><button className="text-link" onClick={()=>setStop((stop+1)%stops.length)}>sail somewhere else <span className="site-arrow" aria-hidden="true">→</span></button></div>}</div></section>;
}
