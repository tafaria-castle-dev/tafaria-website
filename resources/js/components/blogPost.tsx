import { Link } from '@inertiajs/react';
import React from 'react';
import { FiSend } from 'react-icons/fi';

export interface DocumentChild {
    text?: string;
    children?: DocumentChild[];
    data?: { id: string } | null;
    type?: string;
    relationship?: string;
    bold?: string;
}

export interface Document {
    type: string;
    children: DocumentChild[];
}

export interface Content {
    document: Document[];
}

interface BlogPostProps {
    type: string;
    slug: string;
    title: string;
    created_at: string;
    content: Content;
}

const BlogPost: React.FC<BlogPostProps> = ({
    type,
    slug,
    title,
    created_at,
    content,
}) => {
    const phoneNumber = '+254708877244';
    const message = `I would like to visit ${title}`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        message,
    )}`;

    return (
        <>
            <div>
                <div className="flex items-center bg-white">
                    <div className="container mx-auto mt-16 p-4">
                        <div
                            className={`font-barlow-condensed m-5 mx-auto mt-5 flex w-full flex-col rounded-lg bg-white p-5 shadow-lg transition-shadow duration-300 hover:shadow-xl`}
                        >
                            <h1 className="mt-2 ml-3 pb-5 text-2xl font-semibold text-[#902729] sm:text-3xl">
                                {title}
                            </h1>

                            <div className="flex flex-col justify-between px-4 pb-4">
                                <div>
                                    <div className="mb-2 flex items-center text-sm">
                                        <img
                                            width={18}
                                            height={18}
                                            src="/images/carlendar.svg"
                                            alt="SVG image"
                                        />
                                        <span
                                            className={`my-2 ml-2 text-gray-500`}
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

                                    <div
                                        className="prose text-gray-700"
                                        dangerouslySetInnerHTML={{
                                            __html: content,
                                        }}
                                    ></div>
                                </div>

                                <div className="mt-4 flex space-x-4">
                                    <Link
                                        href={whatsappUrl}
                                        target="_blank"
                                        className="flex items-center text-sm text-[#94723C] transition-colors duration-200 hover:text-[#b33235]"
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
                                    </Link>

                                    <a
                                        href={`https://wa.me/?text=${encodeURIComponent(
                                            `See this 😍: ${title} - View it here: https://www.tafaria.com/${type}/${slug}`,
                                        )}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="rounded-full bg-green-500 p-2 text-white"
                                    >
                                        <FiSend />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BlogPost;
