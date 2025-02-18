import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

export default function Photos() {
    const controls = useAnimation();
    const [isSpinning, setIsSpinning] = useState(false);

    const handleSpinAndRedirect = async () => {
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

    const photoData = Array.from({ length: 27 }, (_, i) => ({
        src: `/images/photo${i + 1}.jpg`
    }));

    console.log(photoData);


    return (
        <div className="w-screen overflow-x-hidden min-h-screen text-[#FF4444] bg-[#FFEBEB] flex flex-col relative font-inter px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48">

            <div className="flex absolute left-0 top-0 m-4 sm:m-8 md:m-16">
                <motion.img
                    src="/boat.svg"
                    alt="Boat"
                    className="h-6 mr-2 cursor-pointer"
                    animate={controls}
                    onClick={handleSpinAndRedirect}
                />
            </div>

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
                            className="relative bg-white shadow-lg rounded-md p-2 pb-10"
                            whileHover={{ scale: 1.05 }}
                            style={{
                                transform: `rotate(${index % 2 === 0 ? '-3deg' : '3deg'})`,
                            }}
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

            <footer className="w-full max-w-4xl mx-auto px-4 py-4 text-[#FF4444] bg-[#FFEBEB] flex flex-col justify-center items-start mt-10">
                <div className="w-full border-t-4 border-[#FF4444] mb-4"></div>
                <p className="text-xs font-medium italic">
                    omnia iam fiunt quae posse negabam
                </p>
            </footer>
        </div>
    );
}
