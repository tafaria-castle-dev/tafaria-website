import { AboutUs, TafariaPhilosophy } from '@/types';

const WHATSAPP_NUMBER = '+254708877244';
const EMAIL = 'info@tafaria.com';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Inter:wght@400;500;600;700&display=swap');




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
