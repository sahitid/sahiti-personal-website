import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Button } from "@nextui-org/react";

export default function Home() {
  const controls = useAnimation();
  const [isSpinning, setIsSpinning] = useState(false);
  const [showStudentTooltip, setShowStudentTooltip] = useState(false);

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
    navigator.clipboard.writeText('sahitid@wharton.upenn.edu');
    alert('Email copied to clipboard!');
  };


  const handleStudentTooltipClick = () => {
    setShowStudentTooltip(true);
  };

  const handleStudentTooltipClose = () => {
    setShowStudentTooltip(false);
  };

  return (
    <div className="w-screen overflow-x-hidden min-h-screen text-[#FF4444] bg-[#FFEBEB] flex flex-col relative font-instrument-sans px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48">
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

        <nav className="absolute right-0 top-0 m-4 sm:m-8 md:m-16 flex flex-col space-y-2 text-[#FF4444] font-medium text-2xl tracking-normal">
          <span className="nav-link opacity-50 cursor-not-allowed">/home</span>
          <a href="/projects" className="nav-link transition-transform duration-300 hover:scale-105">/projects</a>
          <a href="/photos" className="nav-link transition-transform duration-300 hover:scale-105">/photos</a>
        </nav>

        <motion.h1
          className="mt-[28vh] text-7xl sm:text-8xl md:text-[96px] font-instrument-serif italic font-normal mb-[20px] text-left text-[#FF4444] leading-none"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <span className="block sm:inline">sahiti</span>{' '}
          <span className="block sm:inline">dasari</span>
        </motion.h1>
        <motion.p
          className="text-sm sm:text-base md:text-lg mb-0 text-left text-[#2F0000] tracking-normal"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
        >
          I'm a{' '}
          <span className="relative inline-block">
            <Button
              className="button-no-outline underline-custom cursor-pointer"
              onClick={handleStudentTooltipClick}
              aria-label="Show student info tooltip"
            >
              student
            </Button>
            {showStudentTooltip && (
              <motion.div
                className="custom-tooltip-enhanced"
                role="tooltip"
                drag
                dragMomentum={false}
                dragElastic={0.1}
                whileDrag={{ scale: 1.05, rotateZ: 2 }}
                initial={{
                  opacity: 0,
                  scale: 0.8,
                  y: 20,
                  rotateX: -10
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  rotateX: 0
                }}
                exit={{
                  opacity: 0,
                  scale: 0.9,
                  y: -10,
                  rotateX: 5
                }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30
                }}
              >
                <button
                  className="close-icon-enhanced"
                  onClick={handleStudentTooltipClose}
                  aria-label="Close student tooltip"
                >
                  ×
                </button>
                <div className="tooltip-content">
                  <p className="tooltip-text">
                    Studying Computer Science & Wharton at University of Pennsylvania in the{' '}
                    <a
                      href="https://fisher.wharton.upenn.edu/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-pointer text-[#FF4444] hover:opacity-80 transition-opacity duration-200"
                      style={{ textDecoration: 'underline', textDecorationColor: '#FF4444' }}
                    >
                      Jerome Fisher Management & Technology (M&T)
                    </a>{' '}
                    program.
                  </p>
                </div>
              </motion.div>
            )}
          </span>{' '}
          & developer in love with storytelling through human-centered technology.
        </motion.p>

        <motion.div
          className="flex space-x-4 mb-4 mt-[28px]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <a href="https://www.linkedin.com/in/sahitidasari/" target='blank' aria-label="LinkedIn Profile">
            <img src="/linkedin.svg" alt="LinkedIn Icon" className="h-6 transition-opacity duration-300 transform transition-transform duration-300 hover:scale-110" />
          </a>
          <a href="https://x.com/sahitid_" target='blank' aria-label="X/Twitter Profile">
            <img src="/twitter.svg" alt="Twitter Icon" className="h-6 transition-opacity duration-300 transform transition-transform duration-300 hover:scale-110" />
          </a>
          <a href="https://github.com/sahitid" target='blank' aria-label="GitHub Profile">
            <img src="/github.svg" alt="GitHub Icon" className="h-6 transition-opacity duration-300 transform transition-transform duration-300 hover:scale-110" />
          </a>
          <a href="mailto:sahitid@wharton.upenn.edu" aria-label="Email">
            <img src="/mail.svg" alt="Mail Icon" className="h-6 transition-opacity duration-300 transform transition-transform duration-300 hover:scale-110" />
          </a>
        </motion.div>
      </header>
      <main className="w-full max-w-4xl mx-auto px-4 flex flex-col mb-8">
      </main>
      <footer className="w-full max-w-4xl mx-auto px-4 py-4 text-[#FF4444] bg-[#FFEBEB] flex flex-col justify-center items-start mt-10">
        <div className="w-full border-t-3 border-[#FF4444] mb-4"></div>
        <p className="text-xs font-medium italic">
          omnia iam fiunt quae posse negabam
        </p>
      </footer>
    </div>
  );
}
