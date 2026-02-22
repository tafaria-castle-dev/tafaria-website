import { Image } from '@/types';
import React, { useEffect, useState } from 'react';
import { FiShare2 } from 'react-icons/fi';
import { useInView } from 'react-intersection-observer';

interface ImageGalleryProps {
    images: Image[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
    const [showScrollToTop, setShowScrollToTop] = useState(false);
    const [selectedImage, setSelectedImage] = useState<Image | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const sortedImages = [...images].sort(
        (a, b) => (a.priority ?? 0) - (b.priority ?? 0),
    );
    const [displayedImages, setDisplayedImages] = useState<Image[]>(
        sortedImages.slice(0, 50),
    );
    const hasNextPage = currentPage * 20 < images.length;

    const { ref: loadMoreRef } = useInView({
        threshold: 1.0,
        onChange: (inView) => {
            if (inView && hasNextPage) {
                setCurrentPage((prev) => prev + 1);
                setDisplayedImages(
                    sortedImages.slice(0, (currentPage + 1) * 20),
                );
            }
        },
    });

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollToTop(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const closeImageModal = () => {
        setSelectedImage(null);
    };

    if (!sortedImages || sortedImages.length === 0) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-gray-500">
                    No images available at the moment.
                </p>
            </div>
        );
    }

    return (
        <div>
            <div className="masonry mx-5">
                {displayedImages.map((image, index) => (
                    <div
                        key={index}
                        className="group relative mx-2 my-1 transform overflow-hidden rounded bg-white pb-0 shadow-lg transition-transform hover:scale-105"
                        onClick={() => setSelectedImage(image)}
                    >
                        <div className="masonry-item">
                            {image?.image_path && (
                                <img
                                    src={image.image_path || ''}
                                    alt={image.title || 'Image'}
                                    width={image.width || 500}
                                    height={image.height || 500}
                                    className="h-auto w-full"
                                />
                            )}
                        </div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 opacity-0 transition duration-300 group-hover:opacity-100">
                            <h3 className="px-3 text-center font-bold text-white">
                                {image.title}
                            </h3>
                            <p className="px-5 py-2 text-center text-sm text-gray-200">
                                {image.description?.substring(0, 500)}
                            </p>
                            <div className="mt-1 flex items-center space-x-4">
                                <a
                                    href={`https://wa.me/?text=${encodeURIComponent(
                                        `See this 😍: ${image.title} - View it here: https://www.tafaria.com/image?id=${image.id}`,
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-full bg-green-500 p-2 text-white"
                                    onClick={(e) => e.stopPropagation()}
                                    onMouseDown={(e) => e.stopPropagation()}
                                >
                                    <FiShare2 size={20} />
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div ref={loadMoreRef} className="mt-4 h-20"></div>
            {showScrollToTop && (
                <button
                    onClick={() =>
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                    }
                    className="fixed right-8 bottom-20 rounded-full bg-blue-600 p-3 text-white shadow-lg hover:bg-blue-700"
                >
                    ↑
                </button>
            )}
            {/* {selectedImage && (
                <div className="bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center bg-white">
                    <div className="relative w-3/4 max-w-4xl rounded-lg bg-white p-6">
                        <button
                            onClick={closeImageModal}
                            className="absolute top-4 left-4 rounded text-3xl text-[#902729]"
                        >
                            <FiX />
                        </button>
                        <h3 className="mt-4 mb-2 text-xl font-bold text-[#902729]">
                            {selectedImage.title}
                        </h3>
                        <div className="flex flex-col items-center">
                            <img
                                src={selectedImage.image_path || ''}
                                alt={selectedImage.title}
                                className="mb-4 h-auto max-h-96 w-full object-contain"
                            />
                            <p className="text-md mb-4 text-gray-700">
                                {selectedImage.description}
                            </p>
                            <div className="flex space-x-6">
                                <a
                                    href={`https://wa.me/?text=${encodeURIComponent(
                                        `See this 😍: ${selectedImage.title} - View it here: https://www.tafaria.com/image?id=${selectedImage.id}`,
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center rounded-full bg-green-500 p-2 text-white"
                                >
                                    <FiShare2 size={24} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )} */}
        </div>
    );
};

export default ImageGallery;
