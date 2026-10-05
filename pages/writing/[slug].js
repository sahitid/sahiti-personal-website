import React, { useEffect, useMemo, useRef, useState } from 'react';
import Head from 'next/head';
import VroomFlow from '../../components/VroomFlow';
import VroomDetails from '../../components/VroomDetails';
import VroomEventPhotos from '../../components/VroomEventPhotos';
import CaseStudyImage from '../../components/CaseStudyImage';
import EventVideo from '../../components/EventVideo';
import Link from 'next/link';
import { motion, useAnimation } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import 'katex/dist/katex.min.css';
import { getPostSlugs, getPostBySlug } from '../../lib/writing';

const HEADER_OFFSET = 96;

function TableOfContents({ toc, activeSlug, className }) {
    const scrollTo = (event, slug) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        const el = document.getElementById(slug);
        if (!el) return;
        window.history.replaceState(window.history.state, '', `#${slug}`);
        el.tabIndex = -1;
        el.focus({ preventScroll: true });
        window.scrollTo({
            top: el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET,
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
        });
    };
    return (
        <nav className={className} aria-label="On this page">
            <ul className="essay-toc-list">
                {toc.map(item => (
                    <li key={item.slug}>
                        <a href={`#${item.slug}`} onClick={event => scrollTo(event, item.slug)}
                            aria-current={activeSlug === item.slug ? 'location' : undefined}
                            className={`essay-toc-link${item.depth === 3 ? ' essay-toc-nested' : ''}`}>
                            {item.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

function useScrollSpy(slugs) {
    const [activeSlug, setActiveSlug] = useState(slugs[0] ?? null);

    useEffect(() => {
        const onScroll = () => {
            let current = slugs[0] ?? null;
            for (const slug of slugs) {
                const el = document.getElementById(slug);
                if (el && el.getBoundingClientRect().top <= HEADER_OFFSET + 40) {
                    current = slug;
                }
            }
            setActiveSlug(current);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, [slugs]);

    return activeSlug;
}

// One fixed tooltip bubble, shared by every glossary term on the page.
// Terms are authored as <span class="gloss" data-gloss="definition">term</span>.
function useGlossBubble(bubbleRef) {
    useEffect(() => {
        const bubble = bubbleRef.current;
        if (!bubble) return;

        const canHover = window.matchMedia('(hover: hover)');
        let showTimer;
        let hideTimer;
        let openTerm = null;

        const place = (term) => {
            const rect = term.getBoundingClientRect();
            bubble.style.maxWidth = `${Math.min(280, window.innerWidth - 16)}px`;
            const width = bubble.offsetWidth;
            const height = bubble.offsetHeight;
            let left = rect.left + rect.width / 2 - width / 2;
            left = Math.max(8, Math.min(left, window.innerWidth - width - 8));
            let top = rect.top - height - 8;
            if (top < 8) top = rect.bottom + 8;
            bubble.style.left = `${Math.round(left)}px`;
            bubble.style.top = `${Math.round(top)}px`;
        };

        const show = (term) => {
            const text = term.getAttribute('data-gloss');
            if (!text) return;
            bubble.textContent = text;
            bubble.classList.add('is-visible');
            bubble.setAttribute('aria-hidden', 'false');
            place(term);
            openTerm = term;
        };

        const hide = () => {
            bubble.classList.remove('is-visible');
            bubble.setAttribute('aria-hidden', 'true');
            openTerm = null;
        };

        const onMouseOver = (e) => {
            const term = e.target.closest && e.target.closest('.gloss');
            if (!term || !canHover.matches) return;
            clearTimeout(hideTimer);
            clearTimeout(showTimer);
            showTimer = setTimeout(() => show(term), 350);
        };
        const onMouseOut = (e) => {
            if (!(e.target.closest && e.target.closest('.gloss')) || !canHover.matches) return;
            clearTimeout(showTimer);
            hideTimer = setTimeout(hide, 80);
        };
        const onClick = (e) => {
            const term = e.target.closest && e.target.closest('.gloss');
            if (canHover.matches) {
                if (!term) hide();
                return;
            }
            if (term) {
                e.preventDefault();
                openTerm === term ? hide() : show(term);
            } else {
                hide();
            }
        };
        const onKeyDown = (e) => e.key === 'Escape' && hide();
        const onScrollOrResize = () => openTerm && hide();

        document.addEventListener('mouseover', onMouseOver);
        document.addEventListener('mouseout', onMouseOut);
        document.addEventListener('click', onClick);
        document.addEventListener('keydown', onKeyDown);
        window.addEventListener('scroll', onScrollOrResize, { passive: true });
        window.addEventListener('resize', onScrollOrResize);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
            document.removeEventListener('mouseover', onMouseOver);
            document.removeEventListener('mouseout', onMouseOut);
            document.removeEventListener('click', onClick);
            document.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('scroll', onScrollOrResize);
            window.removeEventListener('resize', onScrollOrResize);
        };
    }, [bubbleRef]);
}

// Easter-egg sound for <span class="sfx-ticktock">…</span>.
// Swap public/sounds/tick-tock.wav (or this path) to change the sound.
let tickTockAudio = null;
function playTickTock() {
    try {
        tickTockAudio = tickTockAudio || new Audio('/sounds/tick-tock.wav');
        tickTockAudio.currentTime = 0;
        tickTockAudio.play().catch(() => {});
    } catch {
        // audio unavailable — stay silent
    }
}

// Captions may contain markdown links: ![alt](src "caption with [text](url)")
function renderCaption(text) {
    const parts = [];
    const re = /\[([^\]]+)\]\(([^)\s]+)\)/g;
    let last = 0;
    let m;
    while ((m = re.exec(text))) {
        if (m.index > last) parts.push(text.slice(last, m.index));
        parts.push(
            <a key={m.index} href={m[2]} target="_blank" rel="noopener noreferrer">
                {m[1]}
            </a>
        );
        last = m.index + m[0].length;
    }
    if (last < text.length) parts.push(text.slice(last));
    return parts;
}

const markdownComponents = {
    div: ({ node, children, ...props }) => {
        if (props['data-vroom-event-photos']) return <VroomEventPhotos />;
        if (props['data-vroom-details']) return <VroomDetails kind={props['data-vroom-details']} />;
        if (props['data-vroom-flow']) return <VroomFlow kind={props['data-vroom-flow']} />;
        return <div {...props}>{children}</div>;
    },
    // Hidden easter egg: looks like plain text, plays a sound if you happen to click it.
    span: ({ node, className, children, ...props }) => {
        if (className && className.includes('sfx-ticktock')) {
            return (
                <span className={className} onClick={playTickTock} {...props}>
                    {children}
                </span>
            );
        }
        return <span className={className} {...props}>{children}</span>;
    },
    a: ({ node, href = '', children, ...props }) => {
        const newTab = href && !href.startsWith('#');
        return (
            <a
                href={href}
                {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                {...props}
            >
                {children}
            </a>
        );
    },
    img: ({ node, src = '', alt = '', title, ...props }) => (
        <span className="essay-figure">
            {/\.(mp4|webm)$/i.test(src) ? (
                <EventVideo src={src} label={alt} inline />
            ) : (
                <CaseStudyImage src={src} alt={alt} loading="lazy" {...props} />
            )}
            {title && <span className="essay-figcaption">{/^Fig\. \d+\./.test(title) ? <strong>{renderCaption(title)}</strong> : renderCaption(title)}</span>}
        </span>
    ),
    table: ({ node, children, ...props }) => (
        <div className="essay-table-wrap">
            <table {...props}>{children}</table>
        </div>
    )
};

export default function WritingPost({ post, projectPage = false, caseStudy = null, children }) {
    const controls = useAnimation();
    const [isSpinning, setIsSpinning] = useState(false);
    const bubbleRef = useRef(null);

    const toc = useMemo(() => [{ slug: 'essay-top', text: caseStudy ? 'Overview' : 'Introduction', depth: 2 }, ...post.toc], [post.toc, caseStudy]);
    const tocSlugs = useMemo(() => toc.map(item => item.slug), [toc]);
    const activeSlug = useScrollSpy(tocSlugs);
    useGlossBubble(bubbleRef);

    const handleSpin = async () => {
        if (!isSpinning) {
            setIsSpinning(true);

            await controls.start({
                rotate: 360,
                transition: { duration: 1, ease: 'linear' }
            });
            controls.set({ rotate: 0 });
            setIsSpinning(false);

            window.location.href = '/';
        }
    };

    const fadeUp = {
        hidden: { opacity: 0, y: 24 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.05, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }
        })
    };

    return (
        <>
            <Head>
                <title>{`${post.title} - Sahiti Dasari`}</title>
                <meta name="description" content={post.description || post.title} />
                <meta property="og:type" content="article" key="og:type" />
                <meta property="og:title" content={`${post.title} - Sahiti Dasari`} key="og:title" />
                <meta property="og:description" content={post.description || post.title} key="og:description" />
            </Head>
            <div className={`essay-page flex flex-col relative${caseStudy ? " case-study" : ""}`}>
                {caseStudy ? <header id="essay-top" className="case-study-header">
                    <Link target="_blank" rel="noopener noreferrer" href="/projects" className="back-link"><span className="site-arrow" aria-hidden="true">←</span> Back</Link>
                    <h1>{post.title}</h1>
                    {caseStudy.subtitle && <p className="case-study-subtitle">{caseStudy.subtitle}</p>}
                    {caseStudy.dateLabel && <p className="case-study-date">{caseStudy.dateLabel}</p>}
                    {post.thumbnail && <figure className="case-study-hero-figure"><CaseStudyImage loading="eager" className="case-study-hero" src={post.thumbnail} style={caseStudy.heroAspectRatio ? { aspectRatio: caseStudy.heroAspectRatio, objectFit: 'cover', objectPosition: caseStudy.heroPosition || '50% 50%' } : undefined} alt={`${post.title} thumbnail`} fetchPriority="high" /></figure>}
                    <div className="case-study-summary">
                        <section><h2>{caseStudy.detailsLabel || 'Team'}</h2><ul>{caseStudy.team.map(name => <li key={name}>{caseStudy.teamLinks?.[name] ? <a href={caseStudy.teamLinks[name]} target="_blank" rel="noopener noreferrer">{name}</a> : name}</li>)}</ul></section>
                        <section><h2>Overview</h2><p>{caseStudy.overview}</p></section>
                    </div>
                </header> : <header id="essay-top" className="w-full mx-auto py-8">
                    <motion.div variants={fadeUp} initial={false} animate="visible" custom={0}>
                        <Link target="_blank" rel="noopener noreferrer"
                            href={projectPage ? "/projects" : "/writing"}
                            className="inline-block text-[13px] font-medium text-[#767676] hover:text-[#262626] transition-colors duration-200"
                        >
                            &larr; {projectPage ? "all projects" : "all writing"}
                        </Link>
                    </motion.div>

                    <motion.h1
                        className="mt-6 text-5xl sm:text-6xl md:text-7xl font-instrument-serif italic font-normal text-left text-[#262626] leading-[1.05]"
                        variants={fadeUp}
                        initial={false}
                        animate="visible"
                        custom={1}
                    >
                        {post.title}
                    </motion.h1>

                    {post.description && (
                        <motion.p
                            className="mt-5 text-[15px] sm:text-base text-[#262626] leading-[1.6] max-w-2xl"
                            variants={fadeUp}
                            initial={false}
                            animate="visible"
                            custom={2}
                        >
                            {post.description}
                        </motion.p>
                    )}

                    <motion.p
                        className="mt-5 text-[11px] font-semibold tracking-[0.08em] uppercase text-[#767676]"
                        variants={fadeUp}
                        initial={false}
                        animate="visible"
                        custom={3}
                    >
                        {post.date} &middot; {post.readingTime} min read
                    </motion.p>
                </header>}

                <motion.main
                    className="essay-layout w-full mx-auto mb-20"
                    variants={fadeUp}
                    initial={false}
                    animate="visible"
                    custom={4}
                >
                    {post.toc.length > 0 && (
                        <>
                            <aside className="essay-sidebar">
                                <TableOfContents toc={toc} activeSlug={activeSlug} className="essay-toc" />
                            </aside>
                        </>
                    )}

                    <article className="essay-prose min-w-0 max-w-2xl mx-auto">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeRaw, rehypeSlug, rehypeKatex, rehypeHighlight]}
                            components={markdownComponents}
                        >
                            {post.content}
                        </ReactMarkdown>
                        {children}


                    </article>
                </motion.main>


            </div>

            <div ref={bubbleRef} className="gloss-bubble" role="tooltip" aria-hidden="true" />
        </>
    );
}

export async function getStaticPaths() {
    return {
        paths: getPostSlugs()
            .filter((slug) => !getPostBySlug(slug).draft)
            .map((slug) => ({ params: { slug } })),
        fallback: false
    };
}

export async function getStaticProps({ params }) {
    return { props: { post: getPostBySlug(params.slug) } };
}
