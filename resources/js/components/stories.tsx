import { Category } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ContactInfo from './ContactInfo';

interface StoriesProps {
    categories: Category[];
}

const Stories: React.FC<StoriesProps> = ({ categories }) => {
    const { url } = usePage();
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const scrollTo = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = scrollRef.current.clientWidth / 2;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 1);
        }
    };

    useEffect(() => {
        const updateArrowVisibility = () => {
            if (scrollRef.current) {
                handleScroll();
            }
        };

        updateArrowVisibility();
        window.addEventListener('resize', updateArrowVisibility);
        const currentRef = scrollRef.current;
        if (currentRef) {
            currentRef.addEventListener('scroll', handleScroll);
            handleScroll();
        }

        return () => {
            window.removeEventListener('resize', updateArrowVisibility);
            if (currentRef) {
                currentRef.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    const sortedCategories = [...categories].sort(
        (a, b) => (a.priority ?? 0) - (b.priority ?? 0),
    );

    const rawSlug = url.split('/')[1];
    const activeCategory = !rawSlug ? 'our-story' : rawSlug;
    return (
        <div className="relative bg-black">
            <div className="header relative py-2">
                <div className="relative flex w-full items-stretch justify-center">
                    <AnimatePresence>
                        {showLeftArrow && (
                            <motion.button
                                key="left-arrow"
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -8 }}
                                transition={{ duration: 0.2 }}
                                onClick={() => scrollTo('left')}
                                className="absolute top-1/2 left-2 z-22 flex -translate-y-1/2 items-center justify-center rounded-full bg-[#9f4446] p-3 hover:bg-[#b35557]"
                                aria-label="Scroll Left"
                            >
                                <FaChevronLeft className="text-xl text-white" />
                            </motion.button>
                        )}
                    </AnimatePresence>

                    <div
                        ref={scrollRef}
                        className="no-scrollbar flex snap-x snap-mandatory overflow-x-scroll"
                    >
                        <div className="flex items-center space-x-6 px-4">
                            {sortedCategories.map((img, i) => (
                                <motion.div
                                    key={img.id}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.35,
                                        delay: i * 0.05,
                                        ease: 'easeOut',
                                    }}
                                >
                                    {(() => {
                                        const inner = (
                                            <div className="flex min-w-[90px] flex-col items-center space-y-2 py-3 sm:min-w-[110px]">
                                                <motion.div
                                                    animate={{
                                                        scale:
                                                            activeCategory ===
                                                            img.slug
                                                                ? 1.1
                                                                : 1,
                                                    }}
                                                    whileHover={{ scale: 1.06 }}
                                                    whileTap={{ scale: 0.96 }}
                                                    transition={{
                                                        type: 'spring',
                                                        stiffness: 320,
                                                        damping: 20,
                                                    }}
                                                    className="relative h-18 w-18 sm:h-22 sm:w-22"
                                                >
                                                    <img
                                                        src="/assets/gold-ring.png"
                                                        alt="Ring"
                                                        className="pointer-events-none absolute top-0 left-0 z-10 h-full w-full"
                                                    />
                                                    <div className="absolute inset-[4px] z-0 sm:inset-[6px]">
                                                        <img
                                                            className="h-full w-full rounded-full object-cover"
                                                            src={
                                                                img.image_path ||
                                                                ''
                                                            }
                                                            alt={img.name}
                                                        />
                                                    </div>
                                                </motion.div>
                                                <p
                                                    className={`w-full truncate text-center text-sm font-medium ${
                                                        activeCategory ===
                                                        img.slug
                                                            ? 'text-[#c1913c]'
                                                            : 'text-black'
                                                    }`}
                                                >
                                                    {img.name}
                                                </p>
                                            </div>
                                        );

                                        return activeCategory === img.slug ? (
                                            <div className="flex-shrink-0 cursor-default">
                                                {inner}
                                            </div>
                                        ) : (
                                            <Link
                                                href={`/${encodeURIComponent(img.slug)}`}
                                                className="flex-shrink-0"
                                            >
                                                {inner}
                                            </Link>
                                        );
                                    })()}
                                </motion.div>
                            ))}

                            <motion.div
                                initial={{ opacity: 0, x: 16 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                    duration: 0.4,
                                    delay: 0.2,
                                    ease: 'easeOut',
                                }}
                                className="flex shrink-0 items-center border-l border-white/10 px-4"
                            >
                                <ContactInfo />
                            </motion.div>
                        </div>
                    </div>

                    <AnimatePresence>
                        {showRightArrow && (
                            <motion.button
                                key="right-arrow"
                                initial={{ opacity: 0, x: 8 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 8 }}
                                transition={{ duration: 0.2 }}
                                onClick={() => scrollTo('right')}
                                className="absolute top-1/2 right-2 z-22 flex -translate-y-1/2 items-center justify-center rounded-full bg-[#9f4446] p-3 hover:bg-[#b35557]"
                                aria-label="Scroll Right"
                            >
                                <FaChevronRight className="text-xl text-white" />
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div
                className="h-[1px] w-full"
                style={{
                    background:
                        'linear-gradient(to bottom, #9c7833, #9c7833, #9e8851, #d3b362)',
                }}
            />
        </div>
    );
};

export default Stories;
