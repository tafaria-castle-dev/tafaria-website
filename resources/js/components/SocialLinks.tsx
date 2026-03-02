import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

const FacebookIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
);

const InstagramIcon = () => (
    <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
);

const WhatsAppIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
);

const LocationIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
);

const socials = [
    {
        id: 'facebook',
        label: 'Facebook',
        href: 'https://www.facebook.com/TafariaCaslteArts/',
        icon: <FacebookIcon />,
        color: '#1877F2',
    },
    {
        id: 'instagram',
        label: 'Instagram',
        href: 'https://www.instagram.com/tafaria.castle/',
        icon: <InstagramIcon />,
        color: '#E1306C',
    },
    {
        id: 'whatsapp',
        label: 'WhatsApp',
        href: 'https://wa.me/+254708877244?text=Hello',
        icon: <WhatsAppIcon />,
        color: '#25D366',
    },
    {
        id: 'maps',
        label: 'Find Us',
        href: 'https://www.google.com/maps/search/Tafaria+Castle/@-0.1164533,36.6279602,17z',
        icon: <LocationIcon />,
        color: '#EA4335',
    },
];

export default function SocialLinks() {
    const [hovered, setHovered] = useState<string | null>(null);

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
            }}
        >
            {socials.map(({ id, label, href, icon, color }, i) => {
                const isHovered = hovered === id;
                return (
                    <motion.a
                        key={id}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={label}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            duration: 0.3,
                            delay: 0.1 * i,
                            type: 'spring',
                            stiffness: 300,
                            damping: 20,
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onMouseEnter={() => setHovered(id)}
                        onMouseLeave={() => setHovered(null)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '5px 7px',
                            borderRadius: '7px',
                            textDecoration: 'none',
                            background: isHovered
                                ? `${color}12`
                                : 'transparent',
                            border: '1px solid',
                            borderColor: isHovered
                                ? `${color}40`
                                : 'transparent',
                            color: isHovered ? color : '#555',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            transition:
                                'background 0.2s ease, border-color 0.2s ease, color 0.2s ease',
                        }}
                    >
                        <motion.span
                            animate={{
                                background: isHovered ? color : '#efefef',
                                color: isHovered ? '#fff' : '#666',
                            }}
                            transition={{ duration: 0.2 }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '20px',
                                height: '20px',
                                borderRadius: '5px',
                                flexShrink: 0,
                            }}
                        >
                            {icon}
                        </motion.span>

                        <AnimatePresence>
                            {isHovered && (
                                <motion.span
                                    key="label"
                                    initial={{
                                        opacity: 0,
                                        width: 0,
                                        marginLeft: -4,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        width: 'auto',
                                        marginLeft: 0,
                                    }}
                                    exit={{
                                        opacity: 0,
                                        width: 0,
                                        marginLeft: -4,
                                    }}
                                    transition={{
                                        duration: 0.2,
                                        ease: 'easeOut',
                                    }}
                                    style={{
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        letterSpacing: '0.02em',
                                        overflow: 'hidden',
                                        display: 'inline-block',
                                    }}
                                >
                                    {label}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.a>
                );
            })}
        </motion.div>
    );
}
