/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnimatePresence, motion } from 'framer-motion';

import { About } from '@/types';
import { Suspense, useEffect, useState } from 'react';

interface AboutsIntroProps {
    abouts: About[];
}

const AboutsIntro: React.FC<AboutsIntroProps> = ({ abouts }) => {
    const [expanded, setExpanded] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const MAX_LENGTH = 200;
    const content = abouts[0]?.content;
    const shouldTruncate = isMobile && content?.length > MAX_LENGTH;
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 600);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);
    return (
        <Suspense
            fallback={
                <div className="flex justify-center p-4">
                    <div className="animate-pulse">Loading...</div>
                </div>
            }
        >
            <div className="flex justify-center">
                <div className="mx-auto max-w-3xl px-4 py-2 text-center">
                    {abouts.map((about: About, index: number) => (
                        <div key={index} className="mb-2">
                            {/* <h2 className={`text-3xl font-bold text-[#94723C]`}>
                                {about.name}
                            </h2> */}
                            <h3 className="mt-1 text-xl text-[#902729] sm:text-3xl">
                                {about.title}
                            </h3>
                            <div className="mt-4 text-gray-700">
                                <div className="relative text-gray-700">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={
                                                expanded
                                                    ? 'expanded'
                                                    : 'collapsed'
                                            }
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.3 }}
                                            dangerouslySetInnerHTML={{
                                                __html:
                                                    !expanded && isMobile
                                                        ? about.content.slice(
                                                              0,
                                                              400,
                                                          )
                                                        : about.content,
                                            }}
                                        ></motion.div>
                                    </AnimatePresence>

                                    {shouldTruncate && (
                                        <button
                                            onClick={() =>
                                                setExpanded(!expanded)
                                            }
                                            className="cursor-pointer items-center text-xs text-[#902729] transition duration-300 hover:text-[#b33235] hover:underline"
                                        >
                                            {expanded
                                                ? 'Read Less'
                                                : 'Read More'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    <p
                        className={`font-parisienne text-3xl text-[#94723C] italic`}
                    >
                        George Tafaria
                    </p>
                </div>
            </div>
        </Suspense>
    );
};

export default AboutsIntro;
