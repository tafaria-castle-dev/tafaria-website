import { useBooking } from '@/hooks/BookingContext';
import React, { useEffect, useRef, useState } from 'react';
import { FaPause, FaPlay } from 'react-icons/fa';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export interface Image {
    title: string;
    url: string;
    link: string;
}

export interface Video {
    title: string;
    url: string;
    link: string;
}

export interface VideoLinks {
    title: string;
    url: string;
    link: string;
}

export interface HeroSection {
    id: string;
    title: string;
    name: string;
    subtitle: string;
    priority?: number | null;
    images?: Image[] | null;
    videos?: Video[] | null;
    videolinks?: VideoLinks[] | null;
    created_at?: string | null;
    updated_at?: string | null;
    publishedAt?: string | null;
    status?: 'published' | 'draft' | 'archived' | null;
    slug: string;
}

interface CarouselsProps {
    images: Image[];
    videos: Video[];
    videolinks: VideoLinks[];
    heroTitle?: string;
    heroSubtitle?: string;
}

const Carousels: React.FC<CarouselsProps> = ({
    images,
    videos,
    videolinks,
    heroTitle,
    heroSubtitle,
}) => {
    const combinedUrls = [...images, ...videos];
    const [activeIndex, setActiveIndex] = useState(0);
    const [playingIndex, setPlayingIndex] = useState<number | null>(null);
    const [showControls, setShowControls] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const { showBookingModal, setShowBookingModal } = useBooking();
    const [userPaused, setUserPaused] = useState(false);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
    const logoUrl = '/logo.png';
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        videoRefs.current.forEach((video, index) => {
            if (video && index === activeIndex && !userPaused) {
                video
                    .play()
                    .catch((error) =>
                        console.error('Error playing video:', error),
                    );
            } else if (video) {
                video.pause();
                video.currentTime = 0;
            }
        });
    }, [activeIndex, userPaused]);

    const handleChange = (index: number) => {
        setActiveIndex(index);
        setPlayingIndex(null);
        setShowControls(false);
        setUserPaused(false);
    };

    const handleTogglePlayPause = (index: number) => {
        const video = videoRefs.current[index];
        if (!video) return;

        if (video.paused) {
            video
                .play()
                .catch((error) => console.error('Error playing video:', error));
            setPlayingIndex(index);
            setUserPaused(false);
        } else {
            video.pause();
            setPlayingIndex(null);
            setUserPaused(true);
        }
        showTemporaryControls();
    };

    const showTemporaryControls = () => {
        setShowControls(true);
        setTimeout(() => setShowControls(false), 3000);
    };

    return (
        <div className="carousel relative w-56 sm:w-full">
            <Carousel
                showThumbs={false}
                infiniteLoop
                autoPlay={playingIndex === null && !userPaused}
                showStatus={false}
                selectedItem={activeIndex}
                onChange={handleChange}
                swipeable={playingIndex === null}
                showIndicators={false}
            >
                {combinedUrls.map((media, index) => {
                    const isVideo = media.url.endsWith('.mp4');
                    return (
                        <div key={index} className="relative">
                            <div
                                className={`relative w-full ${isVideo ? 'cursor-pointer' : ''}`}
                                onClick={
                                    isVideo
                                        ? () => handleTogglePlayPause(index)
                                        : undefined
                                }
                            >
                                {isVideo ? (
                                    <div className="relative">
                                        <div className="flex w-full items-center justify-center">
                                            <div
                                                style={{
                                                    position: 'relative',
                                                    cursor: 'pointer',
                                                }}
                                                className="w-full"
                                            >
                                                <video
                                                    ref={(el) => {
                                                        videoRefs.current[
                                                            index
                                                        ] = el;
                                                    }}
                                                    src={media.url}
                                                    width="100%"
                                                    height="100%"
                                                    autoPlay
                                                    muted
                                                    loop
                                                    playsInline
                                                    onPlay={() =>
                                                        setPlayingIndex(index)
                                                    }
                                                    onPause={() => {
                                                        if (
                                                            playingIndex ===
                                                            index
                                                        ) {
                                                            setPlayingIndex(
                                                                null,
                                                            );
                                                        }
                                                    }}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        {logoUrl && (
                                            <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-start pl-6 sm:pl-10">
                                                <img
                                                    src={logoUrl}
                                                    alt="Logo"
                                                    style={{
                                                        width: isMobile
                                                            ? '130px'
                                                            : '350px',
                                                        height: 'auto',
                                                    }}
                                                />
                                            </div>
                                        )}
                                        {showControls &&
                                            index === activeIndex && (
                                                <div className="absolute inset-0 flex cursor-pointer items-center justify-center">
                                                    <div className="rounded-full bg-white p-3 shadow-lg">
                                                        {playingIndex ===
                                                        index ? (
                                                            <FaPause className="text-2xl text-[#902729]" />
                                                        ) : (
                                                            <FaPlay className="text-2xl text-[#902729]" />
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <img
                                            src={media.url}
                                            alt={media.title}
                                            className="h-full w-full object-cover"
                                            loading={
                                                index === 0 ? 'eager' : 'lazy'
                                            }
                                        />

                                        {logoUrl && (
                                            <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-start pl-6 sm:pl-10">
                                                <img
                                                    src={logoUrl}
                                                    alt="Logo"
                                                    style={{
                                                        width: isMobile
                                                            ? '130px'
                                                            : '350px',
                                                        height: 'auto',
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* {(heroTitle || heroSubtitle) && (
                                <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-end justify-end px-4 pb-8 text-center">
                                    <div className="w-full">
                                        {heroTitle && (
                                            <h1 className="mb-3 text-3xl font-bold text-white drop-shadow-lg sm:text-5xl">
                                                {heroTitle}
                                            </h1>
                                        )}
                                        {heroSubtitle && (
                                            <div
                                                className="mx-auto max-w-7xl text-2xl text-white drop-shadow-md sm:text-4xl [&_a]:underline [&_em]:italic [&_strong]:font-bold"
                                                dangerouslySetInnerHTML={{
                                                    __html: heroSubtitle,
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>
                            )} */}
                        </div>
                    );
                })}
            </Carousel>
        </div>
    );
};

export default Carousels;
