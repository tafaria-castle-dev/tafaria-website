import { Image, Video } from '@/types';
import { Link } from '@inertiajs/react';
import React from 'react';
import { FiSend } from 'react-icons/fi';
import CustomVideoPlayer from './CustomVideoPlayer';

interface BlogCardProps {
    id: string;
    type: string;
    slug: string;
    imageUrls: Image[];
    videoUrls: Video[];
    videos: Video[];
    index: number;
    title: string;
    created_at: string;
    content: string;
}

const BlogCard: React.FC<BlogCardProps> = ({
    type,
    slug,
    title,
    created_at,
    content,
    index,
    videos,
}) => {
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

    return (
        <Link href={postUrl} className="block">
            <div className="flex items-center bg-white shadow-md">
                <div className="container mx-auto p-4">
                    <div
                        className={`font-barlow-condensed mx-auto flex w-full flex-col rounded-lg bg-white px-3 py-5 shadow-lg transition-shadow duration-300 hover:shadow-xl`}
                    >
                        <h1 className="ml-3 pb-1 text-2xl font-semibold text-[#902729] sm:text-3xl md:hidden lg:hidden">
                            {title}
                        </h1>

                        <div className="flex flex-col justify-between px-4 pb-4">
                            <div>
                                <h1 className="text-2xl font-semibold text-[#902729] max-sm:hidden sm:hidden sm:text-3xl md:block lg:block">
                                    {title}
                                </h1>
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
                                        {new Date(
                                            created_at,
                                        ).toLocaleDateString('en-US', {
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </span>
                                </div>
                                {index === 0 && videos && videos.length > 0 && (
                                    <div
                                        className={`font-barlow-condensed mx-auto mb-4 flex w-full flex-col rounded-lg px-3 py-5 transition-shadow duration-300 hover:shadow-xl`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                    >
                                        <CustomVideoPlayer
                                            src={videos[0].video_path}
                                            title={videos[0].title}
                                            autoPlay={true}
                                            muted={true}
                                            loop={true}
                                        />
                                    </div>
                                )}
                                <div
                                    className="prose text-gray-700"
                                    dangerouslySetInnerHTML={{
                                        __html: content,
                                    }}
                                ></div>
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
        </Link>
    );
};

export default BlogCard;
