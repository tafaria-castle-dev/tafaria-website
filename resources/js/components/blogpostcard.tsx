import { Image, Video } from '@/types';
import React, { useEffect, useRef, useState } from 'react';
import { FiChevronDown, FiChevronUp, FiSend } from 'react-icons/fi';

interface BlogCardProps {
    id: string;
    type: string;
    slug: string;
    imageUrls: Image[];
    videoUrls: Video[];
    title: string;
    created_at: string;
    content: string;
    forceCollapse?: boolean;
    onToggle?: (isExpanded: boolean) => void;
}

const BlogPostCard: React.FC<BlogCardProps> = ({
    type,
    slug,
    title,
    created_at,
    content,
    forceCollapse,
    onToggle,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const [showCollapse, setShowCollapse] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (forceCollapse) {
            setIsExpanded(false);
            onToggle?.(false);
        }
    }, [forceCollapse, onToggle]);

    const phoneNumber = '+254708877244';
    const message = `I would like to visit ${title}`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        message,
    )}`;
    const postUrl = `/${type}/${slug}`;
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(
        `See this 😍: ${title} - View it here: https://www.tafaria.com/${type}/${slug}`,
    )}`;
    const handleShareClick = () => {
        window.open(shareUrl, '_blank', 'noopener,noreferrer');
    };
    const handleBookClick = () => {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    };

    useEffect(() => {
        const updateContentHeight = () => {
            if (contentRef.current) {
                setContentHeight(contentRef.current.scrollHeight);
            }
        };

        const handleScroll = () => {
            if (cardRef.current && contentRef.current) {
                const cardRect = cardRef.current.getBoundingClientRect();
                const isInView =
                    cardRect.top < window.innerHeight && cardRect.bottom > 0;
                setShowCollapse(
                    isInView && contentRef.current.scrollHeight > 100,
                );
            }
        };

        updateContentHeight();

        const resizeObserver = new ResizeObserver(updateContentHeight);
        if (contentRef.current) {
            resizeObserver.observe(contentRef.current);
        }

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('scroll', handleScroll);
        };
    }, [content, isExpanded]);
    useEffect(() => {
        if (cardRef.current) {
            cardRef.current.setAttribute(
                'data-expanded',
                isExpanded.toString(),
            );
        }
    }, [isExpanded]);
    const toggleExpanded = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const newExpanded = !isExpanded;
        setIsExpanded(newExpanded);
        onToggle?.(newExpanded);
    };

    const handleCardClick = (e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        if (
            target.closest('button') ||
            target.closest('a[href^="https://wa.me"]') ||
            target.closest('.expand-toggle')
        ) {
            return;
        }
        window.location.href = postUrl;
    };

    return (
        <div className="flex items-center bg-white shadow-md">
            <div className="container mx-auto p-3">
                <div
                    ref={cardRef}
                    className={`font-barlow-condensed relative mx-auto flex w-full cursor-pointer flex-col rounded-lg bg-white px-3 py-5 shadow-lg transition-all duration-300 hover:shadow-xl`}
                    onClick={handleCardClick}
                >
                    <div className="mb-1 flex items-center justify-between">
                        <h1 className="ml-3 flex-1 text-2xl font-semibold text-[#902729] sm:text-3xl md:hidden lg:hidden">
                            {title}
                        </h1>
                        {showCollapse && (
                            <button
                                onClick={toggleExpanded}
                                className="expand-toggle mt-1 mr-4 flex items-center justify-center rounded-full p-1 transition-colors duration-200 hover:bg-gray-100 md:hidden lg:hidden"
                                aria-label={isExpanded ? 'Collapse' : 'Expand'}
                            >
                                {isExpanded && !forceCollapse ? (
                                    <FiChevronUp className="text-3xl text-[#902729]" />
                                ) : (
                                    <FiChevronDown className="text-3xl text-[#902729]" />
                                )}
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col justify-between px-4 pb-4">
                        <div>
                            <div className="mb-1 flex items-center justify-between">
                                <h1 className="flex-1 text-2xl font-semibold text-[#902729] max-sm:hidden sm:hidden sm:text-3xl md:block lg:block">
                                    {title}
                                </h1>
                                {showCollapse && (
                                    <button
                                        onClick={toggleExpanded}
                                        className="expand-toggle items-center justify-center rounded-full p-2 transition-colors duration-200 hover:bg-gray-100 max-sm:hidden sm:hidden md:flex lg:flex"
                                        aria-label={
                                            isExpanded && !forceCollapse
                                                ? 'Collapse'
                                                : 'Expand'
                                        }
                                    >
                                        {isExpanded && !forceCollapse ? (
                                            <FiChevronUp className="text-3xl text-[#902729]" />
                                        ) : (
                                            <FiChevronDown className="text-3xl text-[#902729]" />
                                        )}
                                    </button>
                                )}
                            </div>

                            <div className="mb-2 flex items-center text-sm">
                                <img
                                    width={18}
                                    height={18}
                                    src="/images/carlendar.svg"
                                    alt="SVG image"
                                />
                                <span
                                    className={`font-montaga my-2 ml-2 text-gray-500`}
                                >
                                    {new Date(created_at).toLocaleDateString(
                                        'en-US',
                                        {
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric',
                                        },
                                    )}
                                </span>
                            </div>

                            <div
                                className="overflow-hidden transition-all duration-500 ease-in-out"
                                style={{
                                    maxHeight:
                                        isExpanded && !forceCollapse
                                            ? `${contentHeight}px`
                                            : '100px',
                                }}
                            >
                                <div
                                    ref={contentRef}
                                    className="prose text-gray-700"
                                    dangerouslySetInnerHTML={{
                                        __html: content,
                                    }}
                                ></div>
                            </div>

                            {!isExpanded && (
                                <div className="relative">
                                    <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-20 bg-gradient-to-t from-white to-transparent" />
                                </div>
                            )}

                            <div className="mt-2">
                                <button
                                    onClick={toggleExpanded}
                                    className="expand-toggle text-sm font-medium text-[#902729] transition-colors duration-200 hover:text-[#b33235]"
                                >
                                    {isExpanded && !forceCollapse
                                        ? 'Show less'
                                        : 'Read more'}
                                </button>
                            </div>
                        </div>

                        <div className="mt-4 flex space-x-4">
                            <button
                                className="flex items-center text-sm text-[#94723C] transition-colors duration-200 hover:text-[#b33235]"
                                onClick={handleBookClick}
                            >
                                <span>Book a visit</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="ml-1 h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </button>
                            <button
                                onClick={handleShareClick}
                                className="rounded-full bg-green-500 p-2 text-white"
                                aria-label="Share via WhatsApp"
                            >
                                <FiSend />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogPostCard;
