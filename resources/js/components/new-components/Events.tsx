import { EventAddon, EventPage, Package } from '@/types';
import { useRef, useState } from 'react';
import { EventCard } from './Landing';
import { getTabType } from './SelectedPackageModal';

interface ProposalForm {
    organization: string;
    phone: string;
    email: string;
    eventType: string;
    guests: number;
    notes: string;
}

const WHATSAPP_NUMBER = '+254708877244';
const EMAIL_ADDRESS = 'info@tafaria.com';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Inter:wght@400;500;600;700&display=swap');


  .hr { border: none; border-top: 1px solid rgba(184,146,75,0.18); margin: 12px 0; }


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
    width: 100%; box-sizing: border-box;
  }
  .input:focus, .select:focus, .textarea:focus {
    outline: none;
    border-color: rgba(184,146,75,0.6);
    box-shadow: 0 0 0 3px rgba(184,146,75,0.12);
  }
  .textarea { min-height: 110px; resize: vertical; }

  .proposal-actions {
    display: flex; align-items: center; gap: 10px;
    margin-top: 20px; flex-wrap: wrap;
  }
  .btn-whatsapp {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 12px 20px; border-radius: 12px; border: none;
    background: #25D366; color: #fff;
    font-size: 0.92rem; font-weight: 700; cursor: pointer;
    font-family: inherit; text-decoration: none;
    box-shadow: 0 3px 12px rgba(37,211,102,0.3);
    transition: all 0.15s ease;
  }
  .btn-whatsapp:hover { box-shadow: 0 5px 18px rgba(37,211,102,0.45); transform: translateY(-1px); }
  .btn-email {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 11px 20px; border-radius: 12px;
    background: #fff; color: #5a3e2b;
    border: 1.5px solid rgba(184,146,75,0.4);
    font-size: 0.92rem; font-weight: 700; cursor: pointer;
    font-family: inherit; text-decoration: none;
    transition: all 0.15s ease;
  }
  .btn-email:hover { border-color: rgba(184,146,75,0.7); background: rgba(255,251,240,0.8); transform: translateY(-1px); }
  .actions-divider { font-size: 0.78rem; color: #9a7d5a; font-weight: 600; }

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

const WhatsAppIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);

const EmailIcon = () => (
    <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
);

export default function EventsPage({
    events,
    eventAddons,
    packages,
}: {
    events: EventPage[];
    eventAddons: EventAddon[];
    packages: Package[];
}) {
    const proposalRef = useRef<HTMLElement>(null);
    const [toastMsg, setToastMsg] = useState('');
    const [form, setForm] = useState<ProposalForm>({
        organization: '',
        phone: '',
        email: '',
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
        setToastMsg(msg);
        setTimeout(() => setToastMsg(''), 3000);
    }

    function buildMessage() {
        return `🏰 *Tafaria Castle – Event Proposal Request*

Organization / Name: ${form.organization.trim() || '(not provided)'}
Phone / WhatsApp: ${form.phone.trim() || '—'}
Email: ${form.email.trim() || '—'}
Event Type: ${form.eventType}
Estimated Guests: ${form.guests}

Notes:
${form.notes.trim() || '(none)'}

Please prepare a proposal for the above. Thank you! 🙏`;
    }

    function handleWhatsApp() {
        if (!form.organization.trim()) {
            showToast('Please enter your organization or name.');
            return;
        }
        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage())}`;
        window.open(url, '_blank');
    }

    function handleEmail() {
        if (!form.organization.trim()) {
            showToast('Please enter your organization or name.');
            return;
        }
        const subject = encodeURIComponent(
            `Event Proposal Request — ${form.organization.trim()}`,
        );
        const body = encodeURIComponent(
            buildMessage().replace(/\*/g, '').replace(/🏰/g, '[Tafaria] '),
        );
        window.open(
            `mailto:${EMAIL_ADDRESS}?subject=${subject}&body=${body}`,
            '_blank',
        );
    }

    return (
        <>
            <style>{styles}</style>
            <div className="container">
                <section id="packages" className="section">
                    <div className="container">
                        <div className="mb-3">
                            <h1 className="h1">
                                {events[0]?.title ||
                                    'Host your event at Tafaria'}
                            </h1>
                            <p className="p-lg">
                                {events[0]?.subtitle ||
                                    'Whether you are planning a corporate retreat, a team offsite, a wedding, or a family reunion, Tafaria offers a unique blend of inspiring spaces, delicious food, and memorable experiences to make your event truly special.'}
                            </p>
                        </div>
                        <h2 className="h2">Event packages</h2>
                        <div className="grid-3 mt-5">
                            {events[0]?.items?.map((pkg) => (
                                <EventCard pkg={pkg} events={events} />
                            ))}
                        </div>
                    </div>
                </section>
                {packages.length > 0 &&
                    packages?.map((pkg) => (
                        <section className="section" style={{ paddingTop: 0 }}>
                            <div className="h1"> Enhance your Experience</div>
                            <div className="container">
                                <h2 className="h2">
                                    {getTabType(pkg) == 'experience'
                                        ? 'Tafaria Tours'
                                        : 'Tafaria Leisure Activities'}
                                </h2>
                                <p className="p">
                                    {pkg.subtitle ||
                                        'Enhance your event with unique add-on experiences.'}
                                </p>
                                <div className="grid-4 mt-12">
                                    {pkg?.items?.map((item) => (
                                        <div
                                            key={item.id}
                                            className="card h-full"
                                        >
                                            <div className="card-media">
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div className="card-pad">
                                                <div
                                                    className="h4"
                                                    style={{
                                                        marginTop: 0,
                                                        marginBottom: 4,
                                                    }}
                                                >
                                                    {item.title}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    ))}
                {/* {eventAddons.length > 0 &&
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
                    ))} */}

                {/* <section
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
                                                Organization / Name *
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
                                                Email
                                            </label>
                                            <input
                                                className="input"
                                                type="email"
                                                placeholder="you@example.com"
                                                value={form.email}
                                                onChange={(e) =>
                                                    handleChange(
                                                        'email',
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

                                    <div className="proposal-actions">
                                        <button
                                            className="btn-whatsapp"
                                            onClick={handleWhatsApp}
                                        >
                                            <WhatsAppIcon />
                                            Send on WhatsApp
                                        </button>
                                        <span className="actions-divider">
                                            or
                                        </span>
                                        <button
                                            className="btn-email"
                                            onClick={handleEmail}
                                        >
                                            <EmailIcon />
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

                                    <div
                                        style={{ marginBottom: 6 }}
                                        dangerouslySetInnerHTML={{
                                            __html:
                                                events[0]
                                                    ?.customer_proposal_contents ||
                                                '',
                                        }}
                                    ></div>
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
                                        className="btn-whatsapp"
                                        href={`https://wa.me/${WHATSAPP_NUMBER}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{ display: 'inline-flex' }}
                                    >
                                        <WhatsAppIcon />
                                        WhatsApp now
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section> */}

                {toastMsg && <div className="toast">{toastMsg}</div>}
            </div>
        </>
    );
}
