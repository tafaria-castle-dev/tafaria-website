import { useSelectedPackage } from '@/hooks/SelectedPackageContext';
import {
    AdditionalDetail,
    DayVisitPackage,
    DayVisitPackageItem,
    EventPage,
    HeroSection,
    Offer,
    Package,
    Program,
    SchoolProgram,
} from '@/types';
import { RatesDescription } from '@/types/types';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';
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
    dayVisitPackages: DayVisitPackage[];
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

export function SchoolCard({
    program,
    button_message,
    onRequestQuote,
}: {
    program: Program;
    button_message?: string;
    onRequestQuote: (program: Program) => void;
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
                            : program.badge_content?.includes('Skills') ||
                                program.badge_content?.includes('Leadership')
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
                />
                <div className="meta-row" />
                <div className="row" style={{ marginTop: 14 }}>
                    <button
                        className="btn btn-secondary"
                        onClick={() => onRequestQuote(program)}
                    >
                        {button_message || 'Request Quote'}
                    </button>
                </div>
            </div>
        </div>
    );
}
interface PackagesCardsProps {
    activeTab?: Package | null;
    onSelectPackage?: (pkg: Package) => void;
    packages?: Package[];
}
interface DayVisitCardsProps {
    onButtonClick?: (tabKey: string) => void;
    packages?: DayVisitPackageItem[];
}

export function toTabKey(title: string): string {
    return title.toLowerCase().trim().replace(/\s+/g, '-');
}

