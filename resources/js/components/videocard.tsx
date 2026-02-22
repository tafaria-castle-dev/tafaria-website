import { FiShare2 } from "react-icons/fi";

interface VideoCardProps {
  title: string;
  description: string;
  videoUrl: string;
  id: string;
}

const VideoCard = ({ title, videoUrl, description, id }: VideoCardProps) => {
  return (
    <div className="flex justify-center items-center transition-opacity duration-300 my-5">
      <div className="relative w-full max-w-4xl ">
        <video
          src={videoUrl}
          className="object-contain"
          controls
          autoPlay={true}
        />
        <div className="absolute bottom-8 pb-20 right-4 flex  items-center">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              `See this 😍: ${title} - View it here: https://www.tafaria.com/video?id=${id}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-green-500 text-white rounded-full"
          >
            <FiShare2 size={24} />
          </a>
        </div>
        <div className="flex flex-col mt-3">
          <h2 className="text-black text-2xl font-bold ">{title}</h2>
          <p className="text-black text-sm  mb-10">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
