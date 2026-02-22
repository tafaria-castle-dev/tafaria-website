import { Link } from '@inertiajs/react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { debounce } from 'lodash';
import { Search } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
interface Video {
    id: string;
    title: string;
    description: string;
    video_path: string;
    created_at: string;
}

const Videos: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
    const [sortField, setSortField] = useState<keyof Video>('created_at');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [showQRMap, setShowQRMap] = useState<Record<string, boolean>>({});
    const qrRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const logoUrl = '/logo.png';
    const [customLink, setCustomLink] = useState('');
    const [showCustomQRModal, setShowCustomQRModal] = useState(false);
    const [customQRValue, setCustomQRValue] = useState('');
    const customQrRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const fetchVideos = async () => {
            setIsFetching(true);
            try {
                const response = await axios.get(
                    `https://website-cms.tafaria.com/api/videos${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ''}`,
                );
                setFilteredVideos(response.data);
            } catch (error) {
                toast.error('Failed to fetch videos');
            } finally {
                setIsFetching(false);
            }
        };
        fetchVideos();
    }, [searchQuery]);

    const debouncedSearch = useCallback(
        debounce((value: string) => {
            setSearchQuery(value);
        }, 300),
        [],
    );

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        debouncedSearch(e.target.value);
    };

    const toggleQR = (id: string) => {
        setShowQRMap((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const generateQRWithLogo = async (videoId: string, title: string) => {
        const qrRef = qrRefs.current[videoId];
        if (!qrRef) return;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const qrSvg = qrRef.querySelector('svg');
        if (!qrSvg) return;
        const svgData = new XMLSerializer().serializeToString(qrSvg);
        const img = new Image();
        const svgBlob = new Blob([svgData], {
            type: 'image/svg+xml;charset=utf-8',
        });
        const url = URL.createObjectURL(svgBlob);
        img.onload = () => {
            canvas.width = 512;
            canvas.height = 512;
            ctx.drawImage(img, 0, 0, 512, 512);
            const logo = new Image();
            logo.crossOrigin = 'anonymous';
            logo.onload = () => {
                const logoSize = 102;
                const logoX = (512 - logoSize) / 2;
                const logoY = (512 - logoSize) / 2;
                ctx.fillStyle = 'white';
                ctx.fillRect(
                    logoX - 10,
                    logoY - 10,
                    logoSize + 20,
                    logoSize + 20,
                );
                ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
                canvas.toBlob((blob) => {
                    if (blob) {
                        const downloadUrl = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = downloadUrl;
                        const safeTitle = title
                            .replace(/[^a-z0-9]/gi, '_')
                            .toLowerCase();
                        a.download = `${safeTitle}_qr.png`;
                        a.click();
                        URL.revokeObjectURL(downloadUrl);
                    }
                });
            };
            logo.src = logoUrl;
            URL.revokeObjectURL(url);
        };
        img.src = url;
    };
    const generateCustomQRWithLogo = () => {
        if (!customLink.trim()) {
            toast.error('Please enter a valid link');
            return;
        }
        const cleanLink = customLink.trim();
        setCustomQRValue(cleanLink);
        setShowCustomQRModal(true);
    };
    const downloadCustomQR = () => {
        const qrRef = customQrRef.current;
        if (!qrRef) return;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const qrSvg = qrRef.querySelector('svg');
        if (!qrSvg) return;
        const svgData = new XMLSerializer().serializeToString(qrSvg);
        const img = new Image();
        const svgBlob = new Blob([svgData], {
            type: 'image/svg+xml;charset=utf-8',
        });
        const url = URL.createObjectURL(svgBlob);
        img.onload = () => {
            canvas.width = 512;
            canvas.height = 512;
            ctx.drawImage(img, 0, 0, 512, 512);
            const logo = new Image();
            logo.crossOrigin = 'anonymous';
            logo.onload = () => {
                const logoSize = 102;
                const logoX = (512 - logoSize) / 2;
                const logoY = (512 - logoSize) / 2;
                ctx.fillStyle = 'white';
                ctx.fillRect(
                    logoX - 10,
                    logoY - 10,
                    logoSize + 20,
                    logoSize + 20,
                );
                ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
                canvas.toBlob((blob) => {
                    if (blob) {
                        const downloadUrl = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = downloadUrl;
                        a.download = 'custom_video_qr.png';
                        a.click();
                        URL.revokeObjectURL(downloadUrl);
                    }
                });
            };
            logo.src = logoUrl;
            URL.revokeObjectURL(url);
        };
        img.src = url;
    };
    const sortedVideos = filteredVideos?.slice().sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        let compareA: string | number = aValue;
        let compareB: string | number = bValue;
        if (sortField === 'created_at') {
            compareA = new Date(aValue).getTime();
            compareB = new Date(bValue).getTime();
        } else {
            compareA = aValue?.toString().toLowerCase() || '';
            compareB = bValue?.toString().toLowerCase() || '';
        }
        if (compareA < compareB) return sortDirection === 'asc' ? -1 : 1;
        if (compareA > compareB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="container mx-auto rounded-lg bg-white p-4 shadow-lg sm:p-6"
        >
            <div className="mb-6 space-y-4">
                <h2 className="text-center text-3xl font-bold text-gray-800 sm:text-left sm:text-4xl">
                    Video Gallery 🎬
                </h2>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search
                            size={20}
                            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Search videos..."
                            className="w-full rounded-xl border-2 border-gray-200 bg-white py-3 pr-4 pl-12 text-base text-gray-700 transition-all placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none"
                            onChange={handleSearch}
                        />
                    </div>

                    <button
                        onClick={() => setShowCustomQRModal(true)}
                        className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#93723c]/70 to-[#93723c]/90 px-6 py-3 text-base font-medium text-white shadow-lg shadow-purple-200 transition-all hover:shadow-xl hover:shadow-purple-300 active:scale-95 sm:whitespace-nowrap"
                    >
                        <Link size={20} />
                        <span>Generate QR From Link</span>
                    </button>
                </div>
            </div>

            {isFetching && (
                <div className="flex justify-center">
                    <motion.div
                        className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{
                            repeat: Infinity,
                            duration: 1,
                            ease: 'linear',
                        }}
                    />
                </div>
            )}
            {!isFetching && !filteredVideos?.length && (
                <p className="text-center text-gray-500">No videos found</p>
            )}
            {!isFetching && filteredVideos?.length > 0 && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {sortedVideos?.map((video) => (
                        <Link
                            href={`/videos/${video.id}`}
                            key={video.id}
                            className="group overflow-hidden rounded-xl bg-white shadow-md transition-transform hover:scale-105"
                        >
                            <div className="relative aspect-video">
                                <video
                                    src={video.video_path}
                                    className="h-full w-full object-cover"
                                    muted
                                    onMouseOver={(e) => e.currentTarget.play()}
                                    onMouseOut={(e) => e.currentTarget.pause()}
                                />
                                <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100" />
                            </div>
                            <div className="p-4">
                                <h3 className="truncate text-lg font-semibold text-gray-800">
                                    {video.title}
                                </h3>
                                <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                                    {video.description}
                                </p>
                                <p className="mt-2 text-xs text-gray-400">
                                    {new Date(
                                        video.created_at,
                                    ).toLocaleDateString()}
                                </p>
                                <div className="mt-4 flex gap-3">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            toggleQR(video.id);
                                        }}
                                        className="rounded bg-[#902729] px-4 py-2 text-white hover:bg-[#902729]/90"
                                    >
                                        {showQRMap[video.id] ? 'Hide' : 'Show'}{' '}
                                        QR Code
                                    </button>
                                    {showQRMap[video.id] && (
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                generateQRWithLogo(
                                                    video.id,
                                                    video.title,
                                                );
                                            }}
                                            className="rounded bg-[#93723c] px-4 py-2 text-white hover:bg-[#93723c]/90"
                                        >
                                            Download QR Code
                                        </button>
                                    )}
                                </div>
                                {showQRMap[video.id] && (
                                    <div
                                        className="mt-6 flex justify-center"
                                        ref={(el) => {
                                            qrRefs.current[video.id] = el;
                                        }}
                                    >
                                        <QRCodeSVG
                                            value={`${window.location.origin}/videos/${video.id}`}
                                            size={256}
                                            level="H"
                                            imageSettings={{
                                                src: logoUrl,
                                                height: 48,
                                                width: 48,
                                                excavate: true,
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
            {showCustomQRModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
                    >
                        <h3 className="mb-4 text-xl font-bold text-gray-800">
                            Generate QR Code from Any Link
                        </h3>
                        <p className="mb-4 text-sm text-gray-600">
                            Paste a video link or any URL.
                        </p>
                        <input
                            type="text"
                            placeholder="https://your-video-link.com"
                            value={customLink}
                            onChange={(e) => setCustomLink(e.target.value)}
                            className="mb-4 w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-black focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowCustomQRModal(false)}
                                className="flex-1 rounded-lg bg-gray-300 py-3 text-gray-800 hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={generateCustomQRWithLogo}
                                className="flex-1 rounded-lg bg-purple-600 py-3 text-white hover:bg-purple-700"
                            >
                                Generate QR
                            </button>
                        </div>

                        {customQRValue && (
                            <div className="mt-6 flex flex-col items-center">
                                <div ref={customQrRef} className="mb-4">
                                    <QRCodeSVG
                                        value={customQRValue}
                                        size={256}
                                        level="H"
                                        imageSettings={{
                                            src: logoUrl,
                                            height: 48,
                                            width: 48,
                                            excavate: true,
                                        }}
                                    />
                                </div>
                                <button
                                    onClick={downloadCustomQR}
                                    className="rounded-lg bg-green-600 px-6 py-3 text-white hover:bg-green-700"
                                >
                                    Download QR Code
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
};

export default Videos;
