import { Image, Video } from '@/types';
import { Link } from '@inertiajs/react';
import React from 'react';
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
            <div className="flex items-center bg-white">
                <div className="p-4">
                    <div
                        className={`font-barlow-condensed mx-auto flex w-full flex-col rounded-lg bg-white px-3 py-5 shadow-lg transition-shadow duration-300 hover:shadow-xl`}
                    >
                        <h1 className="h1 ml-3 pb-1 text-[#902729] md:hidden lg:hidden">
                            {title}
                        </h1>

                        <div className="flex flex-col justify-between px-4 pb-4">
                            <div>
                                <h1 className="h1 text-[#902729] max-sm:hidden sm:hidden md:block lg:block">
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
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default BlogCard;
