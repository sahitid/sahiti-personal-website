import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Button } from "@nextui-org/react";
import Draggable from 'react-draggable';

export default function Home() {
  const controls = useAnimation();
  const [isSpinning, setIsSpinning] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (isSpinning) {
      controls.start({ rotate: 360, transition: { duration: 1, ease: 'linear' } }).then(() => {
        controls.set({ rotate: 0 });
        setIsSpinning(false);
      });
    }
  }, [isSpinning, controls]);

  const handleSpin = () => {
    if (!isSpinning) {
      setIsSpinning(true);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText('sahitidasari@outlook.com');
    alert('Email copied to clipboard!');
  };

  const handleTooltipClick = () => {
    setShowTooltip(true);
  };

  const handleTooltipClose = () => {
    setShowTooltip(false);
  };

  return (
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
          <a href="/projects" className="nav-link transition-transform duration-300 hover:scale-105">
            /projects
          </a>
          <a href="/photos" className="nav-link transition-transform duration-300 hover:scale-105">/photos</a>
        </nav>

        <h1 className="mt-16 sm:mt-24 md:mt-36 text-5xl sm:text-6xl md:text-7xl font-gilroy font-bold mb-4 text-left text-[#FF4444]">SAHITI DASARI.</h1>
        <p className="text-sm sm:text-base md:text-lg mb-2 text-left text-[#2F0000] my-6 tracking-widest">
          Hi! I'm a student and developer in love with the world of computer science and entrepreneurship. My{' '}
          <span className="relative inline-block">
            <Button
              className="button-no-outline underline-custom cursor-pointer transform transition-transform duration-300 hover:scale-105"
              onClick={handleTooltipClick}
              aria-label="Show mission tooltip"
            >
              mission
            </Button>
            {showTooltip && (
              <Draggable>
                <div className={`custom-tooltip ${showTooltip ? 'show' : ''}`} role="tooltip">
                  <span className="close-icon" onClick={handleTooltipClose}>×</span>
                  What keeps me going? The belief that when we blend creativity with purpose, we can sculpt a better world.
                </div>
              </Draggable>
            )}
          </span> is to make an impact by spreading opportunities.
        </p>
        <p className="text-sm sm:text-base md:text-lg mb-6 text-left text-[#2F0000] tracking-widest">
          Feel free to connect with me at any of the links below or contact me at{' '}
          <a href="mailto:sahitidasari@outlook.com" className="underline-custom cursor-pointer transform transition-transform duration-300 hover:scale-105">
            sahitidasari@outlook.com
          </a>
          .
        </p>
        <div className="flex space-x-4 mb-4">
          <a href="https://github.com/sahitid" target='blank' aria-label="GitHub Profile">
            <img src="/github.svg" alt="GitHub Icon" className="h-6 transition-opacity duration-300 transform transition-transform duration-300 hover:scale-110" />
          </a>
          <a href="https://www.linkedin.com/in/sahitidasari/" target='blank' aria-label="LinkedIn Profile">
            <img src="/linkedin.svg" alt="LinkedIn Icon" className="h-6 transition-opacity duration-300 transform transition-transform duration-300 hover:scale-110" />
          </a>
          <a href="https://x.com/sahitid_" target='blank' aria-label="X/Twitter Profile">
            <img src="/twitter.svg" alt="Twitter Icon" className="h-6 transition-opacity duration-300 transform transition-transform duration-300 hover:scale-110" />
          </a>
          <a href="mailto:sahitidasari@outlook.com" aria-label="Email">
            <img src="/mail.svg" alt="Mail Icon" className="h-6 transition-opacity duration-300 transform transition-transform duration-300 hover:scale-110" />
          </a>
        </div>
      </header>
      <main className="w-full max-w-4xl mx-auto px-4 flex flex-col mb-8">
      </main>
      <footer className="w-full max-w-4xl mx-auto px-4 py-4 text-[#FF4444] bg-[#FFEBEB] flex flex-col justify-center items-start mt-10">
        <div className="w-full border-t-4 border-[#FF4444] mb-4"></div>
        <p className="text-xs font-medium italic">
          omnia iam fiunt quae posse negabam
        </p>
      </footer>
    </div>
  );
}
