import {
    Art,
    ArtFacility,
    ArtsEnquiry,
    ArtsExperience,
    ArtsPackage,
} from '@/types';
import { useRef, useState } from 'react';

const WHATSAPP_NUMBER = 'YOURNUMBER';

interface ArtsEnquiryForm {
    name: string;
    phone: string;
    role: string;
    interest: string;
    message: string;
}

const STUDIOS = [
    { title: 'Fine art', sub: 'Drawing • painting' },
    { title: 'Sculpture', sub: 'Form • installation' },
    { title: 'Pottery', sub: 'Clay • kiln work' },
    { title: 'Fashion', sub: 'Design • making' },
    { title: 'Design studio', sub: 'Product • visual' },
    { title: 'Digital / software', sub: 'Creative tech' },
    { title: 'Recording', sub: 'Music • audio' },
    { title: 'Galleries', sub: 'Exhibitions' },
];

const EXPERIENCES = [
    {
        id: 'arts-walk',
        badge: 'Guided',
        badgeType: 'neutral',
        title: 'Arts & Studios Walk',
        subtitle: 'Guided walkthrough of studios, galleries and installations.',
        image: '/assets/arts.jpg',
        ctaLabel: 'Add to Plan',
        secondaryHref: 'book.html',
        secondaryLabel: 'Book',
    },
    {
        id: 'arts-workshop',
        badge: 'Hands-on',
        badgeType: 'gold',
        title: 'Short Workshop',
        subtitle: 'Try a guided creative activity (scheduled availability).',
        image: '/assets/goDreamArts.jpg',
        ctaLabel: 'Add to Plan',
        secondaryHref: 'book.html',
        secondaryLabel: 'Book',
    },
    {
        id: 'arts-commission',
        badge: 'Custom',
        badgeType: 'olive',
        title: 'Commission a piece',
        subtitle: 'Bring an idea — get matched to a Tafaria creative.',
        image: '/assets/art-studios.png',
        ctaLabel: 'Add to Plan',
        secondaryHref: '#inquiry',
        secondaryLabel: 'Enquire',
    },
] as const;

