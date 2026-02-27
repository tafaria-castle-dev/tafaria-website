import { useSelectedPackage } from '@/hooks/SelectedPackageContext';
import { Program, SchoolAdditional, SchoolProgram } from '@/types';
import { useRef, useState } from 'react';
import { SchoolCard } from './Landing';

interface QuoteForm {
    schoolName: string;
    phone: string;
    students: number;
    days: string;
    notes: string;
}

const WHATSAPP_NUMBER = 'YOURNUMBER';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Inter:wght@400;500;600;700&display=swap');


  .h1 { font-family: 'Cinzel', serif; font-size: clamp(2rem,4vw,3rem); font-weight: 700; line-height: 1.2; color: #1a0f06; margin: 10px 0 14px; }
  .h2 { font-family: 'Cinzel', serif; font-size: clamp(1.3rem,3vw,1.9rem); font-weight: 600; color: #1a0f06; margin-bottom: 20px; }
  .h3 { font-family: 'Cinzel', serif; font-size: 1rem; font-weight: 600; color: #1a0f06; margin: 10px 0 6px; }
  .p-lg { font-size: 1.1rem; line-height: 1.7; color: #5a3e2b; }
  .small { font-size: 0.85rem; color: #6b4f35; line-height: 1.5; }
  .micro { font-size: 0.78rem; color: #8a6830; font-weight: 600; }

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
  .card-pad { padding: 18px; }
  .card-pad-lg { padding: 28px; }

  .grid-4 { display: grid; gap: 20px; grid-template-columns: repeat(4,1fr); }
  .grid-2 { display: grid; gap: 24px; grid-template-columns: repeat(2,1fr); }

  @media (max-width: 900px) {
    .grid-4 { grid-template-columns: repeat(2,1fr); }
    .grid-2 { grid-template-columns: 1fr; }
  }
  @media (max-width: 560px) {
    .grid-4 { grid-template-columns: 1fr; }
  }

  .meta-row { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
  .meta {
    font-size: 0.72rem; color: #7a5520;
    background: rgba(184,146,75,0.1); border: 1px solid rgba(184,146,75,0.2);
    border-radius: 999px; padding: 3px 9px; font-weight: 500;
  }

  .strip {
    background: rgba(184,146,75,0.08);
    border: 1px solid rgba(184,146,75,0.22);
    border-radius: 20px; padding: 24px;
  }
  .strip-row { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px; }
  .strip-divider { border: none; border-top: 1px solid rgba(184,146,75,0.2); margin: 12px 0; }

  /* Quote form */
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
    background: #4a6030; color: #fff;
    border-radius: 14px; padding: 12px 20px;
    font-weight: 600; font-size: 0.9rem;
    box-shadow: 0 6px 20px rgba(0,0,0,0.15);
    animation: pop 0.25s ease-out;
  }
  @keyframes pop {
    from { transform: translateY(10px); opacity: 0; }
    to   { transform: translateY(0);   opacity: 1; }
  }
`;

function Badge({
    children,
    type,
}: {
    children: React.ReactNode;
    type: 'gold' | 'neutral' | 'olive';
}) {
    return <span className={`badge badge-${type}`}>{children}</span>;
}

export default function GoDreamPage({
    schoolPrograms,
    schoolAdditional,
}: {
    schoolPrograms: SchoolProgram[];
    schoolAdditional: SchoolAdditional[];
}) {
    const quoteRef = useRef<HTMLElement>(null);
    const [toast, setToast] = useState('');
    const [form, setForm] = useState<QuoteForm>({
        schoolName: '',
        phone: '',
        students: 30,
        days: '1 day',
        notes: '',
    });
    const { setShowSchoolQuoteModal, setQuoteInitialProgram } =
        useSelectedPackage();
    const handleRequestQuote = (program: Program) => {
        setQuoteInitialProgram(program);
        setShowSchoolQuoteModal(true);
    };

    const handleOpenSchoolQuoteAll = () => {
        setQuoteInitialProgram(null);
        setShowSchoolQuoteModal(true);
    };
    function handleChange(field: keyof QuoteForm, value: string | number) {
        setForm((f) => ({ ...f, [field]: value }));
    }

    function scrollToQuote() {
        quoteRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    function buildWhatsAppMessage() {
        return encodeURIComponent(
            `Hello Tafaria! 👋\n\nSchool: ${form.schoolName}\nPhone: ${form.phone}\nStudents: ${form.students}\nDays: ${form.days}\nNotes: ${form.notes}`,
        );
    }

    function handleEmailSend() {
        if (!form.schoolName.trim()) {
            setToast('Please enter your school name.');
            setTimeout(() => setToast(''), 3000);
            return;
        }
        const subject = encodeURIComponent(
            `School Quote Request — ${form.schoolName}`,
        );
        const body = encodeURIComponent(
            `School: ${form.schoolName}\nPhone: ${form.phone}\nStudents: ${form.students}\nDays: ${form.days}\nNotes:\n${form.notes}`,
        );
        window.location.href = `mailto:info@tafaria.com?subject=${subject}&body=${body}`;
    }

    return (
        <>
            <style>{styles}</style>
            <div className="container">
                <section className="section-sm">
                    <div className="container">
                        <h1 className="h1"> {schoolPrograms[0]?.title}</h1>
                        <p className="p-lg">{schoolPrograms[0]?.subtitle}</p>
                    </div>
                </section>

                <section className="section">
                    <div className="container">
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

                        <div style={{ height: 20 }} />

                        <div className="flex w-full flex-col items-center justify-center gap-15">
                            {schoolAdditional.length > 0 &&
                                schoolAdditional.map((item) => (
                                    <div className="strip w-full">
                                        <div className="strip-row">
                                            <div>
                                                <b style={{ color: '#1a0f06' }}>
                                                    {item.title}
                                                </b>
                                                <div
                                                    className="small"
                                                    style={{ marginTop: 6 }}
                                                    dangerouslySetInnerHTML={{
                                                        __html:
                                                            item.description ||
                                                            '',
                                                    }}
                                                ></div>
                                            </div>
                                            <button
                                                className="btn btn-secondary"
                                                onClick={scrollToQuote}
                                            >
                                                {item.button_message ||
                                                    'Ask Quote'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </section>

                {toast && <div className="toast">{toast}</div>}
            </div>
        </>
    );
}
