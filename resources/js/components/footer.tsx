import { useEffect, useState } from 'react';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';

const Footer = () => {
    const [isMobileView, setIsMobileView] = useState(false);

    useEffect(() => {
        setIsMobileView(window.innerWidth < 640);
    }, []);
    return (
        <div
            id="footer"
            className={`w-full`}
            style={{
                backgroundImage: `url(/assets/flower-bg.png), url(/assets/flower-bg.png), url(/assets/flower-bg.png)`,
                backgroundPosition: '0% 40%, 50% 60%, 90% 30%',
                backgroundRepeat: 'no-repeat, no-repeat, no-repeat',
                backgroundSize:
                    'clamp(300px, 30vw, 600px) auto, clamp(300px, 30vw, 600px) auto, clamp(300px, 30vw, 600px) auto',
                backgroundColor: '#020202',
            }}
        >
            <div className="mx-auto flex max-w-screen-xl flex-col items-center justify-between gap-6 p-5 lg:flex-row">
                {/* Location Section */}

                <div className="flex flex-col">
                    {!isMobileView && (
                        <h1 className="text-white">
                            Tafaria Castle & Center for the Arts
                        </h1>
                    )}
                    <div className="flex items-center lg:flex-1">
                        <a
                            href="https://www.google.com/maps/search/Tafaria+Castle/@-0.1164533,36.6279602,17z?hl=en&entry=ttu&g_ep=EgoyMDI0MTIxMS4wIKXMDSoASAFQAw%3D%3D"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-white"
                        >
                            <p className="text-center text-white lg:text-left">
                                <span className="text-[#902729]">
                                    Location:
                                </span>{' '}
                                1910 Park Rise, off Asunder Road on Deighton
                                Downs Avenue along Nyeri Nyahururu Road
                            </p>
                        </a>
                    </div>
                </div>

                <div className="flex items-center gap-6 lg:gap-8">
                    <a href="/contact"></a>

                    <div className="flex items-center space-x-4">
                        <a
                            href="https://www.facebook.com/TafariaCaslteArts/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaFacebookF className="text-white transition-colors hover:text-[#902729]" />
                        </a>

                        <a
                            href="https://www.instagram.com/tafaria.castle/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaInstagram className="text-white transition-colors hover:text-[#902729]" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
