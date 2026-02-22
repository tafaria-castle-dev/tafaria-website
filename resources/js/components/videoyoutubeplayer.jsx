import { useState } from "react";

const VideoYouTubePlayer = ({ videoId }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  const videoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

  return (
    <div className="relative  mx-auto h-96">
      {!isPlaying ? (
        <div className="relative cursor-pointer h-full" onClick={() => setIsPlaying(true)}>
          <Image src={thumbnailUrl} alt="Video Thumbnail" className="w-full h-full object-cover rounded-lg" />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
            <button className="bg-red-600 text-white p-3 rounded-full shadow-lg">
              ▶
            </button>
          </div>
        </div>
      ) : (
        <iframe
          className="w-full h-full "
          width="100%"
          src={videoUrl}
          title="YouTube video player"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        ></iframe>
      )}
    </div>
  );
};

export default VideoYouTubePlayer;
