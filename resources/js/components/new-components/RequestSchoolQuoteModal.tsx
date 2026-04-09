import { DatePickerModal } from '@/components/DatePickerModal';
import { useSelectedPackage } from '@/hooks/SelectedPackageContext';
import { Program, SchoolProgram } from '@/types';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Calendar,
    CheckSquare,
    Mail,
    MessageSquare,
    Minus,
    Phone,
    Plus,
    School,
    Square,
    User,
    Users,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Inter:wght@400;500;600;700&display=swap');

  .sq-overlay {
    position: fixed; inset: 0; z-index: 50;
    background: rgba(26,15,6,0.55);
    backdrop-filter: blur(4px);
    display: flex; align-items: flex-end;
  }
  @media (min-width: 700px) {
    .sq-overlay { align-items: center; justify-content: center; }
  }

  .sq-modal {
    background: #fffdf9;
    border-radius: 28px 28px 0 0;
    width: 96vw;
    max-height: 85vh;
    margin: 0 auto;
    overflow-y: auto;
    box-shadow: 0 -8px 48px rgba(0,0,0,0.18);
    display: flex; flex-direction: column;
  }
  @media (min-width: 700px) {
    .sq-modal { border-radius: 28px; width: min(820px, 94vw); max-height: 96vh; }
  }

  .sq-header {
    display: flex; align-items: flex-start; justify-content: space-between;
    padding: 20px 28px 16px;
    border-bottom: 1px solid rgba(184,146,75,0.18);
    position: sticky; top: 0;
    background: #fffdf9; z-index: 2;
    border-radius: 28px 28px 0 0;
  }
  .sq-header-title {
    font-family: 'Cinzel', serif;
    font-size: 1.05rem; font-weight: 600; color: #1a0f06;
    margin-bottom: 2px;
  }
  .sq-header-sub { font-size: 0.82rem; color: #9a7d5a; }

  .sq-close {
    width: 36px; height: 36px; border-radius: 50%; border: none;
    background: rgba(90,62,43,0.08); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: #5a3e2b; flex-shrink: 0;
    transition: background 0.15s ease;
  }
  .sq-close:hover { background: rgba(90,62,43,0.16); }

  .sq-body { padding: 24px 28px; flex: 1; overflow-y: auto; }
  .sq-footer {
    padding: 16px 28px;
    border-top: 1px solid rgba(184,146,75,0.15);
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
    position: sticky; bottom: 0; background: #fffdf9; z-index: 2;
  }

  .sq-section-label {
    font-family: 'Cinzel', serif;
    font-size: 0.88rem; font-weight: 600; color: #1a0f06;
    display: flex; align-items: center; gap: 8px;
    margin-bottom: 14px;
  }

  .sq-programs-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 28px;
  }
  @media (max-width: 560px) {
    .sq-programs-grid { grid-template-columns: 1fr; }
  }

  .sq-program-card {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 14px 16px;
    border-radius: 16px;
    border: 1.5px solid rgba(184,146,75,0.22);
    background: #fff;
    cursor: pointer;
    transition: border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
    text-align: left; font-family: inherit;
  }
  .sq-program-card:hover {
    border-color: rgba(184,146,75,0.5);
    box-shadow: 0 2px 12px rgba(184,146,75,0.12);
  }
  .sq-program-card.selected {
    border-color: #b8924b;
    background: rgba(255,251,240,0.9);
    box-shadow: 0 2px 14px rgba(184,146,75,0.18);
  }

  .sq-program-thumb {
    width: 52px; height: 52px; border-radius: 10px; overflow: hidden; flex-shrink: 0;
  }
  .sq-program-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }

  .sq-program-info { flex: 1; min-width: 0; }
  .sq-program-name {
    font-size: 0.85rem; font-weight: 700; color: #1a0f06;
    margin-bottom: 3px; line-height: 1.3;
  }
  .sq-program-badge {
    display: inline-block; padding: 2px 8px; border-radius: 999px;
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase;
    background: rgba(184,146,75,0.14); color: #7a5520;
    border: 1px solid rgba(184,146,75,0.3);
  }
  .sq-check-icon { flex-shrink: 0; margin-top: 1px; color: #b8924b; }

  .sq-date-btn {
    display: flex; flex-direction: column; gap: 4px;
    padding: 13px 20px; border-radius: 16px;
    border: 1.5px solid rgba(184,146,75,0.3);
    background: #fff; cursor: pointer;
    text-align: left; font-family: inherit; width: 100%;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
    margin-bottom: 20px;
  }
  .sq-date-btn:hover { border-color: rgba(184,146,75,0.6); box-shadow: 0 2px 12px rgba(184,146,75,0.12); }
  .sq-date-btn.has-value { border-color: rgba(184,146,75,0.55); background: rgba(255,251,240,0.8); }
  .sq-date-label { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #8a6830; }
  .sq-date-value { font-size: 1rem; font-weight: 600; color: #1a0f06; }
  .sq-date-placeholder { font-size: 1rem; color: #b89c7a; }

  .sq-guest-section {
    background: rgba(255,251,240,0.8);
    border: 1px solid rgba(184,146,75,0.25);
    border-radius: 20px;
    padding: 20px 22px;
    margin-bottom: 28px;
  }
  .sq-guest-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid rgba(184,146,75,0.1);
  }
  .sq-guest-row:last-child { border-bottom: none; padding-bottom: 0; }
  .sq-guest-label { font-size: 0.88rem; font-weight: 600; color: #1a0f06; display: flex; align-items: center; gap: 7px; }
  .sq-guest-sub { font-size: 0.73rem; color: #9a7d5a; margin-top: 1px; }
  .sq-counter { display: flex; align-items: center; gap: 10px; }
  .sq-counter-btn {
    width: 30px; height: 30px; border-radius: 50%;
    border: 1.5px solid rgba(184,146,75,0.4);
    background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center;
    color: #8a6830; transition: all 0.15s ease; font-family: inherit;
  }
  .sq-counter-btn:hover:not(:disabled) { background: rgba(184,146,75,0.12); border-color: rgba(184,146,75,0.7); }
  .sq-counter-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .sq-counter-val { font-size: 1rem; font-weight: 700; color: #1a0f06; min-width: 22px; text-align: center; }

  .sq-divider {
    border: none; border-top: 1px solid rgba(184,146,75,0.18);
    margin: 24px 0;
  }

  .sq-form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin-bottom: 14px;
  }
  @media (max-width: 500px) { .sq-form-grid { grid-template-columns: 1fr; } }

  .sq-field {
    display: flex; flex-direction: column; gap: 6px;
  }
  .sq-field.full { grid-column: 1 / -1; }
  .sq-field-label {
    font-size: 0.72rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.06em; color: #8a6830;
    display: flex; align-items: center; gap: 5px;
  }
  .sq-input {
    padding: 11px 14px; border-radius: 12px;
    border: 1.5px solid rgba(184,146,75,0.28);
    background: #fff; font-family: inherit; font-size: 0.92rem;
    color: #1a0f06; outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
    width: 100%; box-sizing: border-box;
  }
  .sq-input:focus {
    border-color: rgba(184,146,75,0.65);
    box-shadow: 0 0 0 3px rgba(184,146,75,0.12);
  }
  .sq-input::placeholder { color: #c4a97a; }
  .sq-textarea {
    padding: 11px 14px; border-radius: 12px;
    border: 1.5px solid rgba(184,146,75,0.28);
    background: #fff; font-family: inherit; font-size: 0.92rem;
    color: #1a0f06; outline: none; resize: vertical; min-height: 90px;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
    width: 100%; box-sizing: border-box;
  }
  .sq-textarea:focus {
    border-color: rgba(184,146,75,0.65);
    box-shadow: 0 0 0 3px rgba(184,146,75,0.12);
  }
  .sq-textarea::placeholder { color: #c4a97a; }

  .sq-summary {
    background: linear-gradient(135deg, rgba(184,146,75,0.08), rgba(184,146,75,0.04));
    border: 1px solid rgba(184,146,75,0.22);
    border-radius: 16px; padding: 16px 20px;
    margin-top: 20px;
    display: flex; flex-wrap: wrap; gap: 10px; align-items: center;
  }
  .sq-summary-chip {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 5px 12px; border-radius: 999px;
    background: rgba(184,146,75,0.12); border: 1px solid rgba(184,146,75,0.28);
    font-size: 0.78rem; font-weight: 600; color: #7a5520;
  }

  .sq-success {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 48px 32px; text-align: center; gap: 16px;
  }
  .sq-success-icon {
    width: 72px; height: 72px; border-radius: 50%;
    background: linear-gradient(135deg, rgba(184,146,75,0.2), rgba(184,146,75,0.08));
    border: 2px solid rgba(184,146,75,0.4);
    display: flex; align-items: center; justify-content: center;
    font-size: 2rem;
  }
  .sq-success-title {
    font-family: 'Cinzel', serif; font-size: 1.3rem; font-weight: 700; color: #1a0f06;
  }
  .sq-success-sub { font-size: 0.92rem; color: #7a5a3a; max-width: 360px; line-height: 1.6; }

  .sq-submit {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 13px 28px; border-radius: 14px; border: none;
    background: linear-gradient(135deg, #b8924b, #8a6830);
    color: #fff; font-size: 0.95rem; font-weight: 700; cursor: pointer;
    box-shadow: 0 4px 16px rgba(184,146,75,0.35);
    font-family: inherit; transition: all 0.15s ease;
  }
  .sq-submit:hover:not(:disabled) { box-shadow: 0 6px 22px rgba(184,146,75,0.5); transform: translateY(-1px); }
  .sq-submit:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

  .sq-small { font-size: 0.82rem; color: #9a7d5a; }
`;

interface SchoolQuoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialProgram?: Program | null;
}

interface ContactForm {
    school: string;
    contactName: string;
    email: string;
    phone: string;
    message: string;
}

export default function SchoolQuoteModal() {
    const [selectedIds, setSelectedIds] = useState<Set<string | number>>(
        new Set(),
    );
    const [visitDate, setVisitDate] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [numStudents, setNumStudents] = useState(20);
    const [numTeachers, setNumTeachers] = useState(2);
    const [form, setForm] = useState<ContactForm>({
        school: '',
        contactName: '',
        email: '',
        phone: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [schoolPrograms, setSchoolPrograms] = useState<SchoolProgram[]>([]);
    const bodyRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const {
        quoteInitialProgram,
        showSchoolQuoteModal,
        setShowSchoolQuoteModal,
    } = useSelectedPackage();
    useEffect(() => {
        if (!quoteInitialProgram) {
            setSubmitted(false);
            setIsSubmitting(false);
            setShowDatePicker(false);
        }
    }, [showSchoolQuoteModal]);
    useEffect(() => {
        if (showSchoolQuoteModal && quoteInitialProgram) {
            setSelectedIds(new Set([quoteInitialProgram.id]));
        }
    }, [showSchoolQuoteModal, quoteInitialProgram]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [schoolProgramsRes] = await Promise.all([
                    axios.get(
                        'https://website-cms.tafaria.com/api/school-programs',
                    ),
                ]);
                setSchoolPrograms(schoolProgramsRes.data.data || []);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);
    const allPrograms: Program[] = schoolPrograms[0]?.programs || [];

    useEffect(() => {
        if (!showSchoolQuoteModal) {
            setSubmitted(false);
            setIsSubmitting(false);
            setShowDatePicker(false);
        }
    }, [showSchoolQuoteModal]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (showDatePicker) {
                    setShowDatePicker(false);
                    return;
                }
                setShowSchoolQuoteModal(false);
            }
        };
        if (showSchoolQuoteModal)
            document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [showSchoolQuoteModal, showDatePicker]);

    useEffect(() => {
        document.body.style.overflow = showSchoolQuoteModal ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [showSchoolQuoteModal]);

    const toggleProgram = (id: string | number) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                if (next.size === 1) return prev;
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const formatDate = (d: string) =>
        d
            ? new Date(d).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
              })
            : null;

    const selectedPrograms = allPrograms.filter((p) => selectedIds.has(p.id));
    const totalGuests = numStudents + numTeachers;
    const canSubmit =
        selectedIds.size > 0 &&
        visitDate &&
        form.school.trim() &&
        form.contactName.trim() &&
        (form.email.trim() || form.phone.trim());
    const getQuoteMessage = () => {
        const selectedProgs =
            allPrograms
                .filter((p) => selectedIds.has(p.id))
                .map((p) => p.title || 'Unnamed Program')
                .join(', ') || 'None selected';

        const visit = visitDate ? formatDate(visitDate) : 'Not selected';

        const message = `🏰 *Tafaria Castle – School Quote Request*

School: ${form.school.trim() || '(not provided)'}
Contact Person: ${form.contactName.trim() || '(not provided)'}
Email: ${form.email.trim() || '—'}
Phone: ${form.phone.trim() || '—'}

Programmes interested in:
${selectedProgs}

Planned visit date: ${visit}
Group size: ${numStudents} students + ${numTeachers} teachers
Total guests ≈ ${totalGuests}

Additional message:
${form.message.trim() || '(none)'}

Please prepare a quote / availability for the above. Thank you! 🙏`;

        return message;
    };

    const sendToWhatsApp = () => {
        const phone = '+254708877244';
        const text = getQuoteMessage();
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    const sendToEmail = () => {
        const email = 'info@tafaria.com';
        const subject =
            'School Quote Request – ' + (form.school.trim() || 'Tafaria');
        const body = getQuoteMessage()
            .replace(/\*/g, '')
            .replace(/🏰/g, '[Tafaria] ');

        const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(url, '_blank');
    };
    const handleSubmit = async () => {
        if (!canSubmit) return;
        setIsSubmitting(true);
        try {
            await new Promise((res) => setTimeout(res, 1200));
            setSubmitted(true);
        } catch {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setShowSchoolQuoteModal(false);
        setTimeout(() => {
            setSubmitted(false);
            setSelectedIds(
                quoteInitialProgram
                    ? new Set([quoteInitialProgram.id])
                    : new Set(),
            );
            setVisitDate('');
            setShowDatePicker(false);
            setNumStudents(20);
            setNumTeachers(2);
            setForm({
                school: '',
                contactName: '',
                email: '',
                phone: '',
                message: '',
            });
        }, 300);
    };

    const GuestCounter = ({
        value,
        onIncrement,
        onDecrement,
        min = 0,
    }: {
        value: number;
        onIncrement: () => void;
        onDecrement: () => void;
        min?: number;
    }) => (
        <div className="sq-counter">
            <motion.button
                className="sq-counter-btn"
                onClick={onDecrement}
                disabled={value <= min}
                whileTap={{ scale: 0.85 }}
            >
                <Minus size={12} />
            </motion.button>
            <motion.span
                key={value}
                initial={{ scale: 1.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                className="sq-counter-val"
            >
                {value}
            </motion.span>
            <motion.button
                className="sq-counter-btn"
                onClick={onIncrement}
                whileTap={{ scale: 0.85 }}
            >
                <Plus size={12} />
            </motion.button>
        </div>
    );

    return (
        <>
            <style>{styles}</style>
            <AnimatePresence>
                {showSchoolQuoteModal && (
                    <motion.div
                        className="sq-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        onClick={(e) => {
                            if (e.target === e.currentTarget) handleClose();
                        }}
                    >
                        <motion.div
                            className="sq-modal"
                            initial={{ opacity: 0, y: 60, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 40, scale: 0.97 }}
                            transition={{
                                type: 'spring',
                                stiffness: 300,
                                damping: 30,
                            }}
                        >
                            <div className="sq-header">
                                <div>
                                    <div className="sq-header-title">
                                        Request a School Quote
                                    </div>
                                    <div className="sq-header-sub">
                                        Select programmes, your visit date &amp;
                                        group size
                                    </div>
                                </div>
                                <button
                                    className="sq-close"
                                    onClick={handleClose}
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <AnimatePresence mode="wait">
                                {submitted ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.92 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{
                                            type: 'spring',
                                            stiffness: 320,
                                            damping: 28,
                                        }}
                                    >
                                        <div className="sq-success">
                                            <motion.div
                                                className="sq-success-icon"
                                                initial={{
                                                    scale: 0,
                                                    rotate: -15,
                                                }}
                                                animate={{
                                                    scale: 1,
                                                    rotate: 0,
                                                }}
                                                transition={{
                                                    type: 'spring',
                                                    stiffness: 380,
                                                    damping: 22,
                                                    delay: 0.1,
                                                }}
                                            >
                                                🎉
                                            </motion.div>
                                            <motion.div
                                                className="sq-success-title"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                Quote Request Sent!
                                            </motion.div>
                                            <motion.div
                                                className="sq-success-sub"
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.28 }}
                                            >
                                                Thank you,{' '}
                                                {form.contactName ||
                                                    form.school}
                                                . Our team will prepare a
                                                tailored quote for{' '}
                                                <strong>{form.school}</strong>{' '}
                                                and reach out within 1 – 2
                                                business days.
                                            </motion.div>
                                            <motion.button
                                                className="btn btn-secondary"
                                                style={{ marginTop: 8 }}
                                                onClick={handleClose}
                                                whileHover={{ scale: 1.03 }}
                                                whileTap={{ scale: 0.97 }}
                                            >
                                                Close
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <div className="sq-body" ref={bodyRef}>
                                            <div className="sq-section-label">
                                                <CheckSquare
                                                    size={15}
                                                    color="#b8924b"
                                                />
                                                Select Programmes
                                                <span
                                                    style={{
                                                        fontSize: '0.75rem',
                                                        fontFamily: 'inherit',
                                                        fontWeight: 400,
                                                        color: '#9a7d5a',
                                                    }}
                                                >
                                                    ({selectedIds.size}{' '}
                                                    selected)
                                                </span>
                                            </div>

                                            <div className="sq-programs-grid">
                                                {allPrograms.map((program) => {
                                                    const isSelected =
                                                        selectedIds.has(
                                                            program.id,
                                                        );
                                                    return (
                                                        <motion.button
                                                            key={program.id}
                                                            className={`sq-program-card ${isSelected ? 'selected' : ''}`}
                                                            onClick={() =>
                                                                toggleProgram(
                                                                    program.id,
                                                                )
                                                            }
                                                            whileHover={{
                                                                scale: 1.015,
                                                            }}
                                                            whileTap={{
                                                                scale: 0.985,
                                                            }}
                                                            transition={{
                                                                type: 'spring',
                                                                stiffness: 400,
                                                                damping: 25,
                                                            }}
                                                        >
                                                            {program.image && (
                                                                <div className="sq-program-thumb">
                                                                    <img
                                                                        src={
                                                                            program.image
                                                                        }
                                                                        alt={
                                                                            program.title
                                                                        }
                                                                        loading="lazy"
                                                                    />
                                                                </div>
                                                            )}
                                                            <div className="sq-program-info">
                                                                <div className="sq-program-name">
                                                                    {
                                                                        program.title
                                                                    }
                                                                </div>
                                                                {program.badge_content && (
                                                                    <span className="sq-program-badge">
                                                                        {
                                                                            program.badge_content
                                                                        }
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="sq-check-icon">
                                                                <AnimatePresence mode="wait">
                                                                    {isSelected ? (
                                                                        <motion.span
                                                                            key="checked"
                                                                            initial={{
                                                                                scale: 0,
                                                                                opacity: 0,
                                                                            }}
                                                                            animate={{
                                                                                scale: 1,
                                                                                opacity: 1,
                                                                            }}
                                                                            exit={{
                                                                                scale: 0,
                                                                                opacity: 0,
                                                                            }}
                                                                            transition={{
                                                                                type: 'spring',
                                                                                stiffness: 500,
                                                                                damping: 22,
                                                                            }}
                                                                        >
                                                                            <CheckSquare
                                                                                size={
                                                                                    18
                                                                                }
                                                                                color="#b8924b"
                                                                            />
                                                                        </motion.span>
                                                                    ) : (
                                                                        <motion.span
                                                                            key="unchecked"
                                                                            initial={{
                                                                                scale: 0,
                                                                                opacity: 0,
                                                                            }}
                                                                            animate={{
                                                                                scale: 1,
                                                                                opacity: 1,
                                                                            }}
                                                                            exit={{
                                                                                scale: 0,
                                                                                opacity: 0,
                                                                            }}
                                                                        >
                                                                            <Square
                                                                                size={
                                                                                    18
                                                                                }
                                                                                color="#c4a97a"
                                                                            />
                                                                        </motion.span>
                                                                    )}
                                                                </AnimatePresence>
                                                            </div>
                                                        </motion.button>
                                                    );
                                                })}
                                            </div>

                                            <hr className="sq-divider" />

                                            <div className="sq-section-label">
                                                <Calendar
                                                    size={15}
                                                    color="#b8924b"
                                                />
                                                Planned Visit Date
                                            </div>

                                            <motion.button
                                                className={`sq-date-btn ${visitDate ? 'has-value' : ''}`}
                                                onClick={() =>
                                                    setShowDatePicker((v) => !v)
                                                }
                                                whileHover={{ scale: 1.005 }}
                                                whileTap={{ scale: 0.995 }}
                                            >
                                                <span className="sq-date-label">
                                                    <Calendar
                                                        size={10}
                                                        style={{
                                                            display: 'inline',
                                                            marginRight: 4,
                                                        }}
                                                    />
                                                    Visit Date
                                                </span>
                                                {visitDate ? (
                                                    <span className="sq-date-value">
                                                        {formatDate(visitDate)}
                                                    </span>
                                                ) : (
                                                    <span className="sq-date-placeholder">
                                                        Select a date
                                                    </span>
                                                )}
                                            </motion.button>

                                            <AnimatePresence>
                                                {showDatePicker && (
                                                    <motion.div
                                                        initial={{
                                                            opacity: 0,
                                                            height: 0,
                                                            marginBottom: 0,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            height: 'auto',
                                                            marginBottom: 20,
                                                        }}
                                                        exit={{
                                                            opacity: 0,
                                                            height: 0,
                                                            marginBottom: 0,
                                                        }}
                                                        transition={{
                                                            type: 'spring',
                                                            stiffness: 260,
                                                            damping: 26,
                                                        }}
                                                        style={{
                                                            overflow: 'hidden',
                                                        }}
                                                    >
                                                        <DatePickerModal
                                                            checkIn=""
                                                            checkOut=""
                                                            setCheckIn={(v) => {
                                                                setVisitDate(v);
                                                                setShowDatePicker(
                                                                    false,
                                                                );
                                                            }}
                                                            setCheckOut={() => {}}
                                                            onClose={() =>
                                                                setShowDatePicker(
                                                                    false,
                                                                )
                                                            }
                                                            inline
                                                        />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            <hr className="sq-divider" />

                                            <div className="sq-section-label">
                                                <Users
                                                    size={15}
                                                    color="#b8924b"
                                                />
                                                Group Size
                                            </div>

                                            <div className="sq-guest-section">
                                                <div className="sq-guest-row">
                                                    <div>
                                                        <div className="sq-guest-label">
                                                            <span>🎒</span>{' '}
                                                            Students
                                                        </div>
                                                        <div className="sq-guest-sub">
                                                            Learners attending
                                                            the programme
                                                        </div>
                                                    </div>
                                                    <GuestCounter
                                                        value={numStudents}
                                                        onIncrement={() =>
                                                            setNumStudents(
                                                                (n) => n + 1,
                                                            )
                                                        }
                                                        onDecrement={() =>
                                                            setNumStudents(
                                                                (n) =>
                                                                    Math.max(
                                                                        1,
                                                                        n - 1,
                                                                    ),
                                                            )
                                                        }
                                                        min={1}
                                                    />
                                                </div>
                                                <div className="sq-guest-row">
                                                    <div>
                                                        <div className="sq-guest-label">
                                                            <span>👨‍🏫</span>{' '}
                                                            Teachers /
                                                            Chaperones
                                                        </div>
                                                        <div className="sq-guest-sub">
                                                            Accompanying adults
                                                        </div>
                                                    </div>
                                                    <GuestCounter
                                                        value={numTeachers}
                                                        onIncrement={() =>
                                                            setNumTeachers(
                                                                (n) => n + 1,
                                                            )
                                                        }
                                                        onDecrement={() =>
                                                            setNumTeachers(
                                                                (n) =>
                                                                    Math.max(
                                                                        0,
                                                                        n - 1,
                                                                    ),
                                                            )
                                                        }
                                                        min={0}
                                                    />
                                                </div>
                                            </div>

                                            <hr className="sq-divider" />

                                            <div className="sq-section-label">
                                                <School
                                                    size={15}
                                                    color="#b8924b"
                                                />
                                                Your Details
                                            </div>

                                            <div className="sq-form-grid">
                                                <div className="sq-field">
                                                    <label className="sq-field-label">
                                                        <School size={10} />{' '}
                                                        School Name *
                                                    </label>
                                                    <input
                                                        className="sq-input"
                                                        placeholder="e.g. Nairobi Academy"
                                                        value={form.school}
                                                        onChange={(e) =>
                                                            setForm((f) => ({
                                                                ...f,
                                                                school: e.target
                                                                    .value,
                                                            }))
                                                        }
                                                    />
                                                </div>
                                                <div className="sq-field">
                                                    <label className="sq-field-label">
                                                        <User size={10} />{' '}
                                                        Contact Person *
                                                    </label>
                                                    <input
                                                        className="sq-input"
                                                        placeholder="Full name"
                                                        value={form.contactName}
                                                        onChange={(e) =>
                                                            setForm((f) => ({
                                                                ...f,
                                                                contactName:
                                                                    e.target
                                                                        .value,
                                                            }))
                                                        }
                                                    />
                                                </div>
                                                <div className="sq-field">
                                                    <label className="sq-field-label">
                                                        <Mail size={10} /> Email
                                                    </label>
                                                    <input
                                                        className="sq-input"
                                                        type="email"
                                                        placeholder="you@school.ac.ke"
                                                        value={form.email}
                                                        onChange={(e) =>
                                                            setForm((f) => ({
                                                                ...f,
                                                                email: e.target
                                                                    .value,
                                                            }))
                                                        }
                                                    />
                                                </div>
                                                <div className="sq-field">
                                                    <label className="sq-field-label">
                                                        <Phone size={10} />{' '}
                                                        Phone
                                                    </label>
                                                    <input
                                                        className="sq-input"
                                                        type="tel"
                                                        placeholder="+254 7XX XXX XXX"
                                                        value={form.phone}
                                                        onChange={(e) =>
                                                            setForm((f) => ({
                                                                ...f,
                                                                phone: e.target
                                                                    .value,
                                                            }))
                                                        }
                                                    />
                                                </div>
                                                <div className="sq-field full">
                                                    <label className="sq-field-label">
                                                        <MessageSquare
                                                            size={10}
                                                        />{' '}
                                                        Additional Notes
                                                    </label>
                                                    <textarea
                                                        className="sq-textarea"
                                                        placeholder="Any specific requirements, dietary needs, accessibility needs, or questions..."
                                                        value={form.message}
                                                        onChange={(e) =>
                                                            setForm((f) => ({
                                                                ...f,
                                                                message:
                                                                    e.target
                                                                        .value,
                                                            }))
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            <AnimatePresence>
                                                {selectedIds.size > 0 &&
                                                    visitDate && (
                                                        <motion.div
                                                            className="sq-summary"
                                                            initial={{
                                                                opacity: 0,
                                                                y: 8,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                y: 0,
                                                            }}
                                                            exit={{
                                                                opacity: 0,
                                                                y: 6,
                                                            }}
                                                            transition={{
                                                                type: 'spring',
                                                                stiffness: 320,
                                                                damping: 28,
                                                            }}
                                                        >
                                                            <span className="sq-summary-chip">
                                                                📅{' '}
                                                                {formatDate(
                                                                    visitDate,
                                                                )}
                                                            </span>
                                                            <span className="sq-summary-chip">
                                                                👥 {totalGuests}{' '}
                                                                attendees
                                                            </span>
                                                            {selectedPrograms.map(
                                                                (p) => (
                                                                    <span
                                                                        key={
                                                                            p.id
                                                                        }
                                                                        className="sq-summary-chip"
                                                                    >
                                                                        ✓{' '}
                                                                        {
                                                                            p.title
                                                                        }
                                                                    </span>
                                                                ),
                                                            )}
                                                        </motion.div>
                                                    )}
                                            </AnimatePresence>
                                        </div>
                                        <div className="sq-footer">
                                            <div className="flex gap-3 sm:flex-2">
                                                <button
                                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#902729] to-[#902729] px-6 py-3 font-semibold text-white transition-shadow hover:shadow-lg disabled:opacity-50"
                                                    onClick={sendToEmail}
                                                    disabled={!canSubmit}
                                                >
                                                    <svg
                                                        className="h-5 w-5"
                                                        fill="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                                    </svg>
                                                    <span className="hidden sm:inline">
                                                        Send via Email
                                                    </span>
                                                    <span className="sm:hidden">
                                                        Email
                                                    </span>
                                                </button>
                                                <button
                                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#902729] to-[#902729] px-6 py-3 font-semibold text-white transition-shadow hover:shadow-lg disabled:opacity-50"
                                                    disabled={!canSubmit}
                                                    onClick={sendToWhatsApp}
                                                >
                                                    <svg
                                                        className="h-5 w-5"
                                                        fill="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                                    </svg>
                                                    <span className="hidden sm:inline">
                                                        Send to WhatsApp
                                                    </span>
                                                    <span className="sm:hidden">
                                                        WhatsApp
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
