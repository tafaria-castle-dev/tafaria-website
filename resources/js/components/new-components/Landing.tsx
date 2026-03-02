import { useSelectedPackage } from '@/hooks/SelectedPackageContext';
import {
    About,
    AdditionalDetail,
    Category,
    DayVisitPackage,
    DayVisitPackageItem,
    EventItem,
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
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import AboutsIntro from '../aboutsintro';
import Hero from '../hero';
import AboutTafaria from './AboutTafaria';
const styles = `


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



  /* Package card */
  


 

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
    abouts: About[];
    categories: Category[];
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
const DESCRIPTION_CHAR_LIMIT = 220;

export function ReadMoreText({
    text,
    limit = 180,
}: {
    text: string;
    limit?: number;
}) {
    const [expanded, setExpanded] = useState(false);
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

    if (!text) return null;

    const plainText = text.replace(/<[^>]*>/g, '');
    const shouldTruncate = isMobile && plainText.length > limit;
    const processedHtml = text
        .replace(/<h1([^>]*)>/gi, '<h1 class="h1"$1>')
        .replace(/<h2([^>]*)>/gi, '<h2 class="h2"$1>')
        .replace(/<h3([^>]*)>/gi, '<h3 class="h3"$1>');
    const buttonStyle = {
        background: 'none',
        border: 'none',
        padding: '0 0 0 6px',
        cursor: 'pointer',
        color: '#b8924b',
        fontWeight: 600,
        fontSize: '0.85rem',
    };

    if (shouldTruncate && !expanded) {
        return (
            <motion.div
                className="p"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
            >
                {plainText.slice(0, limit).trimEnd() + '…'}
                <button onClick={() => setExpanded(true)} style={buttonStyle}>
                    Read more
                </button>
            </motion.div>
        );
    }

    return (
        <div className="p">
            <AnimatePresence initial={false}>
                <motion.div
                    key="full-content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden' }}
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(processedHtml),
                    }}
                />
            </AnimatePresence>

            {shouldTruncate && expanded && (
                <motion.button
                    onClick={() => setExpanded(false)}
                    style={{
                        ...buttonStyle,
                        padding: '4px 0 0',
                        display: 'block',
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    Show less
                </motion.button>
            )}
        </div>
    );
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
    const [expanded, setExpanded] = useState(false);

    const rawDescription = program.description || '';
    const strippedText = rawDescription.replace(/<[^>]*>/g, '');
    const isLong = strippedText.length > DESCRIPTION_CHAR_LIMIT;

    return (
        <div
            className="card h-fit cursor-pointer"
            onClick={() => onRequestQuote(program)}
        >
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

                <div className="h4" style={{ margin: '10px 0 6px' }}>
                    {program.title}
                </div>

                <motion.div
                    animate={{ height: expanded ? 'auto' : '4.5em' }}
                    initial={false}
                    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                    style={{ overflow: 'hidden', position: 'relative' }}
                >
                    <div
                        className="small"
                        dangerouslySetInnerHTML={{
                            __html: rawDescription,
                        }}
                    />

                    <AnimatePresence>
                        {!expanded && isLong && (
                            <motion.div
                                key="fade"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: '2.5em',
                                    background:
                                        'linear-gradient(to bottom, transparent, white)',
                                    pointerEvents: 'none',
                                }}
                            />
                        )}
                    </AnimatePresence>
                </motion.div>

                {isLong && (
                    <motion.button
                        onClick={(e) => {
                            e.stopPropagation();
                            setExpanded((prev) => !prev);
                        }}
                        className="micro"
                        style={{
                            background: 'none',
                            border: 'none',
                            padding: '4px 0',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            marginTop: 4,
                        }}
                        whileTap={{ scale: 0.96 }}
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.span
                                key={expanded ? 'less' : 'more'}
                                initial={{ opacity: 0, y: expanded ? 4 : -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: expanded ? -4 : 4 }}
                                transition={{ duration: 0.18 }}
                            >
                                {expanded ? '↑ Show less' : '↓ Read more'}
                            </motion.span>
                        </AnimatePresence>
                    </motion.button>
                )}

                <div className="meta-row" />

                <div
                    className="row"
                    style={{
                        paddingTop: 16,
                        display: 'grid',
                        alignItems: 'center',
                    }}
                >
                    <button
                        className="btn btn-primary"
                        onClick={(e) => {
                            e.stopPropagation();
                            onRequestQuote(program);
                        }}
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
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleCardClick = (pkg: Package) => {
        if (onSelectPackage) onSelectPackage(pkg);
    };

    function getPackageTheme(title: string): 'red' | 'gold' {
        const t = title.toLowerCase();
        if (t.includes('immersion') || t.includes('experience')) return 'red';
        return 'gold';
    }

    function getPackageBadge(title: string): string {
        const t = title.toLowerCase();
        if (
            t.includes('immersion') ||
            t.includes('experience') ||
            t.includes('popular')
        )
            return 'Popular';
        return '';
    }

    return (
        <>
            <div className="pkg-grid-wrapper">
                <div className="pkg-or-circle">OR</div>
                {packages?.map((pkg) => {
                    const theme = getPackageTheme(pkg.title ?? '');
                    const badge = getPackageBadge(pkg.title ?? '');
                    const isActive = activeTab === pkg;

                    return (
                        <div
                            key={pkg.id}
                            className={`pkg-card-new${isActive ? 'active' : ''}`}
                            onClick={() => handleCardClick(pkg)}
                        >
                            <div className="pkg-card-media">
                                <img
                                    src={pkg.image}
                                    alt={pkg.title}
                                    loading="lazy"
                                />
                                {badge && (
                                    <span
                                        className={`pkg-badge-top pkg-badge-${theme === 'red' ? 'red' : 'gold'}`}
                                    >
                                        {badge}
                                    </span>
                                )}
                                <div
                                    className={`pkg-title-banner pkg-title-banner-${theme}`}
                                >
                                    <h3>{pkg.title}</h3>
                                    <h4 className="text-lg text-white sm:text-xl">
                                        {pkg.subtitle}
                                    </h4>
                                </div>
                            </div>

                            <div className="pkg-card-body">
                                <div
                                    className="pkg-rich-content"
                                    dangerouslySetInnerHTML={{
                                        __html: pkg.description || '',
                                    }}
                                />

                                <button
                                    className={`pkg-cta-${theme}`}
                                    style={{ marginTop: 18 }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCardClick(pkg);
                                    }}
                                >
                                    {isActive
                                        ? '✓ Current Package'
                                        : pkg.button_message
                                          ? `${pkg.button_message} →`
                                          : theme === 'red'
                                            ? 'Book Immersion Experience →'
                                            : 'Book Recreation Escape →'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
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
        <div className="grid-4" style={{ marginTop: 26 }}>
            {packages?.map((pkg) => {
                const title = pkg.title?.toLowerCase() ?? '';

                return (
                    <div
                        className={`package-card h-full`}
                        key={pkg.id}
                        style={{ display: 'flex', flexDirection: 'column' }}
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
                            {pkg.badge_content && (
                                <span
                                    className="pkg-badge-top pkg-badge-red"
                                    style={{
                                        position: 'absolute',
                                        top: 12,
                                        right: 12,
                                        zIndex: 2,
                                    }}
                                >
                                    {pkg.badge_content}
                                </span>
                            )}
                        </div>
                        <div
                            className="card-pad"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                flex: 1,
                            }}
                        >
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
                                className="small h-auto"
                                dangerouslySetInnerHTML={{
                                    __html: pkg.description || '',
                                }}
                            ></div>

                            <div
                                style={{
                                    marginTop: 'auto',
                                    paddingTop: 16,
                                    display: 'grid',
                                    alignItems: 'center',
                                }}
                            >
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
export function EventCard({
    pkg,
    events,
}: {
    pkg: EventItem;
    events: EventPage[];
}) {
    const { setShowEventBookingModal, setSelectedEventItem } =
        useSelectedPackage();

    const handleOpenEventBooking = (pkg: EventItem) => {
        setSelectedEventItem(pkg);
        setShowEventBookingModal(true);
    };
    return (
        <div
            key={pkg.id}
            className="card h-full cursor-pointer"
            style={{ display: 'flex', flexDirection: 'column' }}
            onClick={() => handleOpenEventBooking(pkg)}
        >
            <div className="card-media">
                <img src={pkg.image} alt={pkg.title} loading="lazy" />
            </div>
            <div
                className="card-pad"
                style={{ display: 'flex', flexDirection: 'column', flex: 1 }}
            >
                <span
                    className={`badge w-fit badge-${
                        pkg.badge_content?.includes('Day')
                            ? 'olive'
                            : pkg.badge_content?.includes('Popular')
                              ? 'gold'
                              : pkg.badge_content?.includes('Social')
                                ? 'gold'
                                : 'neutral'
                    }`}
                >
                    {pkg.badge_content}
                </span>
                <div className="h3">{pkg.title}</div>
                <div className="small pb-4" style={{ marginTop: 4 }}>
                    {pkg.subtitle}
                </div>

                <div
                    className="pkg-rich-content"
                    dangerouslySetInnerHTML={{
                        __html: pkg.description || '',
                    }}
                ></div>

                <div
                    style={{
                        marginTop: 'auto',
                        paddingTop: 16,
                        display: 'grid',
                        alignItems: 'center',
                    }}
                >
                    <button
                        className="btn btn-secondary"
                        onClick={() => handleOpenEventBooking(pkg)}
                    >
                        {events[0]?.button_message || 'Request Proposal'}
                    </button>
                </div>
            </div>
        </div>
    );
}
export default function LandingPage({
    heroSection,
    offers,
    additionalDetails,
    schoolPrograms,
    packages,
    events,
    dayVisitPackages,
    abouts,
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

    const processedHtml = rawHtml
        .replace(/<h1([^>]*)>/gi, '<h1 class="h1"$1>')
        .replace(/<h2([^>]*)>/gi, '<h3 class="rich-h2"$1>');
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
                <AboutsIntro abouts={abouts} />
            </div>
            <section className="section-sm">
                <div className="container">
                    <div className="hero-grid">
                        <section id="packages" className="">
                            <div className="container">
                                <div className="rich-text-content">
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: DOMPurify.sanitize(
                                                processedHtml,
                                            ),
                                        }}
                                        className="mx-auto flex max-w-6xl flex-col items-center justify-center text-center"
                                    ></div>
                                </div>
                                <PackagesCards
                                    packages={packages}
                                    onSelectPackage={handlePackageSelect}
                                />
                            </div>
                        </section>
                        <section id="packages" className="">
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

            <section className="section-sm" style={{ paddingTop: 0 }}>
                <div className="container">
                    <div className="">
                        <div className="strip-header">
                            <div>
                                <h2 className="h1">
                                    {schoolPrograms[0]?.title}
                                </h2>
                                <ReadMoreText
                                    text={
                                        schoolPrograms[0]?.subtitle ||
                                        'School Programs'
                                    }
                                    limit={200}
                                />
                            </div>
                            <div className="row">
                                <button
                                    className="btn btn-secondary"
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

                        <div>
                            {schoolPrograms[0]?.what_you_get_message && (
                                <div className="my-5 flex flex-col">
                                    <div className="h2">
                                        What you get with Each goDream program
                                    </div>
                                    <div
                                        className="pkg-rich-content centered"
                                        dangerouslySetInnerHTML={{
                                            __html: schoolPrograms[0]
                                                ?.what_you_get_message,
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="mt-6 flex items-center justify-center">
                            <a
                                className="btn btn-secondary"
                                href="/goDream/about-godream"
                                target="_blank"
                                rel="noreferrer"
                            >
                                More about Tafaria goDream Programs
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section
                id="packages"
                className="section-sm"
                style={{ paddingTop: 0 }}
            >
                <div className="container">
                    <div className="mb-3">
                        <h1 className="h1">
                            {events[0]?.title || 'Host your event at Tafaria'}
                        </h1>
                        <p className="p">
                            {events[0]?.subtitle ||
                                'Whether you are planning a corporate retreat, a team offsite, a wedding, or a family reunion, Tafaria offers a unique blend of inspiring spaces, delicious food, and memorable experiences to make your event truly special.'}
                        </p>
                    </div>
                    <h2 className="h2">Event packages</h2>
                    <div className="grid-3 mt-8">
                        {events[0]?.items?.map((pkg) => (
                            <EventCard pkg={pkg} events={events} />
                        ))}
                    </div>
                </div>
            </section>

            <section className="section-sm" style={{ paddingTop: 0 }}>
                <div className="container">
                    <div className="mb-8 flex flex-col">
                        <div className="h1">How to get here</div>
                        {additionalDetails &&
                            additionalDetails[0]
                                ?.how_to_get_here_description && (
                                <div
                                    className="pkg-rich-content"
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            additionalDetails[0]
                                                ?.how_to_get_here_description ||
                                            '',
                                    }}
                                />
                            )}
                    </div>
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
                            height="420"
                            style={{ border: 0, display: 'block' }}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </div>
            </section>
            <AboutTafaria abouts={abouts} />
        </>
    );
}
