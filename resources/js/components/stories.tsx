import { Category } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import React, { useEffect, useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

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
                const { scrollWidth, clientWidth } = scrollRef.current;
                const isSmallScreen = window.innerWidth < 640;
                if (isSmallScreen && scrollWidth > clientWidth) {
                    handleScroll();
                } else {
                    handleScroll();
                }
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

    const activeCategory = url.split('/')[1] || 'Default Category';

    return (
        <div className="relative bg-black">
            <div
                className="h-[3px] w-full"
                style={{
                    background:
                        'linear-gradient(to bottom, #9c7833, #9c7833, #9e8851, #d3b362)',
                }}
            ></div>
            <div
                className="relative py-2"
                style={{
                    backgroundImage: `url(/assets/flower-bg.png), url(/assets/flower-bg.png), url(/assets/flower-bg.png)`,
                    backgroundPosition: '0% 40%, 50% 60%, 90% 30%',
                    backgroundRepeat: 'no-repeat, no-repeat, no-repeat',
                    backgroundSize:
                        'clamp(300px, 30vw, 600px) auto, clamp(300px, 30vw, 600px) auto, clamp(300px, 30vw, 600px) auto',
                    backgroundColor: '#020202',
                }}
            >
                <div
                    className={`relative flex w-full items-stretch justify-center`}
                >
                    {showLeftArrow && (
                        <button
                            onClick={() => scrollTo('left')}
                            className="absolute top-1/2 left-2 z-10 flex -translate-y-1/2 transform items-center justify-center rounded-full bg-[#9f4446] p-3 transition-colors duration-200 hover:bg-[#b35557]"
                            aria-label="Scroll Left"
                        >
                            <FaChevronLeft className="text-xl text-white" />
                        </button>
                    )}
                    <div
                        ref={scrollRef}
                        className="no-scrollbar flex snap-x snap-mandatory overflow-x-scroll"
                    >
                        <div className="flex space-x-6 px-4">
                            {sortedCategories.map((img) => (
                                <Link
                                    key={img.id}
                                    href={`/${encodeURIComponent(img.slug)}`}
                                    className="flex-shrink-0"
                                >
                                    <div className="flex min-w-[90px] flex-col items-center space-y-2 py-3 sm:min-w-[110px]">
                                        <div
                                            className={`relative h-20 w-20 transition-transform duration-300 ease-in-out sm:h-24 sm:w-24 ${activeCategory === img.slug ? 'scale-110' : 'scale-100'} hover:scale-105`}
                                        >
                                            <img
                                                src="/assets/gold-ring.png"
                                                alt="Ring"
                                                className="pointer-events-none absolute top-0 left-0 z-10 h-full w-full"
                                            />
                                            <div className="absolute inset-[4px] z-0 sm:inset-[6px]">
                                                <img
                                                    className="h-full w-full rounded-full object-cover"
                                                    src={img.image_path || ''}
                                                    alt={img.name}
                                                />
                                            </div>
                                        </div>
                                        <p
                                            className={`text-center ${activeCategory === img.slug ? 'text-[#c1913c]' : 'text-white'} w-full truncate text-sm font-medium`}
                                        >
                                            {img.name}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                    {showRightArrow && (
                        <button
                            onClick={() => scrollTo('right')}
                            className="absolute top-1/2 right-2 z-10 flex -translate-y-1/2 transform items-center justify-center rounded-full bg-[#9f4446] p-3 transition-colors duration-200 hover:bg-[#b35557]"
                            aria-label="Scroll Right"
                        >
                            <FaChevronRight className="text-xl text-white" />
                        </button>
                    )}
                </div>
            </div>
            <div
                className="h-[1px] w-full"
                style={{
                    background:
                        'linear-gradient(to bottom, #9c7833, #9c7833, #9e8851, #d3b362)',
                }}
            ></div>
        </div>
    );
};

export default Stories;
