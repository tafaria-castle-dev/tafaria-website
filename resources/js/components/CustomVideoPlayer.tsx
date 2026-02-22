import { useEffect, useRef, useState } from 'react';
import {
    FiMaximize,
    FiMinimize,
    FiPause,
    FiPlay,
    FiVolume2,
    FiVolumeX,
} from 'react-icons/fi';

interface CustomVideoPlayerProps {
    src: string;
    title: string;
    autoPlay?: boolean;
    muted?: boolean;
    loop?: boolean;
}

export default function CustomVideoPlayer({
    src,
    title,
    autoPlay = true,
    muted = true,
    loop = true,
}: CustomVideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(autoPlay);
    const [isMuted, setIsMuted] = useState(muted);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [isHovering, setIsHovering] = useState(false);
    const hideControlsTimer = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isHovering || !isPlaying) {
            setShowControls(true);
            if (hideControlsTimer.current) {
                clearTimeout(hideControlsTimer.current);
            }
        } else {
            hideControlsTimer.current = setTimeout(() => {
                setShowControls(false);
            }, 3000);
        }

        return () => {
            if (hideControlsTimer.current) {
                clearTimeout(hideControlsTimer.current);
            }
        };
    }, [isHovering, isPlaying]);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
            setVolume(newVolume);
            setIsMuted(newVolume === 0);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = parseFloat(e.target.value);
        if (videoRef.current) {
            videoRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div
            ref={containerRef}
            className="relative mx-auto overflow-hidden rounded-lg"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onMouseMove={() => {
                setIsHovering(true);
                setShowControls(true);
            }}
        >
            <video
                ref={videoRef}
                className="h-full max-h-150 w-full object-contain"
                autoPlay={autoPlay}
                muted={muted}
                loop={loop}
                playsInline
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onClick={togglePlay}
            >
                <source src={src} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

            <div
                className={`pointer-events-none absolute top-0 right-0 left-0 p-6 transition-opacity duration-300 ${
                    showControls ? 'opacity-100' : 'opacity-0'
                }`}
            >
                <h2 className="text-2xl font-bold text-white drop-shadow-lg md:text-4xl">
                    {title}
                </h2>
            </div>

            {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <button
                        onClick={togglePlay}
                        className="group flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white/30 md:h-24 md:w-24"
                        aria-label="Play video"
                    >
                        <FiPlay className="ml-1 text-4xl text-white md:text-5xl" />
                    </button>
                </div>
            )}

            <div
                className={`absolute right-0 bottom-0 left-0 transition-all duration-300 ${
                    showControls
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-full opacity-0'
                }`}
            >
                <div className="px-6 pb-2">
                    <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleSeek}
                        className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/30 accent-white transition-all hover:h-1.5"
                        style={{
                            background: `linear-gradient(to right, white ${(currentTime / duration) * 100}%, rgba(255,255,255,0.3) ${(currentTime / duration) * 100}%)`,
                        }}
                    />
                </div>

                <div className="flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent px-4 pt-2 pb-4 backdrop-blur-sm md:px-6">
                    <div className="flex items-center gap-3 md:gap-4">
                        <button
                            onClick={togglePlay}
                            className="group rounded-full p-2 transition-all hover:bg-white/20"
                            aria-label={isPlaying ? 'Pause' : 'Play'}
                        >
                            {isPlaying ? (
                                <FiPause className="text-xl text-white transition-transform group-hover:scale-110 md:text-2xl" />
                            ) : (
                                <FiPlay className="text-xl text-white transition-transform group-hover:scale-110 md:text-2xl" />
                            )}
                        </button>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={toggleMute}
                                className="group rounded-full p-2 transition-all hover:bg-white/20"
                                aria-label={isMuted ? 'Unmute' : 'Mute'}
                            >
                                {isMuted ? (
                                    <FiVolumeX className="text-xl text-white transition-transform group-hover:scale-110 md:text-2xl" />
                                ) : (
                                    <FiVolume2 className="text-xl text-white transition-transform group-hover:scale-110 md:text-2xl" />
                                )}
                            </button>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={isMuted ? 0 : volume}
                                onChange={handleVolumeChange}
                                className="hidden h-1 w-20 cursor-pointer appearance-none rounded-full bg-white/30 accent-white transition-all hover:h-1.5 md:block"
                                style={{
                                    background: `linear-gradient(to right, white ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.3) ${(isMuted ? 0 : volume) * 100}%)`,
                                }}
                            />
                        </div>

                        <span className="hidden text-sm font-medium text-white md:block">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                    </div>

                    <button
                        onClick={toggleFullscreen}
                        className="group rounded-full p-2 transition-all hover:bg-white/20"
                        aria-label={
                            isFullscreen ? 'Exit fullscreen' : 'Fullscreen'
                        }
                    >
                        {isFullscreen ? (
                            <FiMinimize className="text-xl text-white transition-transform group-hover:scale-110 md:text-2xl" />
                        ) : (
                            <FiMaximize className="text-xl text-white transition-transform group-hover:scale-110 md:text-2xl" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
