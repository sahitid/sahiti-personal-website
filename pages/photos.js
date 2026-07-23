import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';

export default function Photos() {
    const controls = useAnimation();
    const [isSpinning, setIsSpinning] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [straightened, setStraightened] = useState(new Set());

    // Deterministic pseudo-random tilt so server and client render identical
    // styles (integer hash — bit-exact across JS engines, unlike Math.sin)
    const randomRotations = useMemo(
        () => Array.from({ length: 75 }, (_, i) => {
            let t = Math.imul(i + 1, 2654435761);
            t = Math.imul(t ^ (t >>> 15), t | 1);
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
            return (((t ^ (t >>> 14)) >>> 0) / 4294967296 - 0.5) * 10;
        }),
        []
    );

    const handleHover = (index) => {
        setStraightened((prev) => new Set(prev).add(index));
    };

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

    const handlePhotoClick = (photo, index) => {
        setSelectedPhoto({ ...photo, index });
    };

    const handleCloseModal = () => {
        setSelectedPhoto(null);
    };

    const getPhotoExtension = (photoNumber) => {
        if (photoNumber <= 33 || (photoNumber >= 52 && photoNumber <= 58)) return 'jpg';
        return 'JPG';
    };

    const photoData = Array.from({ length: 75 }, (_, i) => {
        const photoNumber = i + 1;
        const extension = getPhotoExtension(photoNumber);
        return {
            src: `/images/photo${photoNumber}.${extension}`
        };
    });

    return (
        <div className="w-screen overflow-x-hidden min-h-screen text-[#FF4444] bg-[#FFEBEB] flex flex-col relative font-instrument-sans px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48">

            <div className="flex absolute left-0 top-0 m-4 sm:m-8 md:m-16">
                <motion.img
                    src="/boat.svg"
                    alt="Boat"
                    className="h-6 mr-2 cursor-pointer"
                    animate={controls}
                    onClick={handleSpin}
                />
            </div>

            <nav className="absolute right-0 top-0 m-4 sm:m-8 md:m-16 flex flex-row flex-wrap justify-end gap-x-4 gap-y-1 sm:flex-col sm:gap-x-0 sm:gap-y-2 text-[#FF4444] font-instrument-serif italic font-normal text-base sm:text-2xl tracking-normal">
                <a href="/" className="nav-link transition-transform duration-300 hover:scale-105">/home</a>
                <a href="/projects" className="nav-link transition-transform duration-300 hover:scale-105">/projects</a>
                <a href="/writing" className="nav-link transition-transform duration-300 hover:scale-105">/writing</a>
                <span className="nav-link opacity-50 cursor-not-allowed">/photos</span>
            </nav>

            <header className="w-full max-w-4xl mx-auto px-4 py-8">
                <motion.h1
                    className="mt-16 sm:mt-24 md:mt-36 text-7xl sm:text-8xl md:text-[96px] font-instrument-serif italic font-normal mb-4 text-left text-[#FF4444]"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
                >
                    photo archive
                </motion.h1>
                <motion.p
                    className="text-sm sm:text-base md:text-lg mb-6 text-left text-[#2F0000] tracking-normal"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
                >
                    Collecting stories on my Kodak PIXPRO FZ55
                </motion.p>
            </header>

            <main className="w-full max-w-4xl mx-auto px-4 flex flex-col mb-20">
                <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
                    {photoData.map((photo, index) => (
                        <motion.div
                            key={index}
                            className="relative bg-white shadow-lg rounded-md p-2 pb-10 cursor-pointer"
                            initial={{ opacity: 0, y: 24, rotate: randomRotations[index] }}
                            animate={{ opacity: 1, y: 0, rotate: straightened.has(index) ? 0 : randomRotations[index] }}
                            transition={{ delay: Math.min(0.1 + index * 0.03, 0.7), duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
                            whileHover={{ scale: 1.05, rotate: 0, transition: { duration: 0.15, delay: 0 } }}
                            onHoverStart={() => handleHover(index)}
                            onClick={() => handlePhotoClick(photo, index)}
                        >
                            <Image
                                src={photo.src}
                                alt={`photo-${index + 1}`}
                                width={1200}
                                height={900}
                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 300px"
                                priority={index < 6}
                                className="w-full h-auto rounded-sm"
                            />
                        </motion.div>
                    ))}
                </section>
            </main>

            {/* Photo Modal */}
            <AnimatePresence>
                {selectedPhoto && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleCloseModal}
                    >
                        <motion.div
                            className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg p-4 shadow-2xl"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={(e) => e.stopPropagation()}
                        >

                            <Image
                                src={selectedPhoto.src}
                                alt={`photo-${selectedPhoto.index + 1}`}
                                width={1600}
                                height={1200}
                                sizes="100vw"
                                className="w-full h-auto max-h-[80vh] object-contain rounded-sm"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <footer className="w-full max-w-4xl mx-auto px-4 py-4 text-[#FF4444] bg-[#FFEBEB] flex flex-col justify-center items-start mt-10">
                <div className="w-full border-t-3 border-[#FF4444] mb-4"></div>
                <p className="text-xs font-medium italic">
                    omnia iam fiunt quae posse negabam
                </p>
            </footer>
        </div>
    );
}
