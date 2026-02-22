import { Offer } from '@/types';
import { useEffect, useState } from 'react';

interface Banner {
    id: string;
    src: string;
    description: string;
    alt: string;
}
interface BannerPopupProps {
    offers: Offer[];
}
const BannerPopup: React.FC<BannerPopupProps> = ({ offers }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    useEffect(() => {
        setTimeout(() => {
            if (offers && offers.length > 0) {
                setIsOpen(true);
            }
        }, 10000);
    }, [offers]);

    const banners: Banner[] =
        offers?.map((offer) => ({
            id: offer.id,
            src: offer.image_path || '',
            description: offer.description || '',
            alt: offer.name,
        })) || []; // Fallback to empty array if `offers` is undefined

    // Auto-rotate carousel
    // useEffect(() => {
    //   if (!isOpen) return;

    //   const interval = setInterval(() => {
    //     setCurrentSlide((prev) => (prev + 1) % banners.length || 0);
    //   }, 5000);

    //   return () => clearInterval(interval);
    // }, [isOpen]);

    const goToSlide = (indexs: number) => {
        setCurrentSlide(indexs);
    };

    const goToPrevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
    };

    const goToNextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
    };
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 600;

    return (
        <>
            {!isMobile && (
                <button
                    onClick={() => setIsOpen(true)}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={{
                        position: 'fixed',
                        right: '20px',
                        top: '50%',
                        zIndex: 1000,
                        padding: '18px 24px',
                        backgroundColor: '#902729',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: 'pointer',

                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease',
                        transform: isHovered
                            ? 'translateY(-50%) scale(1.05)'
                            : 'translateY(-50%) scale(1)',
                        animation: 'pulse 2s infinite',
                    }}
                >
                    {isHovered ? '✨ View Offers! ✨' : 'View Offers'}
                </button>
            )}

            {/* Beautiful Modal Popup with Carousel */}
            {isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        backdropFilter: 'blur(5px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        animation: 'fadeIn 0.3s ease-out',
                    }}
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        style={{
                            position: 'relative',
                            backgroundColor: 'white',
                            padding: '0px',
                            borderRadius: '20px',
                            maxWidth: '90%',
                            maxHeight: '90%',
                            width: '800px',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            animation:
                                'slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            overflow: 'hidden',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Awesome Close Button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{
                                position: 'absolute',
                                top: '15px',
                                right: '15px',
                                width: '40px',
                                height: '40px',
                                zIndex: 1001,
                                backgroundColor: 'white',
                                border: '2px solid #902729',
                                borderRadius: '50%',
                                color: '#902729',
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform =
                                    'rotate(90deg)';
                                e.currentTarget.style.backgroundColor =
                                    '#902729';
                                e.currentTarget.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform =
                                    'rotate(0deg)';
                                e.currentTarget.style.backgroundColor = 'white';
                                e.currentTarget.style.color = '#902729';
                            }}
                        >
                            ×
                        </button>

                        {/* Carousel Container */}
                        <div
                            style={{
                                position: 'relative',
                                width: '100%',
                                height: '100%',
                                overflow: 'hidden',
                            }}
                        >
                            {/* Carousel Slides */}
                            <div
                                style={{
                                    display: 'flex',
                                    transition: 'transform 0.5s ease',
                                    transform: `translateX(-${currentSlide * 100}%)`,
                                    height: '100%',
                                }}
                            >
                                {banners.map((banner, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            minWidth: '100%',
                                            height: '100%',
                                            position: 'relative',
                                            cursor: 'pointer', // Shows it's clickable
                                        }}
                                        onClick={() => {
                                            // WhatsApp booking link
                                            const phoneNumber = '+254708877244';
                                            const message = `${banner.description}`;
                                            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
                                                message,
                                            )}`;
                                            window.open(whatsappUrl, '_blank');
                                        }}
                                    >
                                        <img
                                            alt={banner.alt}
                                            width={800}
                                            height={500}
                                            src={banner.src}
                                            style={{
                                                width: '100%',
                                                height: 'auto',
                                                objectFit: 'contain',
                                                filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))',
                                                pointerEvents: 'none', // Ensures click works on parent div
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Navigation Arrows */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goToPrevSlide();
                                }}
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '20px',
                                    transform: 'translateY(-50%)',
                                    zIndex: 1001,
                                    width: '50px',
                                    height: '50px',
                                    backgroundColor: 'rgba(255,255,255,0.7)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    color: '#902729',
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.3s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                        '#902729';
                                    e.currentTarget.style.color = 'white';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                        'rgba(255,255,255,0.7)';
                                    e.currentTarget.style.color = '#902729';
                                }}
                            >
                                &lt;
                            </button>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goToNextSlide();
                                }}
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    right: '20px',
                                    transform: 'translateY(-50%)',
                                    zIndex: 1001,
                                    width: '50px',
                                    height: '50px',
                                    backgroundColor: 'rgba(255,255,255,0.7)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    color: '#902729',
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.3s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                        '#902729';
                                    e.currentTarget.style.color = 'white';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                        'rgba(255,255,255,0.7)';
                                    e.currentTarget.style.color = '#902729';
                                }}
                            >
                                &gt;
                            </button>

                            {/* Carousel Indicators */}
                            <div
                                style={{
                                    position: 'absolute',
                                    bottom: '20px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    display: 'flex',
                                    gap: '10px',
                                    zIndex: 1001,
                                }}
                            >
                                {banners.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            goToSlide(index);
                                        }}
                                        style={{
                                            width: '12px',
                                            height: '12px',
                                            borderRadius: '50%',
                                            border: 'none',
                                            backgroundColor:
                                                currentSlide === index
                                                    ? '#902729'
                                                    : 'rgba(255,255,255,0.5)',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                        }}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* CSS for animations */}
            <style>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(144, 39, 41, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(144, 39, 41, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(144, 39, 41, 0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
        </>
    );
};

export default BannerPopup;
