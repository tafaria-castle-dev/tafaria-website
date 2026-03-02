import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import ContactInfo from './ContactInfo';
import SocialLinks from './SocialLinks';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.05,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        },
    },
};

const Footer = () => {
    const [isMobileView, setIsMobileView] = useState(false);

    useEffect(() => {
        setIsMobileView(window.innerWidth < 640);
    }, []);

    return (
        <motion.div
            id="footer"
            className="header w-full border-t-2 border-amber-50 shadow-md"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                className="mx-auto flex max-w-screen-xl flex-col items-center justify-between gap-6 p-5 lg:flex-row"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                <motion.div variants={itemVariants}>
                    <Link href="/">
                        <motion.img
                            src="/logo.png"
                            width={120}
                            height={120}
                            alt="Tafaria Castle Logo"
                            className="h-17 w-17 sm:h-28 sm:w-28"
                            whileHover={{ scale: 1.05, rotate: 1 }}
                            transition={{
                                type: 'spring',
                                stiffness: 300,
                                damping: 18,
                            }}
                        />
                    </Link>
                </motion.div>

                <motion.div className="flex flex-col" variants={itemVariants}>
                    {!isMobileView && (
                        <motion.h1
                            className="text-black"
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                        >
                            Tafaria Castle & Center for the Arts
                        </motion.h1>
                    )}
                    <div className="flex items-center lg:flex-1">
                        <a
                            href="https://www.google.com/maps/search/Tafaria+Castle/@-0.1164533,36.6279602,17z?hl=en&entry=ttu&g_ep=EgoyMDI0MTIxMS4wIKXMDSoASAFQAw%3D%3D"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-black"
                        >
                            <p className="text-center text-black lg:text-left">
                                <span className="text-[#902729]">
                                    Location:
                                </span>{' '}
                                1910 Park Rise, off Asunder Road on Deighton
                                Downs Avenue along Nyeri Nyahururu Road
                            </p>
                        </a>
                    </div>
                </motion.div>

                {!isMobileView && (
                    <motion.div variants={itemVariants}>
                        <ContactInfo />
                    </motion.div>
                )}

                <motion.div variants={itemVariants}>
                    <SocialLinks />
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default Footer;
