import React, { useState } from 'react';
import { Cinzel } from 'next/font/google';
import { useLeisureActivities } from '../features/activities/hooks/useOffers';

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: '400',
});

interface Activity {
  id: string;
  title: string;
  description?: string;
  image: {
    url: string;
  };
}

const LeisureTickets: React.FC = () => {
  const { data, isLoading, error } = useLeisureActivities();
  const [clickedId, setClickedId] = useState<string | null>(null);

  const handleImageClick = (activity: Activity) => {
    setClickedId(activity.id);
    
    // Send description to WhatsApp
    const message = encodeURIComponent(
      `I'm interested in this activity:\n\n${activity.description || activity.title}`
    );
    const whatsappUrl = `https://wa.me/254708877244?text=${message}`;
    window.open(whatsappUrl, '_blank');
    
    // Reset animation after 500ms
    setTimeout(() => setClickedId(null), 500);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error || !data) return <div>Failed to load activities</div>;
  
  return (
    <div className="bg-[#1b2a26] text-white py-10 px-5 lg:px-20">
      <div className="text-center mb-8">
        <h1 className={`text-3xl lg:text-5xl font-bold text-yellow-500 ${cinzel.className}`}>
          TAFARIA LEISURE TICKETS 
        </h1>
        <p className="mt-4 text-lg italic text-gray-300">
          Non-chargeable activities to inhouse guests: <span className="italic text-yellow-300">Kid&apos;s kingdom</span> (slides, swings, seesaw and Vikings pillow), Swimming, Outdoor gym
        </p>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 align-items-center justify-items-center">
          {data.map((activity, index) => (
            <img 
              key={activity.id}
              className={`
                object-contain md:object-cover
                transition-all duration-300
                hover:scale-105
                ${clickedId === activity.id ? 'animate-click' : ''}
                animate-fade-in
              `}
              style={{
                animationDelay: `${index * 0.1}s`,
                cursor: 'pointer'
              }}
              onClick={() => handleImageClick(activity)}
              src={activity.image.url}
              alt={activity?.title}
              loading="lazy"
            />
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes click {
          0% { transform: scale(1); }
          50% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        .animate-click {
          animation: click 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LeisureTickets;