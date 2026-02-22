import PostCard from '@/components/post';
import { Image } from '@/types';

interface ImageDetailProps {
    image?: Image;
    error?: string;
}

export default function ImageDetail({ image, error }: ImageDetailProps) {
    if (error) {
        return (
            <>
                <div className="p-4 text-center">
                    <p>{error}</p>
                </div>
            </>
        );
    }

    if (!image) {
        return (
            <>
                <div className="p-4 text-center">
                    <p>No image found</p>
                </div>
            </>
        );
    }

    const imageWidth = image.width || 500;
    const imageHeight = image?.height || 500;
    const imageUrl = image.image_path || '';

    return (
        <>
            <div>
                <div className="flex items-center bg-white shadow-md">
                    <div className="mx-auto mt-16 max-w-2xl p-4">
                        <PostCard
                            created_at={image.updated_at || ''}
                            imageUrl={imageUrl}
                            text={image.description || ''}
                            title={image.title}
                            width={imageWidth}
                            height={imageHeight}
                            id={image.id}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
