/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react'; // Add useState and useEffect

import { HeroSection as HeroSectionType, Offer, Video } from '@/types';
import CarouselHero from './carouselhero';

interface HeroSectionProps {
    heroSection: HeroSectionType[];
    offers: Offer[];
}
const HeroSection: React.FC<HeroSectionProps> = ({ heroSection, offers }) => {
    return (
        <div>
            <div className="flex">
                <CarouselHero
                    images={
                        heroSection[0]?.images?.map((image: any) => ({
                            title: image.title,
                            link: '',
                            url: image?.image_path || '',
                        })) || []
                    }
                    videos={
                        heroSection[0]?.videos?.map((video: Video) => ({
                            title: video.title,
                            link: '',
                            url: video?.video_path || '',
                        })) || []
                    }
                    videolinks={
                        heroSection[0]?.videolinks?.map((videolink: any) => ({
                            title: videolink.title,
                            link: videolink.link,
                            url: videolink?.video_path || '',
                        })) || []
                    }
                />
            </div>
        </div>
    );
};

const Hero: React.FC<HeroSectionProps> = ({ heroSection, offers }) => {
    return (
        <div className="items-center justify-items-center">
            <HeroSection heroSection={heroSection} offers={offers} />
        </div>
    );
};

export default Hero;
