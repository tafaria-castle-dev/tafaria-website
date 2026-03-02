/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnimatePresence, motion } from 'framer-motion';

import { About } from '@/types';
import DOMPurify from 'dompurify';
import { Suspense, useEffect, useState } from 'react';

interface AboutsAboutTafariaProps {
    abouts: About[];
}

const AboutTafaria: React.FC<AboutsAboutTafariaProps> = ({ abouts }) => {
    const [expanded, setExpanded] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const MAX_LENGTH = 200;

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 600);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const processedHtml = (rawHtml: string) => {
        return rawHtml
            .replace(/<h1([^>]*)>/gi, '<h1 class="h1"$1>')
            .replace(/<h2([^>]*)>/gi, '<h3 class="h3"$1>');
    };
    const about = abouts[1];
    const content = about?.content;

    const shouldTruncate = isMobile && content && content?.length > MAX_LENGTH;

    const displayedHtml =
        shouldTruncate && !expanded
            ? about.content.slice(0, MAX_LENGTH) + '…'
            : about?.content;
    return (
        <Suspense
            fallback={
                <div className="flex justify-center p-6">
                    <div className="animate-pulse text-gray-400">
                        Loading story...
                    </div>
                </div>
            }
        >
            <div className="flex justify-center">
                <div className="mx-auto w-full max-w-3xl px-4 py-4 text-center">
                    <div className="mb-6 flex flex-col items-center gap-3">
                        {about?.title && (
                            <h3 className="h1 font-semibold text-[#902729]">
                                {about.title}
                            </h3>
                        )}

                        <div className="w-full text-left text-gray-700 md:text-center">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={expanded ? 'expanded' : 'collapsed'}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -12 }}
                                    transition={{
                                        duration: 0.35,
                                        ease: 'easeOut',
                                    }}
                                    style={{
                                        textAlign: 'center',
                                    }}
                                    dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(
                                            processedHtml(displayedHtml || ''),
                                        ),
                                    }}
                                />
                            </AnimatePresence>

                            {shouldTruncate && (
                                <button
                                    type="button"
                                    onClick={() => setExpanded(!expanded)}
                                    className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#902729] underline-offset-2 hover:text-[#b33235] hover:underline focus:ring-2 focus:ring-[#902729]/40 focus:outline-none"
                                >
                                    {expanded ? 'Show less' : 'Read more'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Suspense>
    );
};

export default AboutTafaria;
