import React, { Suspense } from 'react';

import { HeroSection, Offer } from '@/types';
import Hero from './hero';
interface IntroProps {
    heroSection: HeroSection[];
    offers: Offer[];
}
const Introduction: React.FC<IntroProps> = ({ heroSection, offers }) => {
    return (
        <>
            <Suspense fallback={<div className="preloader">Loading...</div>}>
                <Hero heroSection={heroSection} offers={offers} />
            </Suspense>
        </>
    );
};

export default Introduction;
