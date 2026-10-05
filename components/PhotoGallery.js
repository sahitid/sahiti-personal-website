import Image from 'next/image';
import EventVideo from './EventVideo';
import { flushSync } from 'react-dom';
import { useRef, useState, useEffect } from 'react';
export default function PhotoGallery({photos, label='Photo archive', className='', visibleCount=photos.length, videos=[]}){
 const items = photos.slice(0, visibleCount).map((src, index) => ({ src, index, type: 'photo' }));
 if (videos.length) {
  const photoItems = [...items];
  items.length = 0;
  const groups = Math.max(photoItems.length, 1);
  for (let i = 0; i < groups; i++) {
   if (photoItems[i]) items.push(photoItems[i]);
   videos.slice(Math.floor(i * videos.length / groups), Math.floor((i + 1) * videos.length / groups)).forEach(src => items.push({ src, type: 'video' }));
  }
 }
 const gallery=useRef(null);
 const imageRequest=useRef(0);
 const requestedIndex=useRef(0);
 const [selected,setSelected]=useState(0);const dialog=useRef(null);const trigger=useRef(null);
 useEffect(()=>{const d=dialog.current;function unlock(){imageRequest.current++;document.body.style.overflow='';trigger.current?.focus({preventScroll:true});}d.addEventListener('close',unlock);return()=>{d.removeEventListener('close',unlock);document.body.style.overflow='';};},[]);
 useEffect(() => {
  if (!className.includes('personal-photos')) return;
  const grid = gallery.current;
  let frame;
  const layout = () => {
   cancelAnimationFrame(frame);
   frame = requestAnimationFrame(() => {
    const styles = getComputedStyle(grid);
    const gap = parseFloat(styles.columnGap);
    const columns = styles.gridTemplateColumns.split(' ').length;
    const heights = Array.from({ length: columns }, (_, i) => i === 1 ? gap * 2 : 0);
    [...grid.children].forEach((item, index) => {
     const column = index % columns;
     const itemStyles = getComputedStyle(item);
     const height = item.querySelector('img').offsetHeight + parseFloat(itemStyles.paddingTop) + parseFloat(itemStyles.paddingBottom);
     item.style.gridColumn = String(column + 1);
     item.style.gridRow = `${heights[column] + 1} / span ${Math.max(1, height)}`;
     heights[column] += Math.max(1, height) + gap;
    });
   });
  };
  const observer = new ResizeObserver(layout);
  observer.observe(grid);
  grid.querySelectorAll('img').forEach(img => observer.observe(img));
  layout();
  return () => { observer.disconnect(); cancelAnimationFrame(frame); };
 }, [photos, className, visibleCount]);
 async function showPhoto(i, opening=false){
  requestedIndex.current=i;
  const request=++imageRequest.current;
  const image=new window.Image();
  image.src=photos[i];
  try { await image.decode(); } catch { return; }
  if(request!==imageRequest.current || !dialog.current) return;
  // Commit the decoded image before exposing the dialog to avoid flashing the old photo.
  flushSync(()=>setSelected(i));
  if(opening){dialog.current.showModal();document.body.style.overflow='hidden';}
 }
 function open(i,e){trigger.current=e.currentTarget;showPhoto(i,true);}
 function move(step){showPhoto((requestedIndex.current+step+photos.length)%photos.length);}
 return <><div ref={gallery} className={`photo-gallery ${className}`}>{items.map(({src,index:i,type})=>type === 'video' ? <EventVideo key={src} src={src} label={`${label}, video ${videos.indexOf(src) + 1}`} /> : <button key={src} onClick={e=>open(i,e)} aria-label={`Open ${label}, photo ${i+1}`}>{src.startsWith('/') ? <Image src={src} alt={`${label}, photograph ${i+1}`} width={800} height={1000} sizes="(max-width: 600px) 44vw, 300px" style={{width:'100%',height:'auto'}}/> : <img src={src} alt={`${label}, photograph ${i+1}`} loading="lazy"/>}<span>{String(i+1).padStart(2,'0')}</span></button>)}</div><dialog ref={dialog} className="photo-dialog" aria-label={label} onClick={e=>{if(e.target===e.currentTarget)dialog.current.close();}} onKeyDown={e=>{if(e.key==='ArrowRight')move(1);if(e.key==='ArrowLeft')move(-1);}}><button className="dialog-close" onClick={()=>dialog.current.close()} aria-label="Close photo">×</button><img key={photos[selected]} src={photos[selected]} alt={`${label}, photograph ${selected+1}`}/></dialog></>;
}
