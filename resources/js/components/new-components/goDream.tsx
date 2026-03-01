import { useSelectedPackage } from '@/hooks/SelectedPackageContext';
import { Program, SchoolAdditional, SchoolProgram } from '@/types';
import { useRef, useState } from 'react';
import { ReadMoreText, SchoolCard } from './Landing';

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

    return (
        <>
            <style>{styles}</style>
            <div className="container">
                <section className="section">
                    <div className="container">
                        <div className="strip-header">
                            <div>
                                <h2 className="h2">
                                    {schoolPrograms[0]?.title}
                                </h2>
                                <ReadMoreText
                                    text={
                                        schoolPrograms[0]?.subtitle ||
                                        'Whether you are planning a corporate retreat, a team offsite, a wedding, or a family reunion, Tafaria offers a unique blend of inspiring spaces, delicious food, and memorable experiences to make your event truly special.'
                                    }
                                    limit={120}
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
                                        className="pkg-rich-content"
                                        dangerouslySetInnerHTML={{
                                            __html: schoolPrograms[0]
                                                ?.what_you_get_message,
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        <div style={{ height: 20 }} />
                    </div>
                </section>

                {toast && <div className="toast">{toast}</div>}
            </div>
        </>
    );
}
