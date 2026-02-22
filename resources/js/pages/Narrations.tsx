import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { Pause, Play, Volume2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface FilesViewProps {
    id: string;
    [key: string]: any;
}

const FilesViewPage: React.FC = () => {
    const { props } = usePage<FilesViewProps>();
    const { id } = props;
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [audioFile, setAudioFile] = useState<string | null>(null);

    useEffect(() => {
        const fetchNarration = async () => {
            try {
                const response = await axios.get(
                    `https://website-cms.tafaria.com/api/narrations/${id}`,
                );
                const data = response.data;
                setTitle(data.title);

                let filteredContent = data.content;
                if (filteredContent) {
                    filteredContent = filteredContent.replace(
                        /^description\s*/i,
                        '',
                    );
                }
                setContent(filteredContent);

                setAudioFile(data.audio ? `/appc/files/${data.audio}` : null);
            } catch (error) {
                console.error('Error fetching narration:', error);
            }
        };
        fetchNarration();
    }, [id]);

    const handlePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            setDuration(audioRef.current.duration || 0);
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="mx-auto max-w-7xl px-6 py-12">
                <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
                    <h1 className="mb-6 text-4xl leading-tight font-bold text-slate-900">
                        {title}
                    </h1>
                    <div className="prose prose-lg max-w-none">
                        <p className="text-justify leading-relaxed whitespace-pre-wrap text-slate-700">
                            {content}
                        </p>
                    </div>
                </div>

                {audioFile && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
                        <audio
                            ref={audioRef}
                            onTimeUpdate={handleTimeUpdate}
                            onLoadedMetadata={handleTimeUpdate}
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                        >
                            <source src={audioFile} type="audio/mpeg" />
                            Your browser does not support the audio element.
                        </audio>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handlePlayPause}
                                    className="flex h-14 w-14 transform items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl"
                                >
                                    {isPlaying ? (
                                        <Pause className="h-6 w-6 fill-white" />
                                    ) : (
                                        <Play className="ml-1 h-6 w-6 fill-white" />
                                    )}
                                </button>

                                <div className="flex-1">
                                    <div className="relative h-2 overflow-hidden rounded-full bg-slate-200">
                                        <div
                                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-100"
                                            style={{ width: `${progress}%` }}
                                        />
                                        <input
                                            type="range"
                                            min="0"
                                            max={duration}
                                            value={currentTime}
                                            onChange={(e) => {
                                                if (audioRef.current) {
                                                    audioRef.current.currentTime =
                                                        parseFloat(
                                                            e.target.value,
                                                        );
                                                }
                                            }}
                                            className="absolute top-0 left-0 h-full w-full cursor-pointer opacity-0"
                                        />
                                    </div>
                                    <div className="mt-2 flex justify-between text-sm text-slate-600">
                                        <span>{formatTime(currentTime)}</span>
                                        <span>{formatTime(duration)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Volume Control */}
                            <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
                                <Volume2 className="h-5 w-5 text-slate-600" />
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    defaultValue="1"
                                    onChange={(e) => {
                                        if (audioRef.current) {
                                            audioRef.current.volume =
                                                parseFloat(e.target.value);
                                        }
                                    }}
                                    className="h-2 w-32 cursor-pointer appearance-none rounded-full bg-slate-200 accent-blue-600"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FilesViewPage;
