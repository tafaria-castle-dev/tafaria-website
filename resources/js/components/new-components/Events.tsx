import { EventAddon, EventPage } from '@/types';
import { useRef, useState } from 'react';

interface EventPackage {
    id: string;
    image: string;
    imageAlt: string;
    badge: string;
    badgeType: 'gold' | 'neutral' | 'olive';
    title: string;
    subtitle: string;
    includes: string;
}

interface AddOn {
    id: string;
    image: string;
    imageAlt: string;
    title: string;
    subtitle: string;
}

interface ProposalForm {
    organization: string;
    phone: string;
    eventType: string;
    guests: number;
    notes: string;
}

const WHATSAPP_NUMBER = 'YOURNUMBER';

const EVENT_PACKAGES: EventPackage[] = [
    {
        id: 'event-dayconf',
        image: '/assets/meeting Room.jpeg',
        imageAlt: 'Tafaria Meeting Room',
        badge: 'Day',
        badgeType: 'neutral',
        title: 'Day Conference',
        subtitle: 'Rooms optional',
        includes: 'Venue + catering options',
    },
    {
        id: 'event-retreat',
        image: '/assets/lords-room.png',
        imageAlt: 'Tafaria Accommodation',
        badge: 'Popular',
        badgeType: 'gold',
        title: 'Residential Retreat',
        subtitle: 'Stay + meeting + activities',
        includes: 'Rooms + sessions + add-ons',
    },
    {
        id: 'event-celebrate',
        image: '/assets/wedding-rides.jpeg',
        imageAlt: 'Tafaria Wedding Rides',
        badge: 'Social',
        badgeType: 'olive',
        title: 'Celebration',
        subtitle: 'Weddings • birthdays • reunions',
        includes: 'Venue + planning support',
    },
];

