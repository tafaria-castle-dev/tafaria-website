import {
    AdditionalDetail,
    EventPage,
    HeroSection,
    Offer,
    Package,
    Program,
    SchoolProgram,
} from '@/types';

import { useState } from 'react';
import Hero from '../hero';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Inter:wght@400;500;600;700&display=swap');


  .h1 {
    font-family: 'Cinzel', serif;
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 700;
    line-height: 1.2;
    color: #1a0f06;
    margin-bottom: 18px;
  }

  .h2 {
    font-family: 'Cinzel', serif;
    font-size: clamp(1.5rem, 3vw, 2.2rem);
    font-weight: 600;
    color: #1a0f06;
    margin-bottom: 8px;
  }

  .h3 {
    font-family: 'Cinzel', serif;
    font-size: 1.15rem;
    font-weight: 600;
    color: #1a0f06;
  }

  .p-lg {
    font-size: 1.1rem;
    line-height: 1.7;
    color: #5a3e2b;
    margin-bottom: 24px;
  }

  .p {
    font-size: 1rem;
    line-height: 1.7;
    color: #5a3e2b;
    margin-bottom: 16px;
  }

  .small {
    font-size: 0.875rem;
    color: #6b4f35;
    line-height: 1.5;
  }

  .line { border: none; border-top: 1px solid rgba(184,146,75,0.2); margin: 0; }

  /* Buttons */
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 12px 22px;
    border-radius: 999px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    border: none;
    transition: transform 0.1s ease, box-shadow 0.2s ease, background 0.2s ease;
    white-space: nowrap;
  }
  .btn:hover { transform: translateY(-1px); }

  .btn-primary {
    background: linear-gradient(135deg, #b8924b, #8a6830);
    color: #fff;
    box-shadow: 0 4px 14px rgba(184,146,75,0.35);
  }
  .btn-primary:hover { box-shadow: 0 6px 20px rgba(184,146,75,0.5); }

  .btn-secondary {
    
    color: #5a3e2b;
    border: 1px solid rgba(90,62,43,0.25);
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }
  .btn-secondary:hover { background: #fbf7f0; }

  .btn-tertiary {
    background: rgba(184,146,75,0.12);
    color: #7a5520;
    border: 1px solid rgba(184,146,75,0.3);
  }
  .btn-tertiary:hover { background: rgba(184,146,75,0.22); }

  .row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
  }

  /* Badges */
  .badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .badge-gold {
    background: rgba(184,146,75,0.18);
    color: #7a5520;
    border: 1px solid rgba(184,146,75,0.4);
  }
  .badge-neutral {
    background: rgba(90,62,43,0.1);
    color: #5a3e2b;
    border: 1px solid rgba(90,62,43,0.2);
  }
  .badge-olive {
    background: rgba(100,120,60,0.12);
    color: #4a6030;
    border: 1px solid rgba(100,120,60,0.3);
  }

  /* Card */
  .card {
     border: 1px solid rgba(184,146,75,0.18);
    border-radius: 20px; overflow: hidden;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    width: 100% !important;
  }
  .card:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,0.1); }
  .card-media { height: 180px; overflow: hidden; }
  .card-media img { width:100%; height:100%; object-fit:cover; display:block; transition: transform 0.3s ease; }
  .card:hover .card-media img { transform: scale(1.04); }
  .card-pad { padding: 18px; }
  .card-pad-lg { padding: 28px; }


  /* Hero */
  .hero-grid {
    display: grid;
    gap: 24px;
    grid-template-columns: 1fr;
  }

  .hero-media {
    position: relative;
    border-radius: 24px;
    overflow: hidden;
    border: 1px solid rgba(184,146,75,0.2);
    min-height: 360px;
  }
  .hero-media img {
    width: 100%;
    height: 100%;
    min-height: 360px;
    object-fit: cover;
    display: block;
  }
  .hero-media::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(0,0,0,0.18), rgba(0,0,0,0.52));
    pointer-events: none;
  }
  .hero-badge {
    position: absolute;
    left: 16px;
    bottom: 16px;
    z-index: 1;
  }

  /* Grid */
  .grid-2 {
    display: grid;
    gap: 24px;
    grid-template-columns: repeat(2, 1fr);
  }

    .grid-4 { display: grid; gap: 20px; grid-template-columns: repeat(4,1fr); }
  .grid-3 { display: grid; gap: 20px; grid-template-columns: repeat(3,1fr); margin-top: 20px; }

  .grid-2 { display: grid; gap: 24px; grid-template-columns: repeat(2,1fr); }

  @media (max-width: 900px) {
    .grid-4 { grid-template-columns: repeat(2,1fr); }
    .grid-3 { grid-template-columns: repeat(2,1fr); }

    .grid-2 { grid-template-columns: 1fr; }
  }
  @media (max-width: 560px) {
    .grid-3 { grid-template-columns: 1fr; }
    .grid-4 { grid-template-columns: 1fr; }
  }

  /* Package card */
  

  .card-pad {
    padding: 24px;
  }

 

  /* Strip */
  .strip {
    background: rgba(184,146,75,0.08);
    border: 1px solid rgba(184,146,75,0.22);
    border-radius: 24px;
    padding: 32px;
  }

  .strip-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    flex-wrap: wrap;
    margin-bottom: 24px;
  }

  /* School cards */
  

  .meta-row { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
  .meta {
    font-size: 0.72rem;
    color: #7a5520;
    background: rgba(184,146,75,0.1);
    border: 1px solid rgba(184,146,75,0.2);
    border-radius: 999px;
    padding: 3px 9px;
    font-weight: 500;
  }

  .micro {
    font-size: 0.78rem;
    color: #b8924b;
    font-weight: 600;
    text-decoration: none;
  }
  .micro:hover { text-decoration: underline; }
`;

interface LandingPageProps {
    heroSection: HeroSection[];
    offers: Offer[];
    additionalDetails?: AdditionalDetail[];
    schoolPrograms: SchoolProgram[];
    packages: Package[];
    events: EventPage[];
}
function Badge({
    children,
    type,
}: {
    children: React.ReactNode;
    type?: 'gold' | 'neutral' | 'olive';
}) {
    const cls =
        type === 'olive'
            ? 'badge badge-olive'
            : type === 'neutral'
              ? 'badge badge-neutral'
              : 'badge badge-gold';
    return <span className={cls}>{children}</span>;
}

function SchoolCard({
    program,
    button_message,
}: {
    program: Program;
    button_message?: string;
}) {
    return (
        <div className="card">
            <div className="card-media">
                <img src={program.image} alt={program.title} loading="lazy" />
            </div>
            <div className="card-pad-sm">
                <Badge
                    type={
                        program.badge_content?.includes('Agriculture')
                            ? 'olive'
                            : program.badge_content?.includes('Skills')
                              ? 'gold'
                              : program.badge_content?.includes('Leadership')
                                ? 'gold'
                                : 'neutral'
                    }
                >
                    {program.badge_content}
                </Badge>
                <div className="h3" style={{ margin: '10px 0 6px' }}>
                    {program.title}
                </div>
                <div
                    className="small"
                    dangerouslySetInnerHTML={{
                        __html: program.description || '',
                    }}
                ></div>
                <div className="meta-row"></div>
                <div className="row" style={{ marginTop: 14 }}>
                    <a className="btn btn-secondary" href="#quote">
                        {button_message || 'Request Quote'}
                    </a>
                </div>
            </div>
        </div>
    );
}
interface PackagesCardsProps {
    activeTab?: string | null;
    onTabSelect?: (tabKey: string) => void;
    packages?: Package[];
}

export function toTabKey(title: string): string {
    return title.toLowerCase().trim().replace(/\s+/g, '-');
}

export const PackagesCards = ({
    onTabSelect,
    activeTab,
    packages,
}: PackagesCardsProps) => {
    const handleCardClick = (pkg: Package) => {
        const key = toTabKey(pkg.title);
        if (onTabSelect) {
            onTabSelect(key);
        } else {
            localStorage.setItem('tafaria-selected-tab', key);
            window.location.href = '/accommodation';
        }
    };
    return (
        <div className="grid-2" style={{ marginTop: 16 }}>
            {packages?.map((pkg) => {
                const key = toTabKey(pkg.title);
                const isActive = activeTab === key;
                return (
                    <div
                        className={`package-card ${activeTab === 'experiences' ? 'active' : ''}`}
                        key={pkg.id}
                    >
                        <div className="package-header">
                            <img
                                src={pkg.image}
                                alt={pkg.title}
                                loading="lazy"
                            />
                        </div>
                        <div className="card-pad">
                            <div className="h3" style={{ marginTop: 10 }}>
                                {pkg.title}
                            </div>
                            <div className="small">{pkg.subtitle}</div>

                            <div className="bullets">
                                {pkg.items?.map((packageItem) => (
                                    <div
                                        key={packageItem.title}
                                        className="bullet"
                                    >
                                        <div className="b-ic">
                                            {pkg.title.includes('Recreation')
                                                ? '➤'
                                                : '★'}
                                        </div>
                                        <div className="small">
                                            <strong>{packageItem.title}</strong>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="row" style={{ marginTop: 16 }}>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => handleCardClick(pkg)}
                                >
                                    {isActive
                                        ? 'Current Package'
                                        : pkg.button_message ||
                                          'Choose Package'}
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
export default function LandingPage({
    heroSection,
    offers,
    additionalDetails,
    schoolPrograms,
    packages,
    events,
}: LandingPageProps) {
    const [_highlightedPackage, setHighlightedPackage] = useState<
        string | null
    >(null);
    const detail = additionalDetails?.[0];
    function scrollToPackages(pkg: string) {
        setHighlightedPackage(pkg);
        document
            .getElementById('packages')
            ?.scrollIntoView({ behavior: 'smooth' });
    }

    return (
        <>
            <style>{styles}</style>
            <section className="section-sm">
                <div className="container">
                    <div className="hero-grid">
                        <div>
                            <h1 className="h1">
                                {heroSection[0]?.title ||
                                    'Welcome to Tafaria Castle'}
                            </h1>
                            <p
                                className="p-lg"
                                dangerouslySetInnerHTML={{
                                    __html:
                                        heroSection[0]?.subtitle ||
                                        'Visit for the day, stay overnight, bring a school, host an event, or apply for an art residency — Tafaria makes learning and leisure feel magical through its two packages below.',
                                }}
                            ></p>
                        </div>
                        <section id="packages" className="section">
                            <div className="container">
                                <h2 className="h2">
                                    Choose your Tafaria Package
                                </h2>
                                <p className="p">
                                    Start with a package, then choose how you
                                    want to enjoy it.
                                </p>

                                <PackagesCards packages={packages} />
                            </div>
                        </section>
                        <div className="hero-media card">
                            <Hero heroSection={heroSection} offers={offers} />

                            <div className="hero-badge">
                                <Badge type="gold">Once Upon a Dream</Badge>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section" style={{ paddingTop: 0 }}>
                <div className="container">
                    <div className="">
                        <div className="strip-header">
                            <div>
                                <h2 className="h2">
                                    {schoolPrograms[0]?.title}
                                </h2>
                                <p className="p" style={{ marginBottom: 0 }}>
                                    {schoolPrograms[0]?.subtitle ||
                                        'School Programs'}
                                </p>
                            </div>
                            <div className="row">
                                <a className="btn btn-primary" href="#quote">
                                    Request a school quote
                                </a>
                            </div>
                        </div>

                        <div className="grid-4">
                            {schoolPrograms[0]?.programs?.map((p) => (
                                <SchoolCard
                                    key={p.id}
                                    program={p}
                                    button_message={
                                        schoolPrograms[0]?.button_message
                                    }
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            <section className="section-sm">
                <div className="container">
                    <h1 className="h1">
                        {events[0]?.title || 'Host your event at Tafaria'}
                    </h1>
                    <p className="p-lg">
                        {events[0]?.subtitle ||
                            'Whether you are planning a corporate retreat, a team offsite, a wedding, or a family reunion, Tafaria offers a unique blend of inspiring spaces, delicious food, and memorable experiences to make your event truly special.'}
                    </p>
                </div>
            </section>

            <section id="packages" className="section">
                <div className="container">
                    <h2 className="h2">Event packages</h2>
                    <div className="grid-3">
                        {events[0]?.items?.map((pkg) => (
                            <div key={pkg.id} className="card">
                                <div className="card-media">
                                    <img
                                        src={pkg.image}
                                        alt={pkg.title}
                                        loading="lazy"
                                    />
                                </div>
                                <div className="card-pad">
                                    <span
                                        className={`badge badge-${
                                            pkg.badge_content?.includes('Day')
                                                ? 'olive'
                                                : pkg.badge_content?.includes(
                                                        'Popular',
                                                    )
                                                  ? 'gold'
                                                  : pkg.badge_content?.includes(
                                                          'Social',
                                                      )
                                                    ? 'gold'
                                                    : 'neutral'
                                        }`}
                                    >
                                        {pkg.badge_content}
                                    </span>
                                    <div className="h3">{pkg.title}</div>
                                    <div
                                        className="small"
                                        style={{ marginTop: 4 }}
                                    >
                                        {pkg.subtitle}
                                    </div>
                                    <hr className="hr" />
                                    <div
                                        className="small"
                                        dangerouslySetInnerHTML={{
                                            __html: pkg.description || '',
                                        }}
                                    ></div>
                                    <div style={{ height: 12 }} />
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => {}}
                                    >
                                        {events[0]?.button_message ||
                                            'Request Proposal'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {detail && (
                <section className="section" style={{ paddingTop: 0 }}>
                    <div className="container">
                        <div className="grid-2">
                            <div
                                className="card"
                                style={{
                                    overflow: 'hidden',
                                    width: '100%',
                                }}
                            >
                                <iframe
                                    title="Map to Tafaria"
                                    src="https://www.google.com/maps?q=Tafaria%20Castle%20Laikipia&output=embed"
                                    width="100%"
                                    height="360"
                                    style={{ border: 0, display: 'block' }}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>
                            <div className="strip">
                                <h2 className="h2" style={{ marginBottom: 6 }}>
                                    Plan your visit
                                </h2>
                                {detail.opening_hours && (
                                    <div
                                        className="small"
                                        style={{ marginBottom: 8 }}
                                    >
                                        <b>Opening hours:</b>{' '}
                                        {detail.opening_hours}
                                    </div>
                                )}
                                {detail.how_to_get_here_description && (
                                    <div
                                        className="small"
                                        style={{ marginBottom: 8 }}
                                    >
                                        <b>How to get here:</b>{' '}
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: detail.how_to_get_here_description,
                                            }}
                                        />
                                    </div>
                                )}
                                {detail.what_to_carry && (
                                    <div
                                        className="small"
                                        style={{ marginBottom: 8 }}
                                    >
                                        <b>What to carry:</b>{' '}
                                        {detail.what_to_carry}
                                    </div>
                                )}
                                <div style={{ height: 12 }} />
                                <div className="row">
                                    <a
                                        className="btn btn-secondary"
                                        href="/blogs/tafaria-frequently-asked-questions-faqs"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        See visitor FAQs
                                    </a>
                                    <a
                                        className="btn btn-tertiary"
                                        href="https://wa.me/+254708877244"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        WhatsApp
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}
