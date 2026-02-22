import { Image } from '@/types';
import React, { useRef, useState } from 'react';
import { FaPause, FaPlay } from 'react-icons/fa';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export interface Video {
    title: string;
    url: string;
}

interface CarouselsProps {
    images: Image[];
    videos: Video[];
}

const Carousels: React.FC<CarouselsProps> = ({ images, videos }) => {
    const combinedUrls = [...images, ...videos];
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [carouselHeight, setCarouselHeight] = useState<number | string>(
        'auto',
    );
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    // Handle slide change
    const handleChange = (index: number) => {
        if (isPlaying) return; // Prevent slide change while playing video
        setActiveIndex(index);
        updateCarouselHeight();
    };

    // Handle Play/Pause Toggle
    const handlePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
            updateCarouselHeight();
        }
    };

    // Ensure correct height when video loads
    const handleVideoLoaded = () => {
        setTimeout(() => {
            if (videoRef.current) {
                setCarouselHeight(videoRef.current.clientHeight + 25);
            }
        }, 100);
    };

    // Adjust height dynamically
    const updateCarouselHeight = () => {
        setTimeout(() => {
            if (containerRef.current) {
                setCarouselHeight(containerRef.current.clientHeight);
            }
        }, 100);
    };

    return (
        <div
            ref={containerRef}
            className="carousel rounded-box mb-4 w-56 bg-black sm:w-full"
            style={{ height: carouselHeight }}
        >
            <Carousel
                dynamicHeight={false}
                showThumbs={false}
                infiniteLoop
                autoPlay={!isPlaying}
                showStatus={false}
                selectedItem={activeIndex}
                onChange={handleChange}
                swipeable={!isPlaying}
            >
                {combinedUrls.map((media, index) => {
                    const isVideo = (media as Video).url?.endsWith?.('.mp4');
                    const mediaUrl = isVideo
                        ? (media as Video).url
                        : (media as Image).image_path;

                    return (
                        <div key={index} className="relative">
                            {isVideo ? (
                                <div>
                                    <video
                                        playsInline
                                        ref={videoRef}
                                        controls={false}
                                        onClick={handlePlayPause}
                                        onLoadedMetadata={handleVideoLoaded}
                                        width="100%"
                                        className="h-auto w-full object-cover transition duration-300"
                                    >
                                        <source
                                            src={mediaUrl || ''}
                                            type="video/mp4"
                                        />
                                        Your browser does not support the video
                                        tag.
                                    </video>

                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <button
                                            onClick={handlePlayPause}
                                            className="cursor-pointer rounded-full bg-white p-3 shadow-lg"
                                        >
                                            {isPlaying ? (
                                                <FaPause className="text-2xl text-[#902729]" />
                                            ) : (
                                                <FaPlay className="text-2xl text-[#902729]" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <img
                                    width={1000}
                                    height={100}
                                    src={mediaUrl || ''}
                                    alt={`Carousel image ${index + 1}`}
                                    className="w-full object-cover"
                                />
                            )}
                        </div>
                    );
                })}
            </Carousel>
        </div>
    );
};

export default Carousels;
