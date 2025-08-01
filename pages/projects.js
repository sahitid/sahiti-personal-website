import React, { useState } from 'react';
import Head from 'next/head';
import { motion, useAnimation } from 'framer-motion';

export default function Projects() {
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

            // Redirect to home page after spinning
            window.location.href = '/';
        }
    };
    const projects = [
        {
            title: 'Aurora: SF Athena Event',
            date: 'July 2025',
            description: 'Co-organizing three-day gender-focused summer coding camp @ San Francisco with women in technology dinner.',
            links: {
                website: 'https://aurora.hackclub.com/',
                github: 'https://github.com/hackclub/aurora'
            }
        },
        {
            title: 'CAISE',
            description: 'AI-powered educational platform designed to give DECA & FBLA competitors a competitive edge in role-play and case study events. Built with ethical AI models.',
            links: {
                website: 'https://caise.app',
            }
        },
        {
            title: 'Meta Glasses Poker Computer-Vision',
            description: 'A Meta Glasses-powered system that lets you play poker and do homework at the same time—but the better you do at one, the worse you perform at the other.',
            links: {
                video: 'https://youtu.be/JVtFxCJw5ng',
                github: 'https://github.com/sahitid/meta-vision-project'
            }
        },
        {
            title: 'Ascend: Days of Service Summit',
            date: 'November 2024',
            description: 'Co-organized three-day gender-focused summit of 50+ coders at SpaceX @ Los Angeles. Partnered with Kode With Klossy, Girls Who Code, and SpaceX.',
            links: {
                website: 'https://ascend.hackclub.com/',
                github: 'https://github.com/hackclub/ascend'
            }
        },
        {
            title: 'Parker Lab @ Georgia Tech',
            date: 'Summer 2024',
            description: 'Implementing and stabilizing Proportional Integral Derivative (PID) controller on Red Pitaya to regulate laser output through a laser aligner.',
            links: {
                website: 'https://parkerlab.gatech.edu/',
                github: 'https://github.com/sahitid/laser-aligner'
            }
        },
        {
            title: 'Arriaga Lab @ Georgia Tech',
            date: 'January 2024 - May 2025',
            description: 'Human-Computer Interaction (HCI) through large language models to understand their application in interpersonal interactions through Turing Experiements.',
            links: {
                website: 'https://sites.google.com/view/riarriaga/lab',
            }
        },
        {
            title: 'DriveSmart',
            description: 'AI driving assistant app that helps new drivers navigate safely and practice mastering the art of driving on the roads. DriveSmart won the Congressional App Challenge for Georgia\'s 6th District.',
            links: {
                github: 'https://github.com/sahitid/drive-smart',
                video: 'https://youtu.be/bqc_u6gAjtY',
                award: 'https://www.congressionalappchallenge.us/23-GA06/'
            }
        },
        {
            title: 'BIOMET',
            description: 'A universal, low-cost identification system, created in response to the global identification crisis. BIOMET is a Conrad Challenge finalist & Power Pitch winner in Cyber Technology & Security.',
            links: {
                website: 'https://www.biomet.technology/',
                video: 'https://youtu.be/RVOrgTGgbas',
                award: 'https://www.conradchallenge.org/2024-summit-wrap'
            }
        },
        {
            title: 'Blossom: Atlanta Day of Service',
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
            description: 'Founded annual county wide hackathon for high-school students to promote application based coding.',
            links: {
                website: 'https://forsyth-hacks-v2-site.vercel.app/',
                github: 'https://github.com/SFHSHackClub/forsyth-hacks-v2-site',
                photo: 'https://photos.app.goo.gl/RdvvgMmpD3rpioNc6'
            }
        },
        {
            title: 'Clubs Operations & Engineering',
            date: 'May 2023 - May 2025',
            description: 'Employed at Hack Club to support new coding club chapters, technology grants, and community engagement initiatives to help club leaders worldwide.',
            links: {
                website: 'https://hackclub.com/team/',
                video: 'https://youtu.be/jFCrDEOPzVM'
            }
        },
        {
            title: 'Philanthropy & Communications',
            date: 'Summer 2023',
            description: 'Developed AI research that attracted national attention and helped raise $350k for Hack Club. Successfully crafted communications to Fortune 500 CEOs & technology leaders, directly leading to their engagement.',
            links: {
                website: 'https://hackclub.com/',
            }
        },
        {
            title: 'EcoBuddy',
            description: 'Swift mobile application that offers ways for users to gain points by practicing sustainable living and completing eco-friendly exercises.',
            links: {
                github: 'https://github.com/sahitid/ecobuddy'
            }
        },
        {
            title: 'Hack Club Jams',
            description: 'Assisted in the Hack Club Jams™ initiative for collaborative coding workshops for over 28,000 teenagers around the world.',
            links: {
                website: 'https://jams.hackclub.com',
                github: 'https://github.com/hackclub/jams'
            }
        },
        {
            title: 'AI & ML Jams',
            description: 'Four-part Batch Jams™ workshop that introduces concepts of integrating large language models, speech recognition APIs, and JavaScript to create your own smart voice assistant!',
            links: {
                website: 'https://jams.hackclub.com/batch/artificial-intelligence',
                github: 'https://github.com/sahitid/artificial-intelligence-jams'
            }
        },
        {
            title: 'Leaders Letters',
            description: 'Created blog article page for stories, insights, and experiences shared within the Hack Club community — by leaders for leaders.',
            links: {
                website: 'https://hackclub.com/letters',
                github: 'https://github.com/sahitid/leaders-letters'
            }
        },
        {
            title: 'Hack Club\'s Leaders Summit',
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
            description: 'Founded an inclusive school-wide collaborative coding club for project-based coding.',
            links: {
                video: 'https://www.youtube.com/watch?v=xXIxwV7bQTw'
            }
        },
        {
            title: 'Hack Club AMAs',
            description: 'Hosted and directed multiple AMAs with industry experts (including Michael Dell, George Hotz, Trina Spear and Ben Tritt among others) in partnership with Hack Club.',
            links: {
                website: 'https://hackclub.com/amas/',
                video: 'https://www.youtube.com/watch?v=O1J1pwGPQXY'
            }
        },
        {
            title: 'FitSphere',
            description: 'Progressive Web App that helps users meet fitness goals and transform their lifestyle with an AI form trainer and H2O Flow for hydration. FitSphere was a Technovation Girls Challenge Semifinalist.',
            links: {
                award: 'https://www.technovation.org/blogs/semifinalists-2023/'
            }
        }
    ];

    return (
        <>
            <Head>
                <title>Projects - Sahiti Dasari</title>
                <meta name="description" content="Sahiti Dasari's projects and work" />

            </Head>
            <div className="w-screen overflow-x-hidden min-h-screen text-[#FF4444] bg-[#FFEBEB] flex flex-col relative font-inter px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48">
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

                    <nav className="absolute right-0 top-0 m-4 sm:m-8 md:m-16 flex flex-col space-y-2 text-[#FF4444] font-gilroy font-bold text-2xl tracking-wide leading-tight">
                        <a href="/" className="nav-link transition-transform duration-300 hover:scale-105">/home</a>
                        <span className="nav-link opacity-50 cursor-not-allowed">/projects</span>
                        <a href="/photos" className="nav-link transition-transform duration-300 hover:scale-105">/photos</a>
                    </nav>

                    <h1 className="mt-16 sm:mt-24 md:mt-36 text-5xl sm:text-6xl md:text-7xl font-gilroy font-bold mb-4 text-left text-[#FF4444]">PROJECTS</h1>

                </header>

                <main className="w-full max-w-4xl mx-auto px-4 flex flex-col mb-20">
                    <section className="mt-8 mb-16">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
                            {projects.map((project, index) => (
                                <div key={index} className="transition-shadow duration-300 pr-4 pt-4">
                                    <div className="flex items-center justify-between">
                                        <div className={`flex items-center ${project.links.website ? 'transform transition-transform duration-300 hover:scale-110' : ''}`}>
                                            <h3 className={`text-sm sm:text-base md:text-lg text-[#FF4444] ${project.links.website ? 'underline' : ''}`}>
                                                {project.links.website ? (
                                                    <a href={project.links.website} className='tracking-wider' target='blank' rel='noopener noreferrer'>{project.title}</a>
                                                ) : (
                                                    project.title
                                                )}
                                            </h3>
                                            {project.links.website && (
                                                <a href={project.links.website} target='blank' rel='noopener noreferrer' aria-label="Project Link">
                                                    <img
                                                        src="/arrow.svg"
                                                        alt="Arrow"
                                                        className="h-4 ml-2 opacity-50 hover:opacity-100 transition-opacity duration-300"
                                                    />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-xs font-bold mt-2 text-[#2F0000] tracking-wide">{project.date}</p>
                                    <p className="mt-2 text-xs sm:text-sm md:text-base text-[#2F0000] tracking-wide">{project.description}</p>
                                    <div className="flex space-x-2 mt-2">
                                        {project.links.github && (
                                            <a href={project.links.github} target='blank' rel='noopener noreferrer' className="transform transition-transform duration-300 hover:scale-110 opacity-50 hover:opacity-100" aria-label="GitHub Repository">
                                                <img src="/github.svg" alt="GitHub Icon" className="h-4" />
                                            </a>
                                        )}
                                        {project.links.video && (
                                            <a href={project.links.video} target='blank' rel='noopener noreferrer' className="transform transition-transform duration-300 hover:scale-110 opacity-50 hover:opacity-100" aria-label="Project Video">
                                                <img src="/video.svg" alt="Video Icon" className="h-4" />
                                            </a>
                                        )}
                                        {project.links.photo && (
                                            <a href={project.links.photo} target='blank' rel='noopener noreferrer' className="transform transition-transform duration-300 hover:scale-110 opacity-50 hover:opacity-100" aria-label="Project Photo">
                                                <img src="/camera.svg" alt="Photo Icon" className="h-4" />
                                            </a>
                                        )}
                                        {project.links.award && (
                                            <a href={project.links.award} target='blank' rel='noopener noreferrer' className="transform transition-transform duration-300 hover:scale-110 opacity-50 hover:opacity-100" aria-label="Project Award">
                                                <img src="/award.svg" alt="Award Icon" className="h-4" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>

                <footer className="w-full max-w-4xl mx-auto px-4 py-4 text-[#FF4444] bg-[#FFEBEB] flex flex-col justify-center items-start mt-10">
                    <div className="w-full border-t-3 border-[#FF4444] mb-4"></div>
                    <p className="text-xs font-medium italic">
                        omnia iam fiunt quae posse negabam
                    </p>
                </footer>
            </div>
        </>
    );
} 