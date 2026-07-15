import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
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
        event.preventDefault();
        const el = document.getElementById(slug);
        if (el) {
            window.scrollTo({
                top: el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET + 8,
                behavior: 'smooth'
            });
        }
    };

    return (
        <nav className={className} aria-label="Table of contents">
            <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#e8321eaa] mb-3">
                Contents
            </p>
            <ul className="flex flex-col">
                {toc.map((item) => (
                    <li key={item.slug}>
                        <a
                            href={`#${item.slug}`}
                            onClick={(e) => scrollTo(e, item.slug)}
                            className={`toc-item block border-l-2 py-1 text-[13px] leading-snug transition-colors duration-200 ${
                                item.depth === 3 ? 'pl-6' : 'pl-3'
                            } ${
                                activeSlug === item.slug
                                    ? 'border-[#e8321e] text-[#e8321e] font-semibold'
                                    : 'border-[#e8b4b466] text-[#1a0a0aa6] hover:text-[#1a0a0a]'
                            }`}
                        >
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

const markdownComponents = {
    a: ({ node, href = '', children, ...props }) => {
        const external = /^https?:\/\//.test(href);
        return (
            <a
                href={href}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                {...props}
            >
                {children}
            </a>
        );
    },
    img: ({ node, src = '', alt = '', title, ...props }) => (
        <span className="essay-figure">
            {/\.(mp4|webm)$/i.test(src) ? (
                <video src={src} autoPlay loop muted playsInline aria-label={alt} />
            ) : (
                <img src={src} alt={alt} loading="lazy" {...props} />
            )}
            {title && <span className="essay-figcaption">{title}</span>}
        </span>
    ),
    table: ({ node, children, ...props }) => (
        <div className="essay-table-wrap">
            <table {...props}>{children}</table>
        </div>
    )
};

export default function WritingPost({ post }) {
    const controls = useAnimation();
    const [isSpinning, setIsSpinning] = useState(false);
    const bubbleRef = useRef(null);

    const tocSlugs = post.toc.map((item) => item.slug);
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
            <div className="w-screen min-h-screen text-[#e8321e] bg-[#fce8e8] flex flex-col relative font-instrument-sans px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48">
                <header className="w-full max-w-4xl mx-auto px-4 py-8">
                    <div className="flex absolute left-0 top-0 m-4 sm:m-8 md:m-16">
                        <motion.img
                            src="/boat.svg"
                            alt="Boat"
                            className="h-6 mr-2 cursor-pointer"
                            animate={controls}
                            onClick={handleSpin}
                        />
                    </div>

                    <nav className="absolute right-0 top-0 m-4 sm:m-8 md:m-16 flex flex-row flex-wrap justify-end gap-x-4 gap-y-1 sm:flex-col sm:gap-x-0 sm:gap-y-2 text-[#e8321e] font-instrument-serif italic font-normal text-base sm:text-2xl tracking-normal">
                        <a href="/" className="nav-link transition-transform duration-300 hover:scale-105">/home</a>
                        <a href="/projects" className="nav-link transition-transform duration-300 hover:scale-105">/projects</a>
                        <a href="/writing" className="nav-link transition-transform duration-300 hover:scale-105">/writing</a>
                        <a href="/photos" className="nav-link transition-transform duration-300 hover:scale-105">/photos</a>
                    </nav>

                    <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
                        <Link
                            href="/writing"
                            className="inline-block mt-16 sm:mt-24 md:mt-32 text-[13px] font-medium text-[#e8321eaa] hover:text-[#e8321e] transition-colors duration-200"
                        >
                            &larr; all writing
                        </Link>
                    </motion.div>

                    <motion.h1
                        className="mt-6 text-5xl sm:text-6xl md:text-7xl font-instrument-serif italic font-normal text-left text-[#e8321e] leading-[1.05]"
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={1}
                    >
                        {post.title}
                    </motion.h1>

                    {post.description && (
                        <motion.p
                            className="mt-5 text-[15px] sm:text-base text-[#1a0a0a] leading-[1.6] max-w-2xl"
                            variants={fadeUp}
                            initial="hidden"
                            animate="visible"
                            custom={2}
                        >
                            {post.description}
                        </motion.p>
                    )}

                    <motion.p
                        className="mt-5 text-[11px] font-semibold tracking-[0.08em] uppercase text-[#e8321eaa]"
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={3}
                    >
                        {post.date} &middot; {post.readingTime} min read
                    </motion.p>
                </header>

                <motion.main
                    className="w-full max-w-4xl mx-auto px-4 mb-20 md:grid md:grid-cols-[170px_minmax(0,1fr)] md:gap-10 lg:grid-cols-[190px_minmax(0,1fr)] lg:gap-12"
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={4}
                >
                    {post.toc.length > 0 ? (
                        <>
                            <TableOfContents
                                toc={post.toc}
                                activeSlug={activeSlug}
                                className="mb-10 md:hidden"
                            />
                            <div className="hidden md:block">
                                <TableOfContents
                                    toc={post.toc}
                                    activeSlug={activeSlug}
                                    className="sticky top-24"
                                />
                            </div>
                        </>
                    ) : (
                        <div className="hidden md:block" />
                    )}

                    <article className="essay-prose min-w-0 max-w-2xl">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeRaw, rehypeSlug, rehypeKatex, rehypeHighlight]}
                            components={markdownComponents}
                        >
                            {post.content}
                        </ReactMarkdown>

                        <div className="mt-16 pt-8 border-t border-[#e8b4b466]">
                            <p className="font-instrument-serif italic text-2xl text-[#e8321e] mb-2">
                                enjoyed this?
                            </p>
                            <p className="text-[14px] text-[#1a0a0a] leading-[1.6] mb-5 max-w-lg">
                                New essays land on my{' '}
                                <a
                                    href="https://sahitid.substack.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#e8321e] underline decoration-[#e8321e66] hover:decoration-[#e8321e] underline-offset-2 transition-colors duration-200"
                                >
                                    Substack
                                </a>{' '}
                                first &mdash; subscribe to get them by email.
                            </p>
                            <div className="flex items-center space-x-4">
                                <a href="https://www.linkedin.com/in/sahitidasari/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile">
                                    <img src="/linkedin.svg" alt="LinkedIn Icon" className="h-5 transition-transform duration-300 hover:scale-110" />
                                </a>
                                <a href="https://x.com/sahitid_" target="_blank" rel="noopener noreferrer" aria-label="X/Twitter Profile">
                                    <img src="/twitter.svg" alt="Twitter Icon" className="h-5 transition-transform duration-300 hover:scale-110" />
                                </a>
                                <a href="https://github.com/sahitid" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile">
                                    <img src="/github.svg" alt="GitHub Icon" className="h-5 transition-transform duration-300 hover:scale-110" />
                                </a>
                                <a href="https://substack.com/@sahitid" target="_blank" rel="noopener noreferrer" aria-label="Substack">
                                    <img src="/substack.svg" alt="Substack Icon" className="h-5 transition-transform duration-300 hover:scale-110" />
                                </a>
                                <a href="mailto:sahitid@wharton.upenn.edu" aria-label="Email">
                                    <img src="/mail.svg" alt="Mail Icon" className="h-5 transition-transform duration-300 hover:scale-110" />
                                </a>
                            </div>
                        </div>
                    </article>
                </motion.main>

                <footer className="w-full max-w-4xl mx-auto px-4 py-4 text-[#e8321e] bg-[#fce8e8] flex flex-col justify-center items-start mt-10">
                    <div className="w-full border-t-3 border-[#e8321e] mb-4"></div>
                    <p className="text-xs font-medium italic">
                        omnia iam fiunt quae posse negabam
                    </p>
                </footer>
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
