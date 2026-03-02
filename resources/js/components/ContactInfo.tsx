import { useState } from 'react';

const PhoneIcon = () => (
    <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.92 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);

const MailIcon = () => (
    <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
);

export default function ContactInfo() {
    const [hoveredPhone, setHoveredPhone] = useState(false);
    const [hoveredEmail, setHoveredEmail] = useState(false);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
            }}
        >
            <a
                href="tel:0700151480"
                onMouseEnter={() => setHoveredPhone(true)}
                onMouseLeave={() => setHoveredPhone(false)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '5px 9px',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontSize: '12px',
                    fontWeight: 500,
                    letterSpacing: '0.01em',
                    color: hoveredPhone ? '#1a1a1a' : '#444',
                    background: hoveredPhone ? '#f3f4f6' : 'transparent',
                    transition: 'all 0.18s ease',
                    border: '1px solid',
                    borderColor: hoveredPhone ? '#d1d5db' : 'transparent',
                }}
            >
                <span
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '20px',
                        height: '20px',
                        borderRadius: '4px',
                        background: hoveredPhone ? '#1a1a1a' : '#e5e7eb',
                        color: hoveredPhone ? '#fff' : '#6b7280',
                        transition: 'all 0.18s ease',
                        flexShrink: 0,
                    }}
                >
                    <PhoneIcon />
                </span>
                0700 151 480
            </a>

            <a
                href="mailto:info@tafaria.com"
                onMouseEnter={() => setHoveredEmail(true)}
                onMouseLeave={() => setHoveredEmail(false)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '5px 9px',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontSize: '12px',
                    fontWeight: 500,
                    letterSpacing: '0.01em',
                    color: hoveredEmail ? '#1a1a1a' : '#444',
                    background: hoveredEmail ? '#f3f4f6' : 'transparent',
                    transition: 'all 0.18s ease',
                    border: '1px solid',
                    borderColor: hoveredEmail ? '#d1d5db' : 'transparent',
                }}
            >
                <span
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '20px',
                        height: '20px',
                        borderRadius: '4px',
                        background: hoveredEmail ? '#1a1a1a' : '#e5e7eb',
                        color: hoveredEmail ? '#fff' : '#6b7280',
                        transition: 'all 0.18s ease',
                        flexShrink: 0,
                    }}
                >
                    <MailIcon />
                </span>
                info@tafaria.com
            </a>
        </div>
    );
}