const ADD_ONS: AddOn[] = [
    {
        id: 'addon-archery',
        image: '/assets/archery.jpeg',
        imageAlt: 'Archery at Tafaria',
        title: 'Team Archery',
        subtitle: 'Fun + focus',
    },
    {
        id: 'addon-museum',
        image: '/assets/museum.jpeg',
        imageAlt: 'Tafaria Museum interior',
        title: 'Museum Private Tour',
        subtitle: 'Inspiration + story',
    },
    {
        id: 'addon-farmwalk',
        image: '/assets/nano farm.jpeg',
        imageAlt: 'Tafaria Nano Farm',
        title: 'Nano Farm Learning Tour',
        subtitle: 'Modern agriculture + design',
    },
    {
        id: 'addon-taxonomy',
        image: '/assets/herbarium.jpeg',
        imageAlt: 'Tafaria Herbarium',
        title: 'Tafaria Taxonomy Session',
        subtitle:
            'Turn your event into a shared leadership & life-skills moment.',
    },
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Inter:wght@400;500;600;700&display=swap');

  .h1 { font-family: 'Cinzel', serif; font-size: clamp(2rem,4vw,3rem); font-weight: 700; line-height: 1.2; color: #1a0f06; margin: 10px 0 14px; }
  .h2 { font-family: 'Cinzel', serif; font-size: clamp(1.3rem,3vw,1.9rem); font-weight: 600; color: #1a0f06; margin-bottom: 10px; }
  .h3 { font-family: 'Cinzel', serif; font-size: 1rem; font-weight: 600; color: #1a0f06; margin-top: 10px; }
  .p-lg { font-size: 1.1rem; line-height: 1.7; color: #5a3e2b; }
  .p   { font-size: 1rem;   line-height: 1.7; color: #5a3e2b; margin-bottom: 16px; }
  .small { font-size: 0.85rem; color: #6b4f35; line-height: 1.5; }

  .badge {
    display: inline-block; padding: 4px 12px; border-radius: 999px;
    font-size: 0.72rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;
  }
  .badge-gold    { background: rgba(184,146,75,0.18); color: #7a5520; border: 1px solid rgba(184,146,75,0.4); }
  .badge-neutral { background: rgba(90,62,43,0.1);   color: #5a3e2b; border: 1px solid rgba(90,62,43,0.2); }
  .badge-olive   { background: rgba(100,120,60,0.12); color: #4a6030; border: 1px solid rgba(100,120,60,0.3); }

  .row { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }


  .card {
    background: #fff; border: 1px solid rgba(184,146,75,0.18);
    border-radius: 20px; overflow: hidden;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .card:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,0.1); }
  .card-media { height: 180px; overflow: hidden; }
  .card-media img { width:100%; height:100%; object-fit:cover; display:block; transition: transform 0.3s ease; }
  .card:hover .card-media img { transform: scale(1.04); }
  .card-pad    { padding: 18px; }
  .card-pad-lg { padding: 28px; }

  .hr { border: none; border-top: 1px solid rgba(184,146,75,0.18); margin: 12px 0; }

  .grid-3 { display: grid; gap: 20px; grid-template-columns: repeat(3,1fr); margin-top: 20px; }
  .grid-4 { display: grid; gap: 20px; grid-template-columns: repeat(4,1fr); margin-top: 20px; }
  .grid-2 { display: grid; gap: 24px; grid-template-columns: repeat(2,1fr); margin-top: 20px; }

  @media (max-width: 900px) {
    .grid-3 { grid-template-columns: repeat(2,1fr); }
    .grid-4 { grid-template-columns: repeat(2,1fr); }
    .grid-2 { grid-template-columns: 1fr; }
  }
  @media (max-width: 560px) {
    .grid-3 { grid-template-columns: 1fr; }
    .grid-4 { grid-template-columns: 1fr; }
  }

  .strip {
    background: rgba(184,146,75,0.08);
    border: 1px solid rgba(184,146,75,0.22);
    border-radius: 20px; padding: 24px;
  }
  .strip-divider { border: none; border-top: 1px solid rgba(184,146,75,0.2); margin: 12px 0; }

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
    outline: none;
    border-color: rgba(184,146,75,0.6);
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

export default function EventsPage({
    events,
    eventAddons,
}: {
    events: EventPage[];
    eventAddons: EventAddon[];
}) {
    const proposalRef = useRef<HTMLElement>(null);
    const [toast, setToast] = useState('');
    const [form, setForm] = useState<ProposalForm>({
        organization: '',
        phone: '',
        eventType: 'Conference',
        guests: 30,
        notes: '',
    });

    function handleChange(field: keyof ProposalForm, value: string | number) {
        setForm((f) => ({ ...f, [field]: value }));
    }

    function scrollToProposal(prefillNote?: string) {
        if (prefillNote) {
            setForm((f) => ({
                ...f,
                notes: f.notes ? f.notes : `Interested in: ${prefillNote}\n\n`,
            }));
        }
        proposalRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    function showToast(msg: string) {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    }

    function buildWhatsAppMessage() {
        return encodeURIComponent(
            `Hello Tafaria! 👋\n\nOrganization: ${form.organization}\nPhone: ${form.phone}\nEvent type: ${form.eventType}\nGuests: ${form.guests}\nNotes: ${form.notes}`,
        );
    }

    function handleEmailSend() {
        if (!form.organization.trim()) {
            showToast('Please enter your organization or name.');
            return;
        }
        const subject = encodeURIComponent(
            `Event Proposal Request — ${form.organization}`,
        );
        const body = encodeURIComponent(
            `Organization: ${form.organization}\nPhone: ${form.phone}\nEvent type: ${form.eventType}\nGuests: ${form.guests}\nNotes:\n${form.notes}`,
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
                            Corporate • Social • Retreats
                        </span>
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
                                                pkg.badge_content?.includes(
                                                    'Day',
                                                )
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
                                            onClick={() =>
                                                scrollToProposal(pkg.title)
                                            }
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
                {eventAddons.length > 0 &&
                    eventAddons?.map((eventAddon) => (
                        <section className="section" style={{ paddingTop: 0 }}>
                            <div className="container">
                                <h2 className="h2">{eventAddon.title}</h2>
                                <p className="p">
                                    {eventAddon.subtitle ||
                                        'Enhance your event with unique add-on experiences.'}
                                </p>
                                <div className="grid-4">
                                    {eventAddon?.addons?.map((addon) => (
                                        <div key={addon.id} className="card">
                                            <div className="card-media">
                                                <img
                                                    src={addon.image}
                                                    alt={addon.title}
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div className="card-pad">
                                                <div
                                                    className="h3"
                                                    style={{
                                                        marginTop: 0,
                                                        marginBottom: 4,
                                                    }}
                                                >
                                                    {addon.title}
                                                </div>
                                                <div className="small">
                                                    {addon.subtitle}
                                                </div>
                                                <div
                                                    className="row"
                                                    style={{ marginTop: 12 }}
                                                >
                                                    <button
                                                        className="btn btn-secondary"
                                                        onClick={() =>
                                                            scrollToProposal(
                                                                addon.title,
                                                            )
                                                        }
                                                    >
                                                        {events[0]
                                                            ?.button_message ||
                                                            'Request Proposal'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    ))}

                <section
                    id="proposal"
                    ref={proposalRef}
                    className="section"
                    style={{ paddingTop: 0 }}
                >
                    <div className="container">
                        <h2 className="h2">Request a proposal</h2>
                        <div className="grid-2">
                            <div className="card">
                                <div className="card-pad-lg">
                                    <div className="form-grid">
                                        <div className="field">
                                            <label className="label">
                                                Organization / Name
                                            </label>
                                            <input
                                                className="input"
                                                placeholder="e.g., Company / Group name"
                                                value={form.organization}
                                                onChange={(e) =>
                                                    handleChange(
                                                        'organization',
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
                                                Event type
                                            </label>
                                            <select
                                                className="select"
                                                value={form.eventType}
                                                onChange={(e) =>
                                                    handleChange(
                                                        'eventType',
                                                        e.target.value,
                                                    )
                                                }
                                            >
                                                <option>Conference</option>
                                                <option>Retreat</option>
                                                <option>Celebration</option>
                                                <option>Other</option>
                                            </select>
                                        </div>
                                        <div className="field">
                                            <label className="label">
                                                Estimated guests
                                            </label>
                                            <input
                                                className="input"
                                                type="number"
                                                min={1}
                                                value={form.guests}
                                                onChange={(e) =>
                                                    handleChange(
                                                        'guests',
                                                        Math.max(
                                                            1,
                                                            Number(
                                                                e.target.value,
                                                            ),
                                                        ),
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="field full">
                                            <label className="label">
                                                Notes
                                            </label>
                                            <textarea
                                                className="textarea"
                                                placeholder="Dates, rooms needed, AV needs, activities, etc."
                                                value={form.notes}
                                                onChange={(e) =>
                                                    handleChange(
                                                        'notes',
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
                                            Request via Email
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="strip">
                                    <b style={{ color: '#1a0f06' }}>
                                        Typical proposal includes
                                    </b>
                                    <hr className="strip-divider" />
                                    {[
                                        'Venue options + capacities',
                                        'Catering menus',
                                        'Room blocks (if needed)',
                                        'Add-on experiences',
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
                                        Need it quickly?
                                    </b>
                                    <div
                                        className="small"
                                        style={{ margin: '8px 0 14px' }}
                                    >
                                        WhatsApp us your date + guest number and
                                        we'll respond with options.
                                    </div>
                                    <a
                                        className="btn btn-secondary"
                                        href={`https://wa.me/${WHATSAPP_NUMBER}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        WhatsApp now
                                    </a>
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