export const PackagesCards = ({
    onSelectPackage,
    activeTab,
    packages,
}: PackagesCardsProps) => {
    const handleCardClick = (pkg: Package) => {
        if (onSelectPackage) {
            onSelectPackage(pkg);
            return;
        }
    };

    return (
        <div className="grid-2" style={{ marginTop: 16 }}>
            {packages?.map((pkg) => {
                const key = toTabKey(pkg.title);
                const isActive = activeTab === pkg;
                const title = pkg.title?.toLowerCase() ?? '';

                const isPopular =
                    title.includes('experience') ||
                    title.includes('immersion') ||
                    title.includes('popular');
                return (
                    <div
                        className={`package-card cursor-pointer ${activeTab === pkg ? 'active' : ''}`}
                        key={pkg.id}
                        onClick={() => handleCardClick(pkg)}
                    >
                        <div className="package-header">
                            <img
                                src={pkg.image}
                                alt={pkg.title}
                                loading="lazy"
                            />
                            {isPopular && (
                                <span
                                    className="rounded-4xl bg-[#902729] px-5 py-2 text-white"
                                    style={{
                                        position: 'absolute',
                                        bottom: 12,
                                        right: 12,
                                        zIndex: 2,
                                    }}
                                >
                                    Popular
                                </span>
                            )}
                            <div
                                className="h3 btn btn-secondary"
                                style={{
                                    marginTop: 10,
                                    position: 'absolute',
                                    top: 12,
                                    left: 12,
                                    zIndex: 2,
                                }}
                            >
                                {pkg.title}
                            </div>
                        </div>
                        <div className="card-pad">
                            <div
                                className="small"
                                dangerouslySetInnerHTML={{
                                    __html: pkg.description || '',
                                }}
                            ></div>

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
const DayVisitPackageCards = ({ packages }: DayVisitCardsProps) => {
    const paxLabel = (pax: number | null): string => {
        if (!pax) return '';
        if (pax === 1) return '/ person';
        return `/ group of ${pax}`;
    };

    const fmtPrice = (v: number | null) =>
        v != null
            ? Number(v).toLocaleString('en-KE', { minimumFractionDigits: 0 })
            : '';
    const { setSelectedDayVisitPackageItem, setShowDayVisitModal } =
        useSelectedPackage();
    return (
        <div className="grid-4" style={{ marginTop: 16 }}>
            {packages?.map((pkg) => {
                const title = pkg.title?.toLowerCase() ?? '';
                const isPopular =
                    title.includes('experience') ||
                    title.includes('immersion') ||
                    title.includes('popular');
                return (
                    <div
                        className={`package-card h-fit`}
                        key={pkg.id}
                        onClick={() => {
                            setSelectedDayVisitPackageItem(pkg);
                            setShowDayVisitModal(true);
                        }}
                    >
                        <div className="package-header">
                            <img
                                src={pkg.image || ''}
                                alt={pkg.title || ''}
                                loading="lazy"
                            />
                            {isPopular && (
                                <span
                                    className="rounded-4xl bg-[#902729] px-5 py-2 text-white"
                                    style={{
                                        position: 'absolute',
                                        top: 12,
                                        right: 12,
                                        zIndex: 2,
                                    }}
                                >
                                    Popular
                                </span>
                            )}
                        </div>
                        <div className="card-pad">
                            <div className="h3" style={{ marginTop: 10 }}>
                                {pkg.title}
                            </div>
                            <div
                                style={{
                                    marginBottom: 12,
                                    alignItems: 'center',
                                }}
                            >
                                <span
                                    style={{
                                        fontWeight: 600,
                                        fontSize: 22,
                                        color: '#1a1a1a',
                                    }}
                                >
                                    KES {fmtPrice(pkg.price)}
                                </span>
                                {pkg.pax && (
                                    <span
                                        style={{
                                            color: '#888',
                                            fontSize: 13,
                                            marginLeft: 5,
                                        }}
                                    >
                                        {paxLabel(pkg.pax)}
                                    </span>
                                )}
                            </div>
                            {pkg.price_per_extra_pax && (
                                <p
                                    style={{
                                        fontSize: 13,
                                        fontStyle: 'italic',
                                        color: '#555',
                                        marginBottom: 10,
                                    }}
                                >
                                    + KES {fmtPrice(pkg.price_per_extra_pax)}{' '}
                                    per extra person
                                </p>
                            )}
                            <div
                                className="small"
                                dangerouslySetInnerHTML={{
                                    __html: pkg.description || '',
                                }}
                            ></div>

                            <div className="row" style={{ marginTop: 16 }}>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setSelectedDayVisitPackageItem(pkg);
                                        setShowDayVisitModal(true);
                                    }}
                                >
                                    {pkg.button_message}
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
    dayVisitPackages,
}: LandingPageProps) {
    const [_highlightedPackage, setHighlightedPackage] = useState<
        string | null
    >(null);
    const detail = additionalDetails?.[0];

    const [ratesDescriptions, setRatesDescriptions] = useState<
        RatesDescription[]
    >([]);
    const TYPE_GROUPS = {
        introduction: ['introduction', 'two'],
    } as const;
    const findDescriptionByGroup = (
        descriptions: RatesDescription[],
        typeGroup: keyof typeof TYPE_GROUPS,
    ): RatesDescription | undefined => {
        const validTypes = TYPE_GROUPS[typeGroup];
        return descriptions.find((desc) =>
            validTypes.some(
                (type) =>
                    desc.type.toLowerCase().includes(type.toLowerCase()) ||
                    desc.description.toLowerCase().includes(type.toLowerCase()),
            ),
        );
    };

    const introductionDescription = findDescriptionByGroup(
        ratesDescriptions,
        'introduction',
    );
    const [isLoading, setIsLoading] = useState(true);
    const {
        setSelectedPackage,
        setShowSelectedPackageModal,
        setShowSchoolQuoteModal,
        setQuoteInitialProgram,
    } = useSelectedPackage();
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [descriptionsRes] = await Promise.all([
                    axios.get(
                        'https://website-cms.tafaria.com/api/rates-descriptions',
                    ),
                ]);

                setRatesDescriptions(descriptionsRes.data || []);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handlePackageSelect = (pkg: Package) => {
        setSelectedPackage(pkg);

        setShowSelectedPackageModal(true);
    };
    const rawHtml =
        introductionDescription?.description ||
        'Visit for the day, stay overnight, bring a school, host an event, or apply for an art residency — Tafaria makes learning and leisure feel magical through its two packages below.';

    const processedHtml = rawHtml.replace(/<h1([^>]*)>/gi, '<h2 class="h2"$1>');
    const handleRequestQuote = (program: Program) => {
        setQuoteInitialProgram(program);
        setShowSchoolQuoteModal(true);
    };

    const handleOpenSchoolQuoteAll = () => {
        setQuoteInitialProgram(null);
        setShowSchoolQuoteModal(true);
    };
    return (
        <>
            <style>{styles}</style>
            <div className="">
                <Hero heroSection={heroSection} offers={offers} />
            </div>
            <section className="section-sm">
                <div className="container">
                    <div className="hero-grid">
                        <section id="packages" className="section">
                            <div className="container">
                                <div className="rich-text-content">
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: DOMPurify.sanitize(
                                                processedHtml,
                                            ),
                                        }}
                                    ></div>
                                </div>
                                <PackagesCards
                                    packages={packages}
                                    onSelectPackage={handlePackageSelect}
                                />
                            </div>
                        </section>
                        <section id="packages" className="section">
                            <div className="container">
                                <h2 className="h2">
                                    {dayVisitPackages[0]?.title}
                                </h2>
                                <p
                                    className="p"
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            dayVisitPackages[0]?.subtitle || '',
                                    }}
                                ></p>
                                <DayVisitPackageCards
                                    packages={[
                                        ...(dayVisitPackages[0]?.items ?? []),
                                    ].sort((a, b) => {
                                        const priority = (title: string) =>
                                            /immersion|experience/i.test(title)
                                                ? 0
                                                : 1;
                                        return (
                                            priority(a.title ?? '') -
                                            priority(b.title ?? '')
                                        );
                                    })}
                                />
                            </div>
                        </section>
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
                                <button
                                    className="btn btn-primary"
                                    onClick={handleOpenSchoolQuoteAll}
                                >
                                    Request a school quote
                                </button>
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
                                    onRequestQuote={handleRequestQuote}
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
                                        className="btn btn-secondary"
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
