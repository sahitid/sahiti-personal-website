import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion, useAnimation } from 'framer-motion';
import { getAllPosts } from '../../lib/writing';

export default function Writing({ posts }) {
    const controls = useAnimation();
    const [isSpinning, setIsSpinning] = useState(false);

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
                <title>Writing - Sahiti Dasari</title>
                <meta name="description" content="Essays and writing by Sahiti Dasari" />
            </Head>
            <div className="w-screen overflow-x-hidden min-h-screen text-[#e8321e] bg-[#fce8e8] flex flex-col relative font-instrument-sans px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48">
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
                        <span className="nav-link opacity-50 cursor-not-allowed">/writing</span>
                        <a href="/photos" className="nav-link transition-transform duration-300 hover:scale-105">/photos</a>
                    </nav>

                    <motion.h1
                        className="mt-16 sm:mt-24 md:mt-36 text-7xl sm:text-8xl md:text-[96px] font-instrument-serif italic font-normal mb-4 text-left text-[#e8321e]"
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={0}
                    >
                        writing
                    </motion.h1>
                    <motion.p
                        className="text-sm sm:text-base md:text-lg mb-6 text-left text-[#2F0000] tracking-normal"
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={1}
                    >
                        Find my substack at{' '}
                        <a
                            href="https://sahitid.substack.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#e8321e] underline decoration-[#e8321e66] hover:decoration-[#e8321e] underline-offset-2 transition-colors duration-200"
                        >
                            sahitid.substack.com
                        </a>
                        .
                    </motion.p>
                </header>

                <main className="w-full max-w-4xl mx-auto px-4 flex flex-col mb-20">
                    <section className="flex flex-col">
                        {posts.map((post, index) => (
                            <motion.div
                                key={post.slug}
                                className="group border-b border-[#e8b4b466] py-8 first:pt-2"
                                variants={fadeUp}
                                initial="hidden"
                                animate="visible"
                                custom={index + 2}
                            >
                                <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#e8321eaa] mb-2">
                                    {post.date} &middot; {post.readingTime} min read
                                </p>
                                <h2 className="text-3xl sm:text-4xl font-instrument-serif italic font-normal leading-tight mb-2 transition-all duration-300 group-hover:translate-x-1.5">
                                    <Link href={`/writing/${post.slug}`} className="inline-flex items-baseline gap-2 text-[#e8321e]">
                                        {post.title}
                                        <img src="/arrow.svg" alt="" className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 transition-opacity duration-300 self-center" />
                                    </Link>
                                </h2>
                                {post.description && (
                                    <p className="text-[14px] font-normal text-[#1a0a0a] leading-[1.6] tracking-[0.01em] max-w-2xl">
                                        {post.description}
                                    </p>
                                )}
                            </motion.div>
                        ))}

                    </section>
                </main>

                <footer className="w-full max-w-4xl mx-auto px-4 py-4 text-[#e8321e] bg-[#fce8e8] flex flex-col justify-center items-start mt-10">
                    <div className="w-full border-t-3 border-[#e8321e] mb-4"></div>
                    <p className="text-xs font-medium italic">
                        omnia iam fiunt quae posse negabam
                    </p>
                </footer>
            </div>
        </>
    );
}

export async function getStaticProps() {
    return { props: { posts: getAllPosts() } };
}
