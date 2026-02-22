'use client';

import { FiShare2 } from 'react-icons/fi';

const PostCard = ({
    imageUrl,
    text,
    title,
    created_at,
    width,
    height,
    id,
}: {
    imageUrl: string;
    text: string;
    title: string;
    created_at: string;
    width: number;
    height: number;
    id: string;
}) => {
    // const toggleLike = () => setIsLiked(!isLiked);

    // const handleShare = () => {
    //   // http://localhost:3000/categories?title=Images&imageUrl=%2Fimages%2F12.png
    //   // const link = `http://localhost:3000/categories?title=Images&imageUrl=${imageUrl}`; // The link you want to share
    //   const link = `https://tafaria-castle.vercel.app/categories?title=Images&imageUrl=${imageUrl}`; // The link you want to share
    //   const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + " " + link)}`; // Share text and link

    //   window.open(whatsappUrl, "_blank"); // Open WhatsApp share link
    // };

    return (
        <div className="mx-auto mt-2 overflow-hidden rounded-lg bg-white shadow-lg">
            {/* Image */}
            <div className="relative">
                <img
                    src={imageUrl}
                    alt="Post Image"
                    className="w-full object-cover"
                    width={width}
                    height={height}
                />
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Like and Share Buttons */}
                <div className="mb-2 flex items-center justify-start space-x-4">
                    <a
                        href={`https://wa.me/?text=${encodeURIComponent(
                            `See this 😍: ${title} - View it here: https://www.tafaria.com/image?id=${id}`,
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full bg-green-500 p-2 text-white"
                    >
                        <FiShare2 size={20} />
                    </a>
                </div>
                <h2 className="mt-4 pb-5 text-2xl font-semibold text-[#902729] sm:text-3xl">
                    {title}
                </h2>

                {/* Post Description */}
                <p className="leading-relaxed text-gray-700">{text}</p>
            </div>

            {/* Footer */}
            <div className="p-4 text-sm text-gray-400">
                <span>
                    {new Date(created_at).toLocaleDateString('en-US', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                    })}
                </span>
            </div>
        </div>
    );
};

export default PostCard;