const CREATIVES = [
    {
        id: 'arts-residency',
        badge: 'Residency',
        badgeType: 'olive',
        title: 'Artist residency',
        subtitle: 'A focused period to create, collaborate and exhibit.',
    },
    {
        id: 'arts-studiohire',
        badge: 'Access',
        badgeType: 'neutral',
        title: 'Studio / workshop hire',
        subtitle:
            'Short-term or project-based access to studios and workshops.',
    },
    {
        id: 'arts-exhibit',
        badge: 'Showcase',
        badgeType: 'gold',
        title: 'Gallery & showcase',
        subtitle: 'Exhibitions, launches and small audience previews.',
    },
] as const;

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Inter:wght@400;500;600;700&display=swap');


  .row { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }



  .hr { border: none; border-top: 1px solid rgba(184,146,75,0.18); margin: 12px 0; }

  .strip {
    background: rgba(184,146,75,0.08);
    border: 1px solid rgba(184,146,75,0.22);
    border-radius: 16px; padding: 20px 22px;
  }
  .strip-divider { border: none; border-top: 1px solid rgba(184,146,75,0.2); margin: 10px 0; }
  .strip-row { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px; }

  .form-grid { display: grid; gap: 16px; grid-template-columns: 1fr 1fr; }
  @media (max-width: 560px) { .form-grid { grid-template-columns: 1fr; } }
  .field { display: flex; flex-direction: column; gap: 6px; }
  .field.full { grid-column: 1 / -1; }
  .label { font-size: 0.8rem; font-weight: 700; color: #5a3e2b; }

  .input, .select, .textarea {
    padding: 12px; border-radius: 12px;
    border: 1px solid rgba(184,146,75,0.3);
    background: rgba(255,255,255,0.85);
    font-family: inherit; font-size: 0.9rem; color: #2c1f10;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }
  .input:focus, .select:focus, .textarea:focus {
    outline: none; border-color: rgba(184,146,75,0.6);
    box-shadow: 0 0 0 3px rgba(184,146,75,0.12);
  }
  .textarea { min-height: 110px; resize: vertical; }

  .toast {
    position: fixed; bottom: 90px; right: 20px; z-index: 999;
    background: #7a5520; color: #fff;
    border-radius: 14px; padding: 12px 20px;
    font-weight: 600; font-size: 0.9rem;
    box-shadow: 0 6px 20px rgba(0,0,0,0.15);
    animation: pop 0.25s ease-out;
  }
  @keyframes pop {
    from { transform: translateY(10px); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
  }
`;

export default function ArtsPage({
    arts,
    artsPackages,
    artsExperiences,
    artsEnquiry,
    artFacilities,
}: {
    arts: Art[];
    artsPackages: ArtsPackage[];
    artsExperiences: ArtsExperience[];
    artsEnquiry: ArtsEnquiry[];
    artFacilities: ArtFacility[];
}) {
    const inquiryRef = useRef<HTMLElement>(null);
    const [toast, setToast] = useState('');
    const [form, setForm] = useState<ArtsEnquiryForm>({
        name: '',
        phone: '',
        role: 'Visitor',
        interest: 'Arts & Studios Walk',
        message: '',
    });

    function handleChange(field: keyof ArtsEnquiryForm, value: string) {
        setForm((f) => ({ ...f, [field]: value }));
    }

    function scrollToInquiry(prefill?: string) {
        if (prefill) {
            setForm((f) => ({
                ...f,
                message: f.message
                    ? f.message
                    : `Interested in: ${prefill}\n\n`,
            }));
        }
        inquiryRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    function showToast(msg: string) {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    }

    function buildWhatsAppMessage() {
        return encodeURIComponent(
            `Hello Tafaria Arts! 🎨\n\nName: ${form.name}\nPhone: ${form.phone}\nI am a: ${form.role}\nInterest: ${form.interest}\nMessage: ${form.message}`,
        );
    }

    function handleEmailSend() {
        if (!form.name.trim()) {
            showToast('Please enter your name or organization.');
            return;
        }
        const subject = encodeURIComponent(`Arts Enquiry — ${form.interest}`);
        const body = encodeURIComponent(
            `Name: ${form.name}\nPhone: ${form.phone}\nI am a: ${form.role}\nInterest: ${form.interest}\nMessage:\n${form.message}`,
        );
        window.location.href = `mailto:info@tafaria.com?subject=${subject}&body=${body}`;
    }

    return (
        <>
            <style>{styles}</style>
            <div className="container">
                <section className="section-sm">
                    <div className="container">
                        <span className="badge badge-gold">
                            Center for the Arts
                        </span>
                        <h1 className="h1">
                            {arts[0]?.title || 'Arts & Studios'}
                        </h1>
                        <p className="p-lg">
                            {arts[0]?.description ||
                                'A vibrant ecosystem of studios, galleries, and creative experiences.'}
                        </p>
                        <div className="row">
                            <a className="btn btn-primary" href="#experiences">
                                Explore arts experiences
                            </a>
                            <a className="btn btn-secondary" href="#studios">
                                Studios &amp; facilities
                            </a>
                        </div>
                    </div>
                </section>

                <section className="section">
                    <div className="container">
                        <h2 className="h2">Choose your arts path</h2>
                        <p className="p">
                            Different ways to engage - visitor, school group, or
                            creative.
                        </p>
                        <div className="grid-3">
                            {[
                                {
                                    badge: 'Visitors',
                                    badgeType: 'neutral',
                                    title: 'Art tours',
                                    desc: 'A guided walk through studios, installations and galleries.',
                                    sub: 'Ideal add-on to a day visit or stay.',
                                    cta: (
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() =>
                                                scrollToInquiry('Art tours')
                                            }
                                        >
                                            Add to Plan
                                        </button>
                                    ),
                                },
                                {
                                    badge: 'Schools',
                                    badgeType: 'gold',
                                    title: 'goDream Arts',
                                    desc: 'Hands-on sessions designed for learning outcomes.',
                                    sub: 'Perfect for CBC-aligned educational trips.',
                                    cta: (
                                        <a
                                            className="btn btn-secondary"
                                            href="schools.html"
                                        >
                                            Explore school programs
                                        </a>
                                    ),
                                },
                                {
                                    badge: 'Creatives',
                                    badgeType: 'olive',
                                    title: 'Residency & production',
                                    desc: 'Create, collaborate, record, exhibit, or commission work.',
                                    sub: 'For artists, teams and institutions.',
                                    cta: (
                                        <a
                                            className="btn btn-secondary"
                                            href="#creatives"
                                        >
                                            See creative support
                                        </a>
                                    ),
                                },
                            ].map(
                                ({
                                    badge,
                                    badgeType,
                                    title,
                                    desc,
                                    sub,
                                    cta,
                                }) => (
                                    <div key={title} className="card">
                                        <div className="card-pad">
                                            <span
                                                className={`badge badge-${badgeType}`}
                                            >
                                                {badge}
                                            </span>
                                            <div className="h3">{title}</div>
                                            <div className="small">{desc}</div>
                                            <hr className="hr" />
                                            <div
                                                className="small"
                                                style={{ marginBottom: 12 }}
                                            >
                                                {sub}
                                            </div>
                                            {cta}
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>
                    </div>
                </section>

                {/* Studios */}
                <section
                    id="studios"
                    className="section"
                    style={{ paddingTop: 0 }}
                >
                    <div className="container">
                        <h2 className="h2">Studios &amp; facilities</h2>
                        <p className="p">
                            A multi-disciplinary arts ecosystem — built for
                            learning, making, showcasing and collaboration.
                        </p>
                        <div className="grid-4">
                            {STUDIOS.map(({ title, sub }) => (
                                <div key={title} className="card">
                                    <div className="card-pad">
                                        <b
                                            style={{
                                                color: '#1a0f06',
                                                fontSize: '0.95rem',
                                            }}
                                        >
                                            {title}
                                        </b>
                                        <div
                                            className="small"
                                            style={{ marginTop: 4 }}
                                        >
                                            {sub}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Experiences */}
                <section
                    id="experiences"
                    className="section"
                    style={{ paddingTop: 0 }}
                >
                    <div className="container">
                        <h2 className="h2">Arts experiences</h2>
                        <p className="p">
                            Simple, bookable options for individuals, families
                            and groups.
                        </p>

                        <div className="grid-3">
                            {EXPERIENCES.map((exp) => (
                                <div key={exp.id} className="card">
                                    <div className="card-media">
                                        <img
                                            src={exp.image}
                                            alt={exp.title}
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="card-pad">
                                        <span
                                            className={`badge badge-${exp.badgeType}`}
                                        >
                                            {exp.badge}
                                        </span>
                                        <div className="h3">{exp.title}</div>
                                        <div className="small">
                                            {exp.subtitle}
                                        </div>
                                        <div
                                            className="row"
                                            style={{ marginTop: 14 }}
                                        >
                                            <button
                                                className="btn btn-secondary"
                                                onClick={() =>
                                                    scrollToInquiry(exp.title)
                                                }
                                            >
                                                {exp.ctaLabel}
                                            </button>
                                            <a
                                                className="btn btn-tertiary"
                                                href={exp.secondaryHref}
                                            >
                                                {exp.secondaryLabel}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="grid-2" style={{ marginTop: 20 }}>
                            <div className="strip">
                                <b style={{ color: '#1a0f06' }}>
                                    For events &amp; retreats
                                </b>
                                <div
                                    className="small"
                                    style={{ marginTop: 6, marginBottom: 12 }}
                                >
                                    Add a private art tour, studio session or
                                    showcase to your program.
                                </div>
                                <a
                                    className="btn btn-secondary"
                                    href="events.html#proposal"
                                >
                                    Request an event proposal
                                </a>
                            </div>
                            <div className="strip">
                                <b style={{ color: '#1a0f06' }}>
                                    For school groups
                                </b>
                                <div
                                    className="small"
                                    style={{ marginTop: 6, marginBottom: 12 }}
                                >
                                    We tailor arts exposure and hands-on
                                    sessions by age group and learning goals.
                                </div>
                                <a
                                    className="btn btn-secondary"
                                    href="schools.html#quote"
                                >
                                    Request a school quote
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Creatives */}
                <section
                    id="creatives"
                    className="section"
                    style={{ paddingTop: 0 }}
                >
                    <div className="container">
                        <h2 className="h2">For creatives</h2>
                        <p className="p">
                            Spaces and support for artists, makers, and creative
                            teams.
                        </p>
                        <div className="grid-3">
                            {CREATIVES.map((c) => (
                                <div key={c.id} className="card">
                                    <div className="card-pad">
                                        <span
                                            className={`badge badge-${c.badgeType}`}
                                        >
                                            {c.badge}
                                        </span>
                                        <div className="h3">{c.title}</div>
                                        <div className="small">
                                            {c.subtitle}
                                        </div>
                                        <hr className="hr" />
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() =>
                                                scrollToInquiry(c.title)
                                            }
                                        >
                                            Add to Plan
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Inquiry */}
                <section
                    id="inquiry"
                    ref={inquiryRef}
                    className="section"
                    style={{ paddingTop: 0 }}
                >
                    <div className="container">
                        <h2 className="h2">Arts enquiry</h2>
                        <div className="grid-2">
                            <div className="card">
                                <div className="card-pad-lg">
                                    <div className="form-grid">
                                        <div className="field">
                                            <label className="label">
                                                Name / Organization
                                            </label>
                                            <input
                                                className="input"
                                                placeholder="e.g., Your name / team"
                                                value={form.name}
                                                onChange={(e) =>
                                                    handleChange(
                                                        'name',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="field">
                                            <label className="label">
                                                Phone / WhatsApp
                                            </label>
                                            <input
                                                className="input"
                                                placeholder="+254..."
                                                value={form.phone}
                                                onChange={(e) =>
                                                    handleChange(
                                                        'phone',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="field">
                                            <label className="label">
                                                I am a...
                                            </label>
                                            <select
                                                className="select"
                                                value={form.role}
                                                onChange={(e) =>
                                                    handleChange(
                                                        'role',
                                                        e.target.value,
                                                    )
                                                }
                                            >
                                                <option>Visitor</option>
                                                <option>School</option>
                                                <option>Creative</option>
                                                <option>
                                                    Corporate / Event planner
                                                </option>
                                            </select>
                                        </div>
                                        <div className="field">
                                            <label className="label">
                                                Interest
                                            </label>
                                            <select
                                                className="select"
                                                value={form.interest}
                                                onChange={(e) =>
                                                    handleChange(
                                                        'interest',
                                                        e.target.value,
                                                    )
                                                }
                                            >
                                                <option>
                                                    Arts &amp; Studios Walk
                                                </option>
                                                <option>Short Workshop</option>
                                                <option>
                                                    Commission a piece
                                                </option>
                                                <option>
                                                    Residency / Studio access
                                                </option>
                                                <option>
                                                    Exhibition / Showcase
                                                </option>
                                            </select>
                                        </div>
                                        <div className="field full">
                                            <label className="label">
                                                Message
                                            </label>
                                            <textarea
                                                className="textarea"
                                                placeholder="Tell us what you need: dates, group size, creative brief, etc."
                                                value={form.message}
                                                onChange={(e) =>
                                                    handleChange(
                                                        'message',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div
                                        className="row"
                                        style={{ marginTop: 20 }}
                                    >
                                        <a
                                            className="btn btn-primary"
                                            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsAppMessage()}`}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Send on WhatsApp
                                        </a>
                                        <button
                                            className="btn btn-secondary"
                                            onClick={handleEmailSend}
                                        >
                                            Send on Email
                                        </button>
                                    </div>

                                    <div
                                        className="micro"
                                        style={{ marginTop: 10 }}
                                    >
                                        You can replace this with a real form
                                        endpoint later (Netlify Forms / Google
                                        Form / CRM).
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="strip">
                                    <b style={{ color: '#1a0f06' }}>
                                        Quick recommendations
                                    </b>
                                    <hr className="strip-divider" />
                                    {[
                                        'First-timers: Arts tour + museum',
                                        'Families: Arts tour + recreation',
                                        'Teams: Private art tour + activity add-on',
                                        'Creatives: Residency / studio access',
                                    ].map((item) => (
                                        <div
                                            key={item}
                                            className="small"
                                            style={{ marginBottom: 6 }}
                                        >
                                            • {item}
                                        </div>
                                    ))}
                                </div>

                                <div style={{ height: 16 }} />

                                <div className="strip">
                                    <b style={{ color: '#1a0f06' }}>
                                        Also explore
                                    </b>
                                    <div
                                        className="row"
                                        style={{ marginTop: 12 }}
                                    >
                                        <a
                                            className="btn btn-secondary"
                                            href="visit.html"
                                        >
                                            Visit
                                        </a>
                                        <a
                                            className="btn btn-secondary"
                                            href="events.html"
                                        >
                                            Events
                                        </a>
                                        <a
                                            className="btn btn-secondary"
                                            href="stay.html"
                                        >
                                            Stay
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {toast && <div className="toast">{toast}</div>}
            </div>
        </>
    );
}
