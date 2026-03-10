import React, { useState } from 'react';
import Head from 'next/head';
import { motion, useAnimation } from 'framer-motion';

export default function Projects() {
    const controls = useAnimation();
    const [isSpinning, setIsSpinning] = useState(false);
    const [activeFilter, setActiveFilter] = useState('All');

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

    const categories = ['All', 'AI/ML', 'Hardware', 'Web', 'App', 'Research', 'Community', 'Events'];

    const projects = [
        {
            title: 'Penn Meal Swipes',
            categories: ['Web'],
            description: 'Community-driven platform that connects underclassmen who have extra meal swipes with upperclassmen who would love to share a meal.',
            links: {
                website: 'https://penn-meal-swipes.vercel.app/',
                github: 'https://github.com/sahitid/penn-meal-swipes'
            }
        },
        {
            title: 'Solis',
            categories: ['AI/ML', 'Web'],
            description: 'Chrome extension that connects to your calendar and uses AI to detect scheduling conflicts, automatically finding better times.',
            links: {
                github: 'https://github.com/sahitid/solis',
                video: 'https://youtu.be/uYxkm5oJpWY'
            }
        },
        {
            title: 'Catalyx',
            categories: ['Hardware', 'Research'],
            description: 'Photocatalytic reactor using 3D-printed TPMS concrete and TiO\u2082 coating to treat dye wastewater with zero waste output. In partnership with Shu Yang Lab (original technology).',
            links: {
                website: 'https://www.canva.com/design/DAHDemq-bX8/-8VuYyXFnHXL9La4BayQNw/view?utm_content=DAHDemq-bX8&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h6ca241828e',
                video: 'https://youtu.be/n-rCImUiWMY'
            }
        },
        {
            title: 'PreSeed',
            categories: ['AI/ML', 'Hardware'],
            description: 'Hands-free Apple Vision Pro accessibility app that provides real-time scene understanding and spatial awareness through AI audio descriptions for vision impairment and blindness.',
            links: {
                website: 'https://devpost.com/software/preseed',
                video: 'https://youtu.be/AKS6wuNIMiE',
                github: 'https://github.com/michaelpeters-dev/Hack-Harvard'
            }
        },
        {
            title: 'Aurora: SF Athena Event',
            categories: ['Events'],
            date: 'July 2025',
            description: 'Co-organizing three-day gender-focused summer coding camp @ San Francisco with women in technology dinner.',
            links: {
                website: 'https://aurora.hackclub.com/',
                github: 'https://github.com/hackclub/aurora'
            }
        },
        {
            title: 'SF Tea Party',
            categories: ['Events'],
            date: 'July 2025',
            description: 'Hosted an intimate tea party gathering for friends, builders, and creatives in San Francisco.',
            links: {
                website: 'https://x.com/sahitid_/status/1947892874164768919?s=20',
            }
        },
        {
            title: 'CAISE',
            categories: ['AI/ML', 'Web'],
            description: 'AI-powered educational platform designed to give DECA & FBLA competitors a competitive edge in role-play and case study events. Built with ethical AI models.',
            links: {
                website: 'https://caise.app',
            }
        },
        {
            title: 'Meta Glasses Poker Computer-Vision',
            categories: ['AI/ML', 'Hardware'],
            description: 'A Meta Glasses-powered system that lets you play poker and do homework at the same time—but the better you do at one, the worse you perform at the other.',
            links: {
                video: 'https://youtu.be/JVtFxCJw5ng',
                github: 'https://github.com/sahitid/meta-vision-project'
            }
        },
        {
            title: 'Ascend: Days of Service Summit',
            categories: ['Events'],
            date: 'November 2024',
            description: 'Co-organized three-day gender-focused summit of 50+ coders at SpaceX @ Los Angeles. Partnered with Kode With Klossy, Girls Who Code, and SpaceX.',
            links: {
                website: 'https://ascend.hackclub.com/',
                github: 'https://github.com/hackclub/ascend'
            }
        },
        {
            title: 'Parker Lab @ Georgia Tech',
            categories: ['Hardware', 'Research'],
            date: 'Summer 2024',
            description: 'Implementing and stabilizing Proportional Integral Derivative (PID) controller on Red Pitaya to regulate laser output through a laser aligner.',
            links: {
                website: 'https://parkerlab.gatech.edu/',
                github: 'https://github.com/sahitid/laser-aligner'
            }
        },
        {
            title: 'Arriaga Lab @ Georgia Tech',
            categories: ['AI/ML', 'Research'],
            date: 'January 2024 - May 2025',
            description: 'Human-Computer Interaction (HCI) through large language models to understand their application in interpersonal interactions through Turing Experiements.',
            links: {
                website: 'https://sites.google.com/view/riarriaga/lab',
            }
        },
        {
            title: 'DriveSmart',
            categories: ['AI/ML', 'App'],
            description: 'AI driving assistant app that helps new drivers navigate safely and practice mastering the art of driving on the roads. DriveSmart won the Congressional App Challenge for Georgia\'s 6th District.',
            links: {
                github: 'https://github.com/sahitid/drive-smart',
                video: 'https://youtu.be/bqc_u6gAjtY',
                award: 'https://www.congressionalappchallenge.us/23-GA06/'
            }
        },
        {
            title: 'BIOMET',
            categories: ['Hardware'],
            description: 'A universal, low-cost identification system, created in response to the global identification crisis. BIOMET is a Conrad Challenge finalist & Power Pitch winner in Cyber Technology & Security.',
            links: {
                website: 'https://biomet.vercel.app/',
                video: 'https://youtu.be/RVOrgTGgbas',
                award: 'https://www.conradchallenge.org/2024-summit-wrap'
            }
        },
        {
            title: 'Blossom: Atlanta Day of Service',
            categories: ['Events'],
            date: 'March 2024',
            description: 'Directed the largest gender-focused day of coding with Atlanta Girl Scouts.',
            links: {
                website: 'https://blossom.hackclub.com/',
                github: 'https://github.com/hackclub/blossom',
                photo: 'https://drive.google.com/drive/folders/1wI2NGEtDkiYODIacFQpH148QSl9RHXWM'
            }
        },
        {
            title: 'Forsyth Hacks 2.0 & 1.0',
            categories: ['Events'],
            description: 'Founded annual county wide hackathon for high-school students to promote application based coding.',
            links: {
                website: 'https://forsyth-hacks-v2-site.vercel.app/',
                github: 'https://github.com/SFHSHackClub/forsyth-hacks-v2-site',
                photo: 'https://photos.app.goo.gl/RdvvgMmpD3rpioNc6'
            }
        },
        {
            title: 'Clubs Operations & Engineering',
            categories: ['Community'],
            date: 'May 2023 - May 2025',
            description: 'Employed at Hack Club to support new coding club chapters, technology grants, and community engagement initiatives to help club leaders worldwide.',
            links: {
                website: 'https://hackclub.com/team/',
                video: 'https://youtu.be/jFCrDEOPzVM'
            }
        },
        {
            title: 'Philanthropy & Communications',
            categories: ['Community'],
            date: 'Summer 2023',
            description: 'Developed AI research that attracted national attention and helped raise $350k for Hack Club. Successfully crafted communications to Fortune 500 CEOs & technology leaders, directly leading to their engagement.',
            links: {
                website: 'https://hackclub.com/',
            }
        },
        {
            title: 'EcoBuddy',
            categories: ['App'],
            description: 'Swift mobile application that offers ways for users to gain points by practicing sustainable living and completing eco-friendly exercises.',
            links: {
                github: 'https://github.com/sahitid/ecobuddy'
            }
        },
        {
            title: 'Hack Club Jams',
            categories: ['Web'],
            description: 'Assisted in the Hack Club Jams™ initiative for collaborative coding workshops for over 28,000 teenagers around the world.',
            links: {
                website: 'https://jams.hackclub.com',
                github: 'https://github.com/hackclub/jams'
            }
        },
        {
            title: 'AI & ML Jams',
            categories: ['AI/ML', 'Web'],
            description: 'Four-part Batch Jams™ workshop that introduces concepts of integrating large language models, speech recognition APIs, and JavaScript to create your own smart voice assistant!',
            links: {
                website: 'https://jams.hackclub.com/batch/artificial-intelligence',
                github: 'https://github.com/sahitid/artificial-intelligence-jams'
            }
        },
        {
            title: 'Leaders Letters',
            categories: ['Web'],
            description: 'Created blog article page for stories, insights, and experiences shared within the Hack Club community — by leaders for leaders.',
            links: {
                website: 'https://hackclub.com/letters',
                github: 'https://github.com/sahitid/leaders-letters'
            }
        },
        {
            title: 'Hack Club\'s Leaders Summit',
            categories: ['Events'],
            date: 'February 2024',
            description: 'Co-organized a weekend of invention, collaboration, and friendship in San Francisco with 75 Hack Club leaders from around the world.',
            links: {
                website: 'https://summit.hackclub.com',
                github: 'https://github.com/hackclub/summit',
                video: 'https://www.youtube.com/watch?v=UZEm5lONg7g'
            }
        },
        {
            title: 'SFHS Hack Club',
            categories: ['Community'],
            description: 'Founded an inclusive school-wide collaborative coding club for project-based coding.',
            links: {
                video: 'https://www.youtube.com/watch?v=xXIxwV7bQTw'
            }
        },
        {
            title: 'Hack Club AMAs',
            categories: ['Events'],
            description: 'Hosted and directed multiple AMAs with industry experts (including Michael Dell, George Hotz, Trina Spear and Ben Tritt among others) in partnership with Hack Club.',
            links: {
                website: 'https://hackclub.com/amas/',
                video: 'https://www.youtube.com/watch?v=O1J1pwGPQXY'
            }
        },
        {
            title: 'FitSphere',
            categories: ['AI/ML', 'Web'],
            description: 'Progressive Web App that helps users meet fitness goals and transform their lifestyle with an AI form trainer and H2O Flow for hydration. FitSphere was a Technovation Girls Challenge Semifinalist.',
            links: {
                award: 'https://www.technovation.org/blogs/semifinalists-2023/'
            }
        }
    ];

    const filteredProjects = activeFilter === 'All'
        ? projects
        : projects.filter(p => p.categories.includes(activeFilter));

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
                <title>Projects - Sahiti Dasari</title>
                <meta name="description" content="Sahiti Dasari's projects and work" />
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

                    <nav className="absolute right-0 top-0 m-4 sm:m-8 md:m-16 flex flex-col space-y-2 text-[#e8321e] font-bold text-2xl tracking-wide leading-tight" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
                        <a href="/" className="nav-link transition-transform duration-300 hover:scale-105">/home</a>
                        <span className="nav-link opacity-50 cursor-not-allowed">/projects</span>
                        <a href="/photos" className="nav-link transition-transform duration-300 hover:scale-105">/photos</a>
                    </nav>

                    <motion.h1
                        className="mt-16 sm:mt-24 md:mt-36 text-7xl sm:text-8xl md:text-[96px] font-instrument-serif italic font-normal mb-4 text-left text-[#e8321e]"
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={0}
                    >
                        projects
                    </motion.h1>
                </header>

                <main className="w-full max-w-4xl mx-auto px-4 flex flex-col mb-20">
                    <motion.div
                        className="flex flex-wrap gap-[24px] mb-10"
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={1}
                    >
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveFilter(cat)}
                                className={`text-[14px] bg-transparent border-none p-0 cursor-pointer transition-all duration-200 ${
                                    activeFilter === cat
                                        ? 'font-bold text-[#e8321e]'
                                        : 'font-medium text-[#e8321eaa]'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </motion.div>

                    <section>
                        <div className="project-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                            {filteredProjects.map((project, index) => (
                                <motion.div
                                    key={`${activeFilter}-${project.title}`}
                                    className="group flex flex-col"
                                    variants={fadeUp}
                                    initial="hidden"
                                    animate="visible"
                                    custom={index + 2}
                                >
                                    <h3 className={`text-[16px] font-semibold text-[#1a0a0a] tracking-wide font-instrument-sans mb-2 ${project.links.website ? 'transition-all duration-300 group-hover:translate-x-1.5 group-hover:text-[#e8321e]' : ''}`}>
                                        {project.links.website ? (
                                            <a href={project.links.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5">
                                                {project.title}
                                                <img src="/arrow.svg" alt="" className="h-3 w-3 inline-block opacity-40 group-hover:opacity-100 transition-opacity duration-300" />
                                            </a>
                                        ) : (
                                            project.title
                                        )}
                                    </h3>
                                    <p className="text-[13px] font-normal text-[#1a0a0a] leading-[1.6] tracking-[0.01em] font-instrument-sans mb-2">{project.description}</p>
                                    <div className="flex items-center justify-between mt-auto">
                                        {project.date ? (
                                            <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#e8321eaa]">{project.date}</p>
                                        ) : (
                                            <span></span>
                                        )}
                                        <div className="flex space-x-2.5">
                                            {project.links.github && (
                                                <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="opacity-40 hover:opacity-100 transition-opacity duration-300" aria-label="GitHub Repository">
                                                    <img src="/github.svg" alt="GitHub" className="h-3.5" />
                                                </a>
                                            )}
                                            {project.links.video && (
                                                <a href={project.links.video} target="_blank" rel="noopener noreferrer" className="opacity-40 hover:opacity-100 transition-opacity duration-300" aria-label="Project Video">
                                                    <img src="/video.svg" alt="Video" className="h-3.5" />
                                                </a>
                                            )}
                                            {project.links.photo && (
                                                <a href={project.links.photo} target="_blank" rel="noopener noreferrer" className="opacity-40 hover:opacity-100 transition-opacity duration-300" aria-label="Project Photos">
                                                    <img src="/camera.svg" alt="Photos" className="h-3.5" />
                                                </a>
                                            )}
                                            {project.links.award && (
                                                <a href={project.links.award} target="_blank" rel="noopener noreferrer" className="opacity-40 hover:opacity-100 transition-opacity duration-300" aria-label="Project Award">
                                                    <img src="/award.svg" alt="Award" className="h-3.5" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                </main>

                <footer className="w-full max-w-4xl mx-auto px-4 py-4 text-[#e8321e] bg-[#fce8e8] flex flex-col justify-center items-start mt-10">
                    <div className="w-full border-t-3 border-[#e8321e] mb-4"></div>
                    <p className="text-xs font-medium italic">
                        omnia iam fiunt quae posse negabam
                    </p>
                </footer>
            </div>

            <style jsx global>{`
                .project-grid > div {
                    border-bottom: 1px solid #e8b4b466;
                    padding: 20px 20px 20px 0;
                }
                @media (min-width: 640px) {
                    .project-grid > div {
                        border-right: 1px solid #e8b4b466;
                        padding: 20px;
                    }
                    .project-grid > div:nth-child(2n) {
                        border-right: none;
                    }
                    .project-grid > div:nth-child(2n+1) {
                        padding-left: 0;
                    }
                }
                @media (min-width: 1024px) {
                    .project-grid > div:nth-child(2n) {
                        border-right: 1px solid #e8b4b466;
                    }
                    .project-grid > div:nth-child(2n+1) {
                        padding-left: 20px;
                    }
                    .project-grid > div:nth-child(4n) {
                        border-right: none;
                    }
                    .project-grid > div:nth-child(4n+1) {
                        padding-left: 0;
                    }
                }
            `}</style>
        </>
    );
}
