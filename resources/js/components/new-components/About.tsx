import { AboutUs, TafariaPhilosophy } from '@/types';

const WHATSAPP_NUMBER = '+254708877244';
const EMAIL = 'info@tafaria.com';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Inter:wght@400;500;600;700&display=swap');

  .h1 { font-family: 'Cinzel', serif; font-size: clamp(2rem,4vw,3rem); font-weight: 700; line-height: 1.2; color: #1a0f06; margin: 10px 0 14px; }
  .h2 { font-family: 'Cinzel', serif; font-size: clamp(1.3rem,3vw,1.9rem); font-weight: 600; color: #1a0f06; margin-bottom: 16px; }
  .p-lg { font-size: 1.1rem; line-height: 1.7; color: #5a3e2b; }
  .p   { font-size: 1rem;   line-height: 1.7; color: #5a3e2b; margin-bottom: 16px; }
  .small { font-size: 0.85rem; color: #6b4f35; line-height: 1.6; }

  .badge {
    display: inline-block; padding: 4px 12px; border-radius: 999px;
    font-size: 0.72rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;
    background: rgba(184,146,75,0.18); color: #7a5520; border: 1px solid rgba(184,146,75,0.4);
  }

  .btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 12px 22px; border-radius: 999px;
    font-size: 0.88rem; font-weight: 600;
    cursor: pointer; text-decoration: none; border: none;
    transition: transform 0.1s ease, box-shadow 0.15s ease;
    white-space: nowrap; font-family: inherit;
  }
  .btn:hover { transform: translateY(-1px); }
  .btn-primary  { background: linear-gradient(135deg,#b8924b,#8a6830); color:#fff; box-shadow:0 4px 14px rgba(184,146,75,0.35); }
  .btn-primary:hover { box-shadow: 0 6px 20px rgba(184,146,75,0.5); }
  .btn-secondary { background:#fff; color:#5a3e2b; border:1px solid rgba(90,62,43,0.25); box-shadow:0 2px 8px rgba(0,0,0,0.06); }
  .btn-secondary:hover { background:#fbf7f0; }

  .card {
    background: #fff; border: 1px solid rgba(184,146,75,0.18);
    border-radius: 20px; overflow: hidden;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  }
  .card-pad    { padding: 20px; }
  .card-pad-lg { padding: 28px; }

  .card-media {
    height: 260px; overflow: hidden;
    background: linear-gradient(135deg, rgba(90,62,43,0.18), rgba(184,146,75,0.18));
  }
  .card-media img { width:100%; height:100%; object-fit:cover; display:block; }

  .grid-2 { display: grid; gap: 24px; grid-template-columns: repeat(2,1fr); margin-top: 20px; }
  .grid-3 { display: grid; gap: 20px; grid-template-columns: repeat(3,1fr); margin-top: 20px; }

  @media (max-width: 900px) {
    .grid-2 { grid-template-columns: 1fr; }
    .grid-3 { grid-template-columns: repeat(2,1fr); }
  }
  @media (max-width: 560px) {
    .grid-3 { grid-template-columns: 1fr; }
  }

  .strip {
    background: rgba(184,146,75,0.08);
    border: 1px solid rgba(184,146,75,0.22);
    border-radius: 16px; padding: 18px 20px;
  }
  .strip-divider { border: none; border-top: 1px solid rgba(184,146,75,0.2); margin: 10px 0; }

  .link { color: #b8924b; font-weight: 600; text-decoration: none; }
  .link:hover { text-decoration: underline; }

  .map-placeholder {
    height: 240px;
    background: linear-gradient(135deg, rgba(90,62,43,0.08), rgba(184,146,75,0.12));
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    border: 1px dashed rgba(184,146,75,0.35);
    margin-top: 16px;
  }
  .map-placeholder span { font-size: 0.85rem; color: #8a6830; font-weight: 500; }

  .philosophy-card { padding: 20px; }
  .philosophy-card b { font-size: 0.95rem; color: #1a0f06; display: block; margin-bottom: 4px; }
`;

export default function AboutUsPage({
    aboutUs,
    tafariaPhilosophy,
}: {
    aboutUs: AboutUs[];
    tafariaPhilosophy: TafariaPhilosophy[];
}) {
    return (
        <>
            <style>{styles}</style>
            <div className="root">
                <section className="section-sm">
                    <div className="container">
                        <span className="badge">Our story</span>
                        <h1 className="h1">{aboutUs[0]?.title}</h1>
                        <p
                            className="p-lg"
                            dangerouslySetInnerHTML={{
                                __html:
                                    aboutUs[0]?.description ||
                                    'Tafaria is a castle retreat in Laikipia, Kenya — where hospitality meets learning and creativity. We offer an inspiring escape from the city, with immersive experiences that connect you to nature, culture, and community.',
                            }}
                        ></p>
                    </div>
                </section>

                <section className="section">
                    <div className="container">
                        <div className="grid-2">
                            <div className="card">
                                <div className="card-media">
                                    <img
                                        src={
                                            aboutUs[0]?.image ||
                                            '/images/tafaria-castle.jpg'
                                        }
                                        alt="Tafaria Castle"
                                        loading="lazy"
                                    />
                                </div>
                            </div>

                            <div>
                                <h2 className="h2">Why Tafaria</h2>
                                <p
                                    className="p"
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            aboutUs[0]?.why_tafaria ||
                                            'Tafaria is more than a getaway — it’s a place to grow, create, and connect. We blend the beauty of a castle retreat with the enrichment of museums, art studios, and a Nano Farm. Whether you’re seeking inspiration, learning, or just a magical escape, Tafaria offers an experience that delights the heart and enriches the mind.',
                                    }}
                                ></p>

                                <div
                                    className="strip"
                                    style={{ marginBottom: 12 }}
                                >
                                    <b style={{ color: '#1a0f06' }}>Mission</b>
                                    <div
                                        className="small"
                                        style={{ marginTop: 6 }}
                                        dangerouslySetInnerHTML={{
                                            __html:
                                                aboutUs[0]?.mission ||
                                                'To create a unique retreat that combines hospitality, learning, and creativity — enriching the lives of our guests and empowering our local community.',
                                        }}
                                    ></div>
                                </div>

                                <div className="strip">
                                    <b style={{ color: '#1a0f06' }}>
                                        What makes Tafaria different
                                    </b>
                                    <hr className="strip-divider" />
                                    {aboutUs[0]?.differentiators && (
                                        <div
                                            className="small"
                                            dangerouslySetInnerHTML={{
                                                __html: aboutUs[0]
                                                    .differentiators,
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section" style={{ paddingTop: 0 }}>
                    <div className="container">
                        <h2 className="h2">
                            {tafariaPhilosophy[0]?.title ||
                                'The Tafaria philosophy'}
                        </h2>
                        <div className="grid-3">
                            {tafariaPhilosophy[0]?.philosophies?.map(
                                ({ title, subtitle }) => (
                                    <div key={title} className="card">
                                        <div className="philosophy-card">
                                            <b>{title}</b>
                                            <div className="small">
                                                {subtitle}
                                            </div>
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>
                    </div>
                </section>

                <section id="map" className="section" style={{ paddingTop: 0 }}>
                    <div className="container">
                        <h2 className="h2">Plan your visit</h2>
                        <div className="grid-2">
                            <div className="card">
                                <div className="card-pad-lg">
                                    <b
                                        style={{
                                            color: '#1a0f06',
                                            fontSize: '1rem',
                                        }}
                                    >
                                        Location
                                    </b>
                                    <div
                                        className="small"
                                        style={{ marginTop: 4 }}
                                    >
                                        Laikipia County, Kenya
                                    </div>

                                    <hr
                                        className="strip-divider"
                                        style={{ margin: '14px 0' }}
                                    />

                                    <div
                                        className="small"
                                        style={{ marginBottom: 8 }}
                                    >
                                        <b>Opening hours:</b> 9:00 – 18:00
                                    </div>
                                    <div
                                        className="small"
                                        style={{ marginBottom: 8 }}
                                    >
                                        WhatsApp:{' '}
                                        <a
                                            className="link"
                                            href={`https://wa.me/${WHATSAPP_NUMBER}`}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {WHATSAPP_NUMBER}
                                        </a>
                                    </div>
                                    <div
                                        className="small"
                                        style={{ marginBottom: 20 }}
                                    >
                                        Email:{' '}
                                        <a
                                            className="link"
                                            href={`mailto:${EMAIL}`}
                                        >
                                            {EMAIL}
                                        </a>
                                    </div>

                                    <a
                                        className="btn btn-primary"
                                        href="book.html"
                                    >
                                        Plan &amp; Book
                                    </a>
                                </div>
                            </div>

                            <div className="card">
                                <div className="card-pad-lg">
                                    <b
                                        style={{
                                            color: '#1a0f06',
                                            fontSize: '1rem',
                                        }}
                                    >
                                        Getting here
                                    </b>
                                    <div
                                        className="small"
                                        style={{
                                            marginTop: 4,
                                            marginBottom: 14,
                                        }}
                                    >
                                        Accessible from Nairobi, Nanyuki, and
                                        surrounding areas.
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
                                            height="360"
                                            style={{
                                                border: 0,
                                                display: 'block',
                                            }}
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
