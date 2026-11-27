import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import GithubSlugger from 'github-slugger';
import { currentHeading, groupHeadings, HEADING_OFFSET, HERO_EXIT, READING_LINE } from '../lib/article-contents.mjs';
import styles from './ArticleContents.module.css';

/** Read the rendered article so Markdown, embedded HTML, and JSX share one outline. */
export default function ArticleContents({ articleRef, heroRef, introductionLabel = 'Introduction' }) {
  const [entries, setEntries] = useState([]);
  const [activeSlug, setActiveSlug] = useState(null);
  const [expanded, setExpanded] = useState(new Set());
  const [visible, setVisible] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const rootRef = useRef(null);
  const navRef = useRef(null);
  const toggleRef = useRef(null);
  const markerRef = useRef(null);
  const pendingAnchor = useRef(null);
  const links = useRef(new Map());
  const panelId = useId();
  const groups = useMemo(() => groupHeadings(entries), [entries]);
  const activeGroup = groups.find(group => group.slug === activeSlug || group.children.some(child => child.slug === activeSlug));
  const markerSlug = activeGroup && !expanded.has(activeGroup.slug) ? activeGroup.slug : activeSlug;

  useEffect(() => {
    const article = articleRef.current;
    const hero = heroRef.current;
    if (!article || !hero) return;

    // rehype-slug already supplies Markdown IDs. Preserve those and any authored
    // anchors; only create collision-free IDs for otherwise unlabelled headings.
    const slugger = new GithubSlugger();
    const usedIds = new Set(Array.from(document.querySelectorAll('[id]'), node => node.id));
    const headings = Array.from(article.querySelectorAll('h2, h3'))
      .filter(heading => heading.textContent.trim() && !heading.closest('[data-footnotes], [data-toc-ignore]'));
    const outline = headings.map(heading => {
      if (!heading.id) {
        let slug;
        do { slug = slugger.slug(heading.textContent.trim()) || slugger.slug('section'); } while (usedIds.has(slug));
        heading.id = slug;
        usedIds.add(slug);
      }
      return { slug: heading.id, text: heading.textContent.trim(), depth: Number(heading.tagName[1]) };
    });
    if (!outline.length) return;
    const introduction = { slug: hero.id, text: introductionLabel, depth: 2, introduction: true };
    setEntries([introduction, ...outline]);

    let frame = 0;
    let settleTimer;
    const alignAnchor = () => {
      const anchor = pendingAnchor.current;
      if (!anchor) return;
      if (performance.now() > anchor.until) { pendingAnchor.current = null; return; }
      anchor.settled = true;
      const offset = anchor.target.getBoundingClientRect().top - HEADING_OFFSET;
      if (Math.abs(offset) > 1) window.scrollBy({ top: offset, behavior: 'instant' });
    };
    const cancelAnchor = () => { pendingAnchor.current = null; clearTimeout(settleTimer); };
    const update = () => {
      frame = 0;
      const reading = hero.getBoundingClientRect().bottom <= HERO_EXIT && article.getBoundingClientRect().bottom > HEADING_OFFSET;
      setVisible(reading);
      if (!reading) setMobileOpen(false);
      setActiveSlug(currentHeading([hero, ...headings].map(heading => ({
        slug: heading.id, top: heading.getBoundingClientRect().top,
      })), window.innerHeight * READING_LINE));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const onScroll = () => {
      schedule();
      // A long jump can load images above its destination. Correct the final
      // offset after scrolling settles, then follow late image layout changes.
      if (pendingAnchor.current && !pendingAnchor.current.settled) {
        clearTimeout(settleTimer);
        settleTimer = setTimeout(alignAnchor, 120);
      }
    };
    const resize = new ResizeObserver(() => {
      if (pendingAnchor.current?.settled) alignAnchor();
      schedule();
    });
    resize.observe(article);
    resize.observe(hero);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('scrollend', alignAnchor);
    window.addEventListener('resize', schedule);
    for (const type of ['wheel', 'touchstart', 'pointerdown', 'keydown']) window.addEventListener(type, cancelAnchor, { passive: true });
    update();
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(settleTimer);
      resize.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('scrollend', alignAnchor);
      window.removeEventListener('resize', schedule);
      for (const type of ['wheel', 'touchstart', 'pointerdown', 'keydown']) window.removeEventListener(type, cancelAnchor);
    };
  }, [articleRef, heroRef, introductionLabel]);

  // Auto-open only when entering a different chapter; manual collapse remains
  // respected while the reader stays in that chapter.
  useEffect(() => {
    setExpanded(new Set(activeGroup ? [activeGroup.slug] : []));
  }, [activeGroup?.slug]);

  useEffect(() => {
    const nav = navRef.current;
    const link = links.current.get(markerSlug);
    const marker = markerRef.current;
    if (!nav || !link || !marker) return;
    let frame;
    const place = () => {
      const rect = link.getBoundingClientRect();
      const bounds = nav.getBoundingClientRect();
      marker.style.setProperty('--marker-y', `${rect.top - bounds.top + nav.scrollTop + rect.height / 2 - marker.offsetHeight / 2}px`);
      marker.style.opacity = '1';
    };
    // Keep the selected row inside a long outline without scrolling the article.
    const keepInView = () => {
      const rect = link.getBoundingClientRect();
      const bounds = nav.getBoundingClientRect();
      if (nav.clientHeight && (rect.top < bounds.top + 28 || rect.bottom > bounds.bottom - 28)) {
        nav.scrollTop += rect.top - bounds.top - nav.clientHeight / 3;
      }
    };
    const resize = new ResizeObserver(() => { keepInView(); place(); });
    resize.observe(nav.firstElementChild);
    nav.addEventListener('scroll', place, { passive: true });
    place();
    frame = requestAnimationFrame(() => {
      keepInView();
      place();
    });
    return () => { cancelAnimationFrame(frame); resize.disconnect(); nav.removeEventListener('scroll', place); };
  }, [markerSlug, expanded, visible, mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const dismiss = event => {
      if (event.type === 'keydown') {
        if (event.key !== 'Escape') return;
        toggleRef.current?.focus();
      } else if (rootRef.current?.contains(event.target)) return;
      setMobileOpen(false);
    };
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('focusin', dismiss);
    document.addEventListener('keydown', dismiss);
    const desktop = window.matchMedia('(min-width: 1000px)');
    const closeOnDesktop = () => { if (desktop.matches) setMobileOpen(false); };
    desktop.addEventListener('change', closeOnDesktop);
    return () => {
      document.removeEventListener('pointerdown', dismiss);
      document.removeEventListener('focusin', dismiss);
      document.removeEventListener('keydown', dismiss);
      desktop.removeEventListener('change', closeOnDesktop);
    };
  }, [mobileOpen]);

  const navigate = (event, slug) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    const target = document.getElementById(slug);
    if (!target) return;
    event.preventDefault();
    window.history.replaceState(window.history.state, '', `#${encodeURIComponent(slug)}`);
    target.tabIndex = -1;
    target.focus({ preventScroll: true });
    setMobileOpen(false);
    pendingAnchor.current = { target, until: performance.now() + 3000, settled: false };
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - HEADING_OFFSET,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  };

  const link = (entry, hidden = false) => (
    <a ref={node => { if (node) links.current.set(entry.slug, node); else links.current.delete(entry.slug); }}
      className={`${styles.link}${entry.slug === markerSlug ? ` ${styles.selected}` : ''}`}
      href={`#${encodeURIComponent(entry.slug)}`} onClick={event => navigate(event, entry.slug)}
      aria-current={entry.slug === activeSlug ? 'location' : undefined} tabIndex={hidden ? -1 : undefined}>
      {entry.text}
    </a>
  );

  if (!entries.length) return null;
  // A portal keeps fixed positioning independent of page entrance transforms.
  return createPortal(
    <div ref={rootRef} className={`${styles.shell}${visible ? ` ${styles.revealed}` : ''}${mobileOpen ? ` ${styles.mobileOpen}` : ''}`}>
      <button ref={toggleRef} className={styles.mobileToggle} type="button" aria-expanded={mobileOpen}
        aria-controls={panelId} onClick={() => setMobileOpen(open => !open)}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 4h12M2 8h12M2 12h8" stroke="currentColor" strokeWidth="1.2" /></svg>
        Contents
        <span className={styles.mobileChevron} aria-hidden="true">⌄</span>
      </button>
      <nav ref={navRef} id={panelId} className={styles.nav} aria-label="Table of contents">
        <ul className={styles.list}>
          {groups.map((group, index) => {
            const open = expanded.has(group.slug);
            const subId = `${panelId}-${index}`;
            return <li className={styles.chapter} key={group.slug}>
              <div className={styles.row}>
                {group.children.length > 0 && <button type="button" className={styles.expand}
                  aria-label={`${open ? 'Collapse' : 'Expand'} ${group.text}`} aria-expanded={open} aria-controls={subId}
                  onClick={() => setExpanded(previous => { const next = new Set(previous); next.has(group.slug) ? next.delete(group.slug) : next.add(group.slug); return next; })}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true"><path d="m3.5 2 3 3-3 3" stroke="currentColor" strokeWidth="1.2" /></svg>
                </button>}
                {link(group)}
              </div>
              {group.children.length > 0 && <div className={`${styles.children}${open ? ` ${styles.childrenOpen}` : ''}`} aria-hidden={!open} id={subId}>
                <div className={styles.childrenClip}><ul className={styles.subList}>
                  {group.children.map(child => <li key={child.slug}>{link(child, !open)}</li>)}
                </ul></div>
              </div>}
            </li>;
          })}
        </ul>
        <span ref={markerRef} className={styles.marker} aria-hidden="true" />
      </nav>
    </div>, document.body,
  );
}
