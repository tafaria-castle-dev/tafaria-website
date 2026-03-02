import BookingEngine from '@/components/booking';
import Footer from '@/components/footer';
import HeaderAndStories from '@/components/HeaderAndStories';
import EventBookingModal from '@/components/new-components/RequestEventQuoteModal';
import SchoolQuoteModal from '@/components/new-components/RequestSchoolQuoteModal';
import SelectedDayVisitPackageModal from '@/components/new-components/SelectedDayVisitPackageModal';
import SelectedPackageModal from '@/components/new-components/SelectedPackageModal';
import RatesCart from '@/components/RatesCart';
import Stories from '@/components/stories';
import TableOfContents from '@/components/tableOfContents';
import WhatsAppButton from '@/components/WhatsAppButton';
import { BookingProvider, useBooking } from '@/hooks/BookingContext';
import { CartProvider } from '@/hooks/CartContext';
import { DropdownProvider } from '@/hooks/DropdownContext';
import { NavigationProvider } from '@/hooks/NavigationContext';
import { BookingCartProvider, useRatesBooking } from '@/hooks/RatesCartContext';
import {
    SelectedPackageProvider,
    useSelectedPackage,
} from '@/hooks/SelectedPackageContext';
import { ToCProvider } from '@/hooks/ToCContext';
import { Category, Metadata, Schemas } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import React from 'react';
import { FaTimes } from 'react-icons/fa';

interface AppLayoutProps {
    children: React.ReactNode;
    metadata: Metadata;
    schemas: Schemas;
    categories?: Category[];
}

const AppLayoutContent: React.FC<AppLayoutProps> = ({
    children,
    metadata,
    schemas,
    categories = [],
}) => {
    const { showBookingModal, setShowBookingModal } = useBooking();
    const finalMetadata = metadata;
    const { showCart } = useRatesBooking();
    const {
        showSelectedPackageModal,
        showDayVisitModal,
        showSchoolQuoteModal,
        showEventBookingModal,
    } = useSelectedPackage();
    const { component } = usePage();
    const isRestaurantMenu = component === 'restaurant-menu';
    return (
        <>
            <Head>
                <title>{finalMetadata.title}</title>
                <meta name="description" content={finalMetadata.description} />
                {finalMetadata.keywords && (
                    <meta
                        name="keywords"
                        content={finalMetadata.keywords.join(', ')}
                    />
                )}

                <meta
                    property="og:title"
                    content={finalMetadata.openGraph?.title}
                />
                <meta
                    property="og:description"
                    content={finalMetadata.openGraph?.description}
                />
                <meta
                    property="og:url"
                    content={finalMetadata?.openGraph?.url}
                />
                <meta
                    property="og:type"
                    content={finalMetadata.openGraph?.type}
                />

                {finalMetadata.openGraph?.images.map((image, index) => (
                    <meta
                        key={index}
                        property="og:image"
                        content={String(image.url)}
                    />
                ))}

                <meta
                    name="twitter:card"
                    content={finalMetadata.twitter?.card}
                />
                <meta
                    name="twitter:title"
                    content={finalMetadata.twitter?.title}
                />
                <meta
                    name="twitter:description"
                    content={finalMetadata.twitter?.description}
                />

                {finalMetadata.twitter?.images?.map((image, index) => (
                    <meta
                        key={index}
                        name="twitter:image"
                        content={String(image)}
                    />
                ))}

                <link
                    rel="canonical"
                    href={finalMetadata.alternates?.canonical}
                />
                <script
                    id="organization-schema"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: schemas?.organization }}
                />
                <script
                    id="local-business-schema"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: schemas?.localBusiness }}
                />
                <script
                    id="breadcrumb-schema"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: schemas?.breadcrumb }}
                />
                <script
                    id="site-navigation-schema"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: schemas?.siteNavigation,
                    }}
                />
                <script
                    id="json-ld-schema"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: schemas?.jsonLd }}
                />
            </Head>

            <NavigationProvider>
                <DropdownProvider>
                    <ToCProvider>
                        <div className="flex flex-col bg-white">
                            <HeaderAndStories>
                                <Stories categories={categories} />
                            </HeaderAndStories>
                            <CartProvider>{children}</CartProvider>
                            <TableOfContents />
                            <Footer />
                            {!isRestaurantMenu && <WhatsAppButton />}
                        </div>
                    </ToCProvider>
                </DropdownProvider>
            </NavigationProvider>

            {showBookingModal && (
                <div className="fixed inset-0 top-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="container px-1 py-4">
                        <div className="mx-auto flex max-h-[90vh] w-full flex-col rounded-lg bg-white">
                            <div className="flex w-full items-center justify-between border-b p-3">
                                <h3 className="text-lg font-medium text-black">
                                    When are you coming?
                                </h3>
                                <button
                                    onClick={() => setShowBookingModal(false)}
                                    className="p-3 text-gray-500 hover:text-gray-700"
                                >
                                    <FaTimes className="h-6 w-6" />
                                </button>
                            </div>
                            <div className="m-0 w-full flex-1 overflow-auto border-none p-0">
                                <BookingEngine />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showSelectedPackageModal && <SelectedPackageModal />}
            {showDayVisitModal && <SelectedDayVisitPackageModal />}
            {showSchoolQuoteModal && <SchoolQuoteModal />}
            {showEventBookingModal && <EventBookingModal />}

            {showCart && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="container flex max-h-[96vh] w-full max-w-7xl flex-col rounded-lg">
                        <div className="m-0 w-full flex-1 overflow-auto border-none px-2">
                            <RatesCart />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

const AppLayout: React.FC<AppLayoutProps> = (props) => {
    return (
        <BookingProvider>
            <BookingCartProvider>
                <SelectedPackageProvider>
                    <AppLayoutContent {...props} />
                </SelectedPackageProvider>
            </BookingCartProvider>
        </BookingProvider>
    );
};

export default AppLayout;
