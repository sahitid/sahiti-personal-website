import React, { useState } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';

export default function Photos() {
    const controls = useAnimation();
    const [isSpinning, setIsSpinning] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    const handleSpin = async () => {
        if (!isSpinning) {
            setIsSpinning(true);

            await controls.start({
                rotate: 360,
                transition: { duration: 1, ease: 'linear' }
            });
            controls.set({ rotate: 0 });
            setIsSpinning(false);
        }
    };

    const handlePhotoClick = (photo, index) => {
        setSelectedPhoto({ ...photo, index });
    };

    const handleCloseModal = () => {
        setSelectedPhoto(null);
    };

    const getPhotoExtension = (photoNumber) => {
        // Photos 1-33 are .jpg, photos 34-51 are .JPG & i'm too lazy to change the file types
        return photoNumber <= 33 ? 'jpg' : 'JPG';
    };

    const photoData = Array.from({ length: 51 }, (_, i) => {
        const photoNumber = i + 1;
        const extension = getPhotoExtension(photoNumber);
        return {
            src: `/images/photo${photoNumber}.${extension}`
        };
    });

    console.log(photoData);


    return (
        <div className="w-screen overflow-x-hidden min-h-screen text-[#FF4444] bg-[#FFEBEB] flex flex-col relative font-inter px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48">

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
                <a href="/projects" className="nav-link transition-transform duration-300 hover:scale-105">/projects</a>
            </nav>

            <header className="w-full max-w-4xl mx-auto px-4 py-8">
                <h1 className="mt-16 sm:mt-24 md:mt-36 text-5xl sm:text-6xl md:text-7xl font-gilroy font-bold mb-4 text-left text-[#FF4444]">
                    PHOTO ARCHIVE.
                </h1>
                <p className="text-sm sm:text-base md:text-lg mb-6 text-left text-[#2F0000] tracking-widest">
                    collecting stories on my kodak pixpro fz55
                </p>
            </header>

            <main className="w-full max-w-4xl mx-auto px-4 flex flex-col mb-20">
                <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
                    {photoData.map((photo, index) => (
                        <motion.div
                            key={index}
                            className="relative bg-white shadow-lg rounded-md p-2 pb-10 cursor-pointer"
                            whileHover={{ scale: 1.05 }}
                            style={{
                                transform: `rotate(${index % 2 === 0 ? '-3deg' : '3deg'})`,
                            }}
                            onClick={() => handlePhotoClick(photo, index)}
                        >
                            <img
                                src={photo.src}
                                alt={`photo-${index + 1}`}
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
                            <button
                                className="absolute top-2 right-2 text-[#FF4444] text-2xl font-bold hover:text-red-600 z-10 bg-white rounded w-8 h-8 flex items-center justify-center"
                                onClick={handleCloseModal}
                            >
                                ×
                            </button>
                            <img
                                src={selectedPhoto.src}
                                alt={`photo-${selectedPhoto.index + 1}`}
                                className="w-full h-auto max-h-[80vh] object-contain rounded-sm"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <footer className="w-full max-w-4xl mx-auto px-4 py-4 text-[#FF4444] bg-[#FFEBEB] flex flex-col justify-center items-start mt-10">
                <div className="w-full border-t-4 border-[#FF4444] mb-4"></div>
                <p className="text-xs font-medium italic">
                    omnia iam fiunt quae posse negabam
                </p>
            </footer>
        </div>
    );
}
