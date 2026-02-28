import LoadingComponent from '@/components/loader';
import LandingPage from '@/components/new-components/Landing';
import TabComponent from '@/components/tabs';
import { useInertiaLoading } from '@/hooks/useInertiaLoading';
import {
    About,
    AdditionalDetail,
    Category,
    DayVisitPackage,
    EventPage,
    HeroSection,
    Image,
    Metadata,
    Offer,
    Package,
    Schemas,
    SchoolProgram,
} from '@/types';
import React from 'react';

interface HomeProps {
    abouts: About[];
    categories: Category[];
    images: Image[];
    offers: Offer[];
    heroSection: HeroSection[];
    schoolPrograms: SchoolProgram[];
    packages: Package[];
    metadata: Metadata;
    schemas: Schemas;
    additionalDetails: AdditionalDetail[];
    events: EventPage[];
    dayVisitPackages: DayVisitPackage[];
}

const Home: React.FC<HomeProps> = ({
    abouts,
    categories,
    additionalDetails,
    images,
    heroSection,
    schoolPrograms,
    packages,
    offers,
    events,
    dayVisitPackages,
}) => {
    const isLoading = useInertiaLoading();
    if (isLoading) {
        return <LoadingComponent />;
    }
    return (
        <>
            <LandingPage
                heroSection={heroSection}
                offers={offers}
                additionalDetails={additionalDetails}
                schoolPrograms={schoolPrograms}
                packages={packages}
                events={events}
                dayVisitPackages={dayVisitPackages}
                abouts={abouts}
            />
            <TabComponent images={images} categories={categories} />
        </>
    );
};

export default Home;
