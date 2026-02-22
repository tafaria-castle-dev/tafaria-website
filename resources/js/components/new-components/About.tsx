const WHATSAPP_NUMBER = 'YOURNUMBER';
const EMAIL = 'hello@tafaria.com';

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

const PHILOSOPHY = [
    { title: 'Delight the heart', sub: 'Wonder, beauty, joy' },
    { title: 'Enrich the mind', sub: 'Learning by experience' },
    {
        title: 'Transform the village',
        sub: 'Arts as a catalyst for prosperity',
    },
];

const DIFFERENTIATORS = [
    'A castle escape with real learning',
    'Museums, herbarium, Nano Farm',
    'Art studios and installations',
    'Recreation that feels like a destination',
];

export default function AboutTafaria() {
    return (
        <>
            <style>{styles}</style>
            <div className="root">
                <section className="section-sm">
                    <div className="container">
                        <span className="badge">Our story</span>
                        <h1 className="h1">Once Upon a Dream</h1>
                        <p className="p-lg">
                            Tafaria exists to delight the heart and enrich the
                            mind — and to pursue rural transformation through
                            the arts.
                        </p>
                    </div>
                </section>

                <section className="section">
                    <div className="container">
                        <div className="grid-2">
                            <div className="card">
                                <div className="card-media">
                                    <img
                                        src="/assets/castle-front.jpg"
                                        alt="Tafaria Castle"
                                        loading="lazy"
                                    />
                                </div>
                            </div>

                            <div>
                                <h2 className="h2">Why Tafaria</h2>
                                <p className="p">
                                    Tafaria blends hospitality, learning, and
                                    creativity — so visitors leave refreshed and
                                    inspired.
                                </p>

                                <div
                                    className="strip"
                                    style={{ marginBottom: 12 }}
                                >
                                    <b style={{ color: '#1a0f06' }}>Mission</b>
                                    <div
                                        className="small"
                                        style={{ marginTop: 6 }}
                                    >
                                        The pursuit of rural transformation
                                        through the arts.
                                    </div>
                                </div>

                                <div className="strip">
                                    <b style={{ color: '#1a0f06' }}>
                                        What makes Tafaria different
                                    </b>
                                    <hr className="strip-divider" />
                                    {DIFFERENTIATORS.map((d) => (
                                        <div
                                            key={d}
                                            className="small"
                                            style={{ marginBottom: 5 }}
                                        >
                                            • {d}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section" style={{ paddingTop: 0 }}>
                    <div className="container">
                        <h2 className="h2">The Tafaria philosophy</h2>
                        <div className="grid-3">
                            {PHILOSOPHY.map(({ title, sub }) => (
                                <div key={title} className="card">
                                    <div className="philosophy-card">
                                        <b>{title}</b>
                                        <div className="small">{sub}</div>
                                    </div>
                                </div>
                            ))}
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

                                    <div className="map-placeholder">
                                        {/* Replace this div with a Google Maps iframe when ready:
                      <iframe
                        src="https://www.google.com/maps/embed?pb=..."
                        width="100%" height="240" style={{ border: 0 }}
                        allowFullScreen loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    */}
                                        <span>
                                            📍 Map coming soon — embed Google
                                            Maps iframe here
                                        </span>
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
