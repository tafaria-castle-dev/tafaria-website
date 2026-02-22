import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

interface Video {
    id: string;
    title: string;
    description: string;
    video_path: string;
    created_at: string;
}
interface FilesViewProps {
    id: string;
    [key: string]: any;
}
const VideoDisplay: React.FC = () => {
    const { props } = usePage<FilesViewProps>();
    const { id } = props;
    const [video, setVideo] = useState<Video | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchVideo = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(
                    `https://website-cms.tafaria.com/api/videos/${id}`,
                );
                setVideo(response.data);
            } catch (error) {
                toast.error('Failed to load video');
            } finally {
                setIsLoading(false);
            }
        };
        fetchVideo();
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <motion.div
                    className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: 'linear',
                    }}
                />
            </div>
        );
    }

    if (!video) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <p className="text-gray-500">Video not found</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gray-100 py-8"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="rounded-lg bg-white p-6 shadow-lg">
                    <h1 className="mb-4 text-2xl font-bold text-gray-800 sm:text-3xl">
                        {video.title}
                    </h1>
                    <div
                        className="relative mb-6 w-full"
                        style={{ height: '70vh' }}
                    >
                        <video
                            src={video.video_path}
                            className="h-full w-full rounded-lg object-contain"
                            controls
                            autoPlay
                        />
                    </div>
                    <p className="mb-4 text-gray-600">{video.description}</p>
                </div>
            </div>
        </motion.div>
    );
};

export default VideoDisplay;
