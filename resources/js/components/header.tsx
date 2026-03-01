import { useBooking } from '@/hooks/BookingContext';
import { useRatesBooking } from '@/hooks/RatesCartContext';
import { Link } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { FaFacebook, FaInstagramSquare, FaWhatsapp } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';

const Header: React.FC = () => {
    const { showBookingModal, setShowBookingModal } = useBooking();
    const { setShowCart, cart } = useRatesBooking();
    const [isMobileView, setIsMobileView] = useState(false);

    useEffect(() => {
        setIsMobileView(window.innerWidth < 640);
    }, []);

    useEffect(() => {
        const stickyBar = document.getElementById('sticky-bar');
        if (stickyBar) {
            stickyBar.style.display = showBookingModal ? 'none' : 'block';
        }
    }, [showBookingModal]);

    return (
        <header
            className="header w-full shadow-md"
            // style={{
            //     backgroundImage: `url(/assets/flower-bg.png), url(/assets/flower-bg.png), url(/assets/flower-bg.png)`,
            //     backgroundPosition: '5% 40%, 50% 50%, 90% 35%',
            //     backgroundRepeat: 'no-repeat, no-repeat, no-repeat',
            //     backgroundSize:
            //         'clamp(300px, 30vw, 600px) auto, clamp(300px, 30vw, 600px) auto, clamp(300px, 30vw, 600px) auto',
            //     backgroundColor: '#020202',
            // }}
        >
            <div className="container mx-auto flex items-center justify-between px-4">
                <div className="flex items-center">
                    <Link href="/">
                        <img
                            src="/logo.png"
                            width={120}
                            height={120}
                            alt="Tafaria Castle Logo"
                            className="h-17 w-17 sm:h-28 sm:w-28"
                        />
                    </Link>
                    {!isMobileView && (
                        <h1 className="ml-2 text-black">
                            Tafaria Castle & Center for the Arts
                        </h1>
                    )}
                </div>
                <div className="flex items-center space-x-3">
                    <div className="hidden items-center space-x-4 md:flex">
                        <a
                            href="https://wa.me/+254708877244?text=Hello"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaWhatsapp
                                className="rounded-full p-2 text-black"
                                size={40}
                            />
                        </a>
                        <a
                            href="https://www.facebook.com/TafariaCaslteArts/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaFacebook
                                className="rounded-full p-2 text-black"
                                size={40}
                            />
                        </a>
                        <a
                            href="https://www.instagram.com/tafaria.castle/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaInstagramSquare
                                className="rounded-full p-2 text-black"
                                size={40}
                            />
                        </a>
                    </div>
                    <a
                        href="https://www.google.com/maps/search/Tafaria+Castle/@-0.1164533,36.6279602,17z?hl=en&entry=ttu&g_ep=EgoyMDI0MTIxMS4wIKXMDSoASAFQAw%3D%3D"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FaLocationDot
                            className="rounded-full p-2 text-black"
                            size={40}
                        />
                    </a>
                    <a href="tel:070015000" className="text-xs text-black">
                        0700151480
                    </a>
                    {!isMobileView && (
                        <a
                            href="mailto:info@tafaria.com"
                            className="text-xs text-black"
                        >
                            info@tafaria.com
                        </a>
                    )}
                    <button
                        onClick={() => setShowBookingModal(true)}
                        //onClick={() => (window.location.href = '/rates')}
                        className="flex items-center rounded-md bg-[#94723C] px-5 py-2 text-sm font-semibold text-white hover:bg-[#902729] sm:px-6 sm:py-2 sm:text-base"
                    >
                        Book
                    </button>
                    {cart.length > 0 && (
                        <button
                            onClick={() => setShowCart(true)}
                            className={`relative flex items-center rounded-md px-5 py-2 text-sm font-semibold text-black sm:px-6 sm:py-2 sm:text-base`}
                        >
                            <div className="relative">
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                <span className="absolute -top-2 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#902729] text-xs font-bold text-white">
                                    {cart.length}
                                </span>
                            </div>
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
