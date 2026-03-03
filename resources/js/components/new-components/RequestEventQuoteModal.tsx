import { DatePickerModal } from '@/components/DatePickerModal';
import { useSelectedPackage } from '@/hooks/SelectedPackageContext';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Building2,
    Calendar,
    Mail,
    MessageSquare,
    Minus,
    Phone,
    Plus,
    User,
    Users,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Inter:wght@400;500;600;700&display=swap');

  .eb2-overlay {
    position: fixed; inset: 0; z-index: 50;
    background: rgba(26,15,6,0.55);
    backdrop-filter: blur(4px);
    display: flex; align-items: flex-end;
  }
  @media (min-width: 700px) {
    .eb2-overlay { align-items: center; justify-content: center; }
  }

  .eb2-modal {
    background: #fffdf9;
    border-radius: 28px 28px 0 0;
    width: 96vw;
    max-height: 96vh;
    overflow-y: auto;
    box-shadow: 0 -8px 48px rgba(0,0,0,0.18);
    display: flex; flex-direction: column;
  }
  @media (min-width: 700px) {
    .eb2-modal { border-radius: 28px; width: min(860px, 94vw); max-height: 96vh; }
  }

  .eb2-hero {
    position: relative; height: 200px; overflow: hidden;
    border-radius: 28px 28px 0 0; flex-shrink: 0;
  }
  .eb2-hero img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .eb2-hero::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.62) 100%);
    pointer-events: none;
  }
  .eb2-hero-text {
    position: absolute; bottom: 18px; left: 24px; right: 60px; z-index: 1;
  }
  .eb2-hero-text h2 {
    font-family: 'Cinzel', serif; font-size: 1.25rem; font-weight: 700; color: #fff;
    margin: 0 0 4px; text-shadow: 0 1px 8px rgba(0,0,0,0.4);
  }
  .eb2-hero-text p {
    font-size: 0.82rem; color: rgba(255,255,255,0.85); margin: 0;
    text-shadow: 0 1px 4px rgba(0,0,0,0.3);
  }
  .eb2-hero-badge {
    position: absolute; top: 14px; left: 16px; z-index: 2;
    display: inline-block; padding: 3px 12px; border-radius: 999px;
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
    background: rgba(184,146,75,0.92); color: #fff;
    border: 1px solid rgba(255,255,255,0.25); box-shadow: 0 2px 8px rgba(0,0,0,0.18);
  }

  .eb2-header {
    display: flex; align-items: flex-start; justify-content: space-between;
    padding: 20px 28px 16px;
    border-bottom: 1px solid rgba(184,146,75,0.18);
    position: sticky; top: 0;
    background: #fffdf9; z-index: 2;
    border-radius: 28px 28px 0 0;
  }
  .eb2-header-title {
    font-family: 'Cinzel', serif;
    font-size: 1.05rem; font-weight: 600; color: #1a0f06; margin-bottom: 2px;
  }
  .eb2-header-sub { font-size: 0.82rem; color: #9a7d5a; }

  .eb2-header-with-hero {
    border-radius: 0;
    border-top: none;
  }

  .eb2-close {
    width: 36px; height: 36px; border-radius: 50%; border: none;
    background: rgba(90,62,43,0.08); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: #5a3e2b; flex-shrink: 0; transition: background 0.15s ease;
  }
  .eb2-close:hover { background: rgba(90,62,43,0.16); }
  .eb2-close-on-hero {
    position: absolute; top: 12px; right: 12px; z-index: 3;
    background: rgba(255,255,255,0.82); backdrop-filter: blur(6px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.14);
  }
  .eb2-close-on-hero:hover { background: #fff; }

  .eb2-body { padding: 24px 28px; flex: 1; overflow-y: auto; }
  .eb2-footer {
    padding: 16px 28px;
    border-top: 1px solid rgba(184,146,75,0.15);
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
    position: sticky; bottom: 0; background: #fffdf9; z-index: 2;
    flex-wrap: wrap;
  }

  .eb2-section-label {
    font-family: 'Cinzel', serif;
    font-size: 0.88rem; font-weight: 600; color: #1a0f06;
    display: flex; align-items: center; gap: 8px;
    margin-bottom: 14px;
  }

  .eb2-desc {
    font-size: 0.86rem; line-height: 1.7; color: #5a3e2b;
    background: rgba(184,146,75,0.05);
    border: 1px solid rgba(184,146,75,0.18);
    border-radius: 14px; padding: 14px 18px;
    margin-bottom: 24px;
  }
  .eb2-desc p { margin: 0 0 8px; }
  .eb2-desc p:last-child { margin-bottom: 0; }
  .eb2-desc ul { padding-left: 18px; margin: 0 0 8px; }
  .eb2-desc li { margin-bottom: 3px; }
  .eb2-desc strong { color: #3b2712; }

  .eb2-date-btn {
    display: flex; align-items: center; gap: 12px;
    padding: 13px 18px; border-radius: 16px;
    border: 1.5px solid rgba(184,146,75,0.3);
    background: #fff; cursor: pointer;
    text-align: left; font-family: inherit; width: 100%;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
    margin-bottom: 20px;
  }
  .eb2-date-btn:hover { border-color: rgba(184,146,75,0.6); box-shadow: 0 2px 12px rgba(184,146,75,0.12); }
  .eb2-date-btn.has-value { border-color: rgba(184,146,75,0.55); background: rgba(255,251,240,0.8); }
  .eb2-date-icon { color: #b8924b; flex-shrink: 0; }
  .eb2-date-texts { display: flex; flex-direction: column; gap: 2px; }
  .eb2-date-label { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #8a6830; }
  .eb2-date-value { font-size: 0.96rem; font-weight: 600; color: #1a0f06; }
  .eb2-date-placeholder { font-size: 0.96rem; color: #b89c7a; }

  .eb2-guest-section {
    background: rgba(255,251,240,0.8);
    border: 1px solid rgba(184,146,75,0.25);
    border-radius: 20px; padding: 18px 22px; margin-bottom: 24px;
  }
  .eb2-guest-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 0; border-bottom: 1px solid rgba(184,146,75,0.1);
  }
  .eb2-guest-row:last-child { border-bottom: none; padding-bottom: 0; }
  .eb2-guest-label { font-size: 0.88rem; font-weight: 600; color: #1a0f06; display: flex; align-items: center; gap: 7px; }
  .eb2-guest-sub { font-size: 0.73rem; color: #9a7d5a; margin-top: 1px; }
  .eb2-counter { display: flex; align-items: center; gap: 10px; }
  .eb2-counter-btn {
    width: 30px; height: 30px; border-radius: 50%;
    border: 1.5px solid rgba(184,146,75,0.4);
    background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center;
    color: #8a6830; transition: all 0.15s ease; font-family: inherit;
  }
  .eb2-counter-btn:hover:not(:disabled) { background: rgba(184,146,75,0.12); border-color: rgba(184,146,75,0.7); }
  .eb2-counter-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .eb2-counter-val {
    font-size: 1rem; font-weight: 700; color: #1a0f06; min-width: 22px; text-align: center;
  }

  .eb2-divider { border: none; border-top: 1px solid rgba(184,146,75,0.18); margin: 24px 0; }

  .eb2-form-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;
  }
  @media (max-width: 500px) { .eb2-form-grid { grid-template-columns: 1fr; } }

  .eb2-field { display: flex; flex-direction: column; gap: 6px; }
  .eb2-field.full { grid-column: 1 / -1; }
  .eb2-field-label {
    font-size: 0.72rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.06em; color: #8a6830;
    display: flex; align-items: center; gap: 5px;
  }
  .eb2-input {
    padding: 11px 14px; border-radius: 12px;
    border: 1.5px solid rgba(184,146,75,0.28);
    background: #fff; font-family: inherit; font-size: 0.92rem;
    color: #1a0f06; outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
    width: 100%; box-sizing: border-box;
  }
  .eb2-input:focus { border-color: rgba(184,146,75,0.65); box-shadow: 0 0 0 3px rgba(184,146,75,0.12); }
  .eb2-input::placeholder { color: #c4a97a; }
  .eb2-textarea {
    padding: 11px 14px; border-radius: 12px;
    border: 1.5px solid rgba(184,146,75,0.28);
    background: #fff; font-family: inherit; font-size: 0.92rem;
    color: #1a0f06; outline: none; resize: vertical; min-height: 88px;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
    width: 100%; box-sizing: border-box;
  }
  .eb2-textarea:focus { border-color: rgba(184,146,75,0.65); box-shadow: 0 0 0 3px rgba(184,146,75,0.12); }
  .eb2-textarea::placeholder { color: #c4a97a; }

  .eb2-summary {
    background: linear-gradient(135deg, rgba(184,146,75,0.08), rgba(184,146,75,0.04));
    border: 1px solid rgba(184,146,75,0.22);
    border-radius: 16px; padding: 14px 18px; margin-top: 18px;
    display: flex; flex-wrap: wrap; gap: 8px; align-items: center;
  }
  .eb2-summary-chip {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 12px; border-radius: 999px;
    background: rgba(184,146,75,0.12); border: 1px solid rgba(184,146,75,0.28);
    font-size: 0.78rem; font-weight: 600; color: #7a5520;
  }

  .eb2-success {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 52px 32px; text-align: center; gap: 16px;
  }
  .eb2-success-icon {
    width: 72px; height: 72px; border-radius: 50%;
    background: linear-gradient(135deg, rgba(184,146,75,0.2), rgba(184,146,75,0.08));
    border: 2px solid rgba(184,146,75,0.4);
    display: flex; align-items: center; justify-content: center; font-size: 2rem;
  }
  .eb2-success-title {
    font-family: 'Cinzel', serif; font-size: 1.3rem; font-weight: 700; color: #1a0f06;
  }
  .eb2-success-sub { font-size: 0.92rem; color: #7a5a3a; max-width: 360px; line-height: 1.6; }

  .eb2-submit {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 13px 28px; border-radius: 14px; border: none;
    background: linear-gradient(135deg, #b8924b, #8a6830);
    color: #fff; font-size: 0.95rem; font-weight: 700; cursor: pointer;
    box-shadow: 0 4px 16px rgba(184,146,75,0.35);
    font-family: inherit; transition: all 0.15s ease;
  }
  .eb2-submit:hover:not(:disabled) { box-shadow: 0 6px 22px rgba(184,146,75,0.5); transform: translateY(-1px); }
  .eb2-submit:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

  .eb2-alt-btn {
    display: flex; align-items: center; justify-content: center; gap: 7px;
    padding: 11px 18px; border-radius: 14px;
    font-size: 0.88rem; font-weight: 600; cursor: pointer;
    font-family: inherit; transition: all 0.15s ease;
    white-space: nowrap;
  }
  .eb2-whatsapp-btn {
    background: #25D366; color: #fff; border: none;
    box-shadow: 0 3px 12px rgba(37,211,102,0.3);
  }
  .eb2-whatsapp-btn:hover:not(:disabled) { box-shadow: 0 5px 18px rgba(37,211,102,0.45); transform: translateY(-1px); }
  .eb2-email-btn {
    background: #fff; color: #5a3e2b;
    border: 1.5px solid rgba(184,146,75,0.4);
  }
  .eb2-email-btn:hover:not(:disabled) { border-color: rgba(184,146,75,0.7); background: rgba(255,251,240,0.8); transform: translateY(-1px); }
  .eb2-alt-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none !important; }

  .eb2-footer-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

  .eb2-small { font-size: 0.82rem; color: #9a7d5a; }

  .eb2-divider-label {
    font-size: 0.7rem; color: #9a7d5a; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.06em; white-space: nowrap;
  }
`;

interface ContactForm {
    name: string;
    email: string;
    phone: string;
    organisation: string;
    message: string;
}

export default function EventBookingModal() {
    const {
        showEventBookingModal,
        setShowEventBookingModal,
        selectedEventItem,
    } = useSelectedPackage();

    const [eventType, setEventType] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [numGuests, setNumGuests] = useState(30);
    const [form, setForm] = useState<ContactForm>({
        name: '',
        email: '',
        phone: '',
        organisation: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const bodyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!showEventBookingModal) {
            setSubmitted(false);
            setIsSubmitting(false);
            setShowDatePicker(false);
        } else {
            setEventType(selectedEventItem?.title ?? '');
            setEventDate('');
            setNumGuests(30);
            setForm({
                name: '',
                email: '',
                phone: '',
                organisation: '',
                message: '',
            });
            setSubmitted(false);
        }
    }, [showEventBookingModal, selectedEventItem]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (showDatePicker) {
                    setShowDatePicker(false);
                    return;
                }
                handleClose();
            }
        };
        if (showEventBookingModal)
            document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [showEventBookingModal, showDatePicker]);

    useEffect(() => {
        document.body.style.overflow = showEventBookingModal ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [showEventBookingModal]);

    const formatDate = (d: string) =>
        d
            ? new Date(d).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
              })
            : null;

    const canSubmit =
        eventDate &&
        form.name.trim() &&
        (form.email.trim() || form.phone.trim());

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const getEnquiryMessage = () => {
        const visit = eventDate ? formatDate(eventDate) : 'Not selected';
        return `🏰 *Tafaria Castle – Event Enquiry*

Package: ${selectedEventItem?.title || '(not specified)'}
Event Type: ${eventType || '(not specified)'}

Name: ${form.name.trim() || '(not provided)'}
Organisation: ${form.organisation.trim() || '—'}
Email: ${form.email.trim() || '—'}
Phone: ${form.phone.trim() || '—'}

Preferred Event Date: ${visit}
Estimated Guests: ${numGuests}

Additional Details:
${form.message.trim() || '(none)'}

Please prepare a proposal for the above. Thank you! 🙏`;
    };

    const sendToWhatsApp = () => {
        const phone = '+254708877244';
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(getEnquiryMessage())}`;
        window.open(url, '_blank');
    };

    const sendToEmail = () => {
        const email = 'info@tafaria.com';
        const subject =
            'Event Enquiry – ' +
            (selectedEventItem?.title || eventType || 'Tafaria');
        const body = getEnquiryMessage()
            .replace(/\*/g, '')
            .replace(/🏰/g, '[Tafaria] ');
        const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(url, '_blank');
    };

    const handleSubmit = async () => {
        if (!canSubmit) return;
        setIsSubmitting(true);
        try {
            await axios.post(
                'https://website-cms.tafaria.com/api/event-bookings',
                {
                    package_title: selectedEventItem?.title ?? '',
                    event_type: eventType,
                    event_date: eventDate,
                    num_guests: numGuests,
                    ...form,
                },
            );
            setSubmitted(true);
        } catch {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setShowEventBookingModal(false);
        setTimeout(() => {
            setSubmitted(false);
            setEventType('');
            setEventDate('');
            setShowDatePicker(false);
            setNumGuests(30);
            setForm({
                name: '',
                email: '',
                phone: '',
                organisation: '',
                message: '',
            });
        }, 300);
    };

    const GuestCounter = ({
        value,
        onIncrement,
        onDecrement,
        min = 1,
    }: {
        value: number;
        onIncrement: () => void;
        onDecrement: () => void;
        min?: number;
    }) => (
        <div className="eb2-counter">
            <motion.button
                className="eb2-counter-btn"
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
                className="eb2-counter-val"
            >
                {value}
            </motion.span>
            <motion.button
                className="eb2-counter-btn"
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
                {showEventBookingModal && (
                    <motion.div
                        className="eb2-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        onClick={(e) => {
                            if (e.target === e.currentTarget) handleClose();
                        }}
                    >
                        <motion.div
                            className="eb2-modal"
                            initial={{ opacity: 0, y: 60, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 40, scale: 0.97 }}
                            transition={{
                                type: 'spring',
                                stiffness: 300,
                                damping: 30,
                            }}
                        >
                            {selectedEventItem?.image ? (
                                <div className="eb2-hero">
                                    <img
                                        src={selectedEventItem.image}
                                        alt={selectedEventItem.title ?? ''}
                                    />
                                    {selectedEventItem.badge_content && (
                                        <span className="eb2-hero-badge">
                                            {selectedEventItem.badge_content}
                                        </span>
                                    )}
                                    <div className="eb2-hero-text">
                                        <h2>
                                            {selectedEventItem.title ??
                                                'Book Your Event'}
                                        </h2>
                                        {selectedEventItem.subtitle && (
                                            <p>{selectedEventItem.subtitle}</p>
                                        )}
                                    </div>
                                    <button
                                        className="eb2-close eb2-close-on-hero"
                                        onClick={handleClose}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div className="eb2-header">
                                    <div>
                                        <div className="eb2-header-title">
                                            {selectedEventItem?.title ??
                                                'Book Your Event'}
                                        </div>
                                        <div className="eb2-header-sub">
                                            Tell us about your event &amp; we'll
                                            prepare a proposal
                                        </div>
                                    </div>
                                    <button
                                        className="eb2-close"
                                        onClick={handleClose}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )}

                            {selectedEventItem?.image && (
                                <div className="eb2-header eb2-header-with-hero">
                                    <div>
                                        <div className="eb2-header-sub">
                                            Tell us about your event &amp; we'll
                                            prepare a proposal
                                        </div>
                                    </div>
                                </div>
                            )}

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
                                        <div className="eb2-success">
                                            <motion.div
                                                className="eb2-success-icon"
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
                                                className="eb2-success-title"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                Enquiry Received!
                                            </motion.div>
                                            <motion.div
                                                className="eb2-success-sub"
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.28 }}
                                            >
                                                Thank you,{' '}
                                                <strong>{form.name}</strong>.
                                                Our events team will prepare a
                                                tailored proposal for your{' '}
                                                <strong>
                                                    {eventType ||
                                                        selectedEventItem?.title ||
                                                        'event'}
                                                </strong>{' '}
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
                                        <div className="eb2-body" ref={bodyRef}>
                                            {selectedEventItem?.description && (
                                                <div
                                                    className="eb2-desc"
                                                    dangerouslySetInnerHTML={{
                                                        __html: DOMPurify.sanitize(
                                                            selectedEventItem.description,
                                                        ),
                                                    }}
                                                />
                                            )}

                                            <div className="eb2-section-label">
                                                <Calendar
                                                    size={15}
                                                    color="#b8924b"
                                                />
                                                Preferred Date
                                            </div>

                                            <motion.button
                                                className={`eb2-date-btn ${eventDate ? 'has-value' : ''}`}
                                                onClick={() =>
                                                    setShowDatePicker((v) => !v)
                                                }
                                                whileHover={{ scale: 1.01 }}
                                                whileTap={{ scale: 0.99 }}
                                            >
                                                <Calendar
                                                    size={20}
                                                    className="eb2-date-icon"
                                                />
                                                <div className="eb2-date-texts">
                                                    <span className="eb2-date-label">
                                                        Preferred event date *
                                                    </span>
                                                    {eventDate ? (
                                                        <span className="eb2-date-value">
                                                            {formatDate(
                                                                eventDate,
                                                            )}
                                                        </span>
                                                    ) : (
                                                        <span className="eb2-date-placeholder">
                                                            Select a date
                                                        </span>
                                                    )}
                                                </div>
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
                                                            checkIn={eventDate}
                                                            checkOut=""
                                                            setCheckIn={(v) => {
                                                                setEventDate(v);
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

                                            <div className="eb2-section-label">
                                                <Users
                                                    size={15}
                                                    color="#b8924b"
                                                />
                                                Estimated Guest Count
                                            </div>
                                            <div className="eb2-guest-section">
                                                <div className="eb2-guest-row">
                                                    <div>
                                                        <div className="eb2-guest-label">
                                                            <Users
                                                                size={14}
                                                                color="#b8924b"
                                                            />
                                                            Number of Guests
                                                        </div>
                                                        <div className="eb2-guest-sub">
                                                            Approximate
                                                            headcount for the
                                                            event
                                                        </div>
                                                    </div>
                                                    <GuestCounter
                                                        value={numGuests}
                                                        min={1}
                                                        onIncrement={() =>
                                                            setNumGuests(
                                                                (v) => v + 1,
                                                            )
                                                        }
                                                        onDecrement={() =>
                                                            setNumGuests((v) =>
                                                                Math.max(
                                                                    1,
                                                                    v - 5,
                                                                ),
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            <hr className="eb2-divider" />

                                            <div className="eb2-section-label">
                                                <User
                                                    size={15}
                                                    color="#b8924b"
                                                />
                                                Your Details
                                            </div>

                                            <div className="eb2-form-grid">
                                                <div className="eb2-field">
                                                    <label className="eb2-field-label">
                                                        <User size={11} /> Full
                                                        Name *
                                                    </label>
                                                    <input
                                                        className="eb2-input"
                                                        name="name"
                                                        value={form.name}
                                                        onChange={handleChange}
                                                        placeholder="Jane Doe"
                                                    />
                                                </div>
                                                <div className="eb2-field">
                                                    <label className="eb2-field-label">
                                                        <Building2 size={11} />{' '}
                                                        Organisation
                                                    </label>
                                                    <input
                                                        className="eb2-input"
                                                        name="organisation"
                                                        value={
                                                            form.organisation
                                                        }
                                                        onChange={handleChange}
                                                        placeholder="Company / Family name"
                                                    />
                                                </div>
                                                <div className="eb2-field">
                                                    <label className="eb2-field-label">
                                                        <Mail size={11} /> Email
                                                        *
                                                    </label>
                                                    <input
                                                        className="eb2-input"
                                                        name="email"
                                                        type="email"
                                                        value={form.email}
                                                        onChange={handleChange}
                                                        placeholder="jane@example.com"
                                                    />
                                                </div>
                                                <div className="eb2-field">
                                                    <label className="eb2-field-label">
                                                        <Phone size={11} />{' '}
                                                        Phone
                                                    </label>
                                                    <input
                                                        className="eb2-input"
                                                        name="phone"
                                                        value={form.phone}
                                                        onChange={handleChange}
                                                        placeholder="+254 700 000 000"
                                                    />
                                                </div>
                                                <div className="eb2-field full">
                                                    <label className="eb2-field-label">
                                                        <MessageSquare
                                                            size={11}
                                                        />{' '}
                                                        Additional Details
                                                    </label>
                                                    <textarea
                                                        className="eb2-textarea"
                                                        name="message"
                                                        value={form.message}
                                                        onChange={handleChange}
                                                        placeholder="Share any specific requirements, themes, catering needs or questions…"
                                                    />
                                                </div>
                                            </div>

                                            {(eventDate ||
                                                eventType ||
                                                numGuests) && (
                                                <div className="eb2-summary">
                                                    {eventType && (
                                                        <span className="eb2-summary-chip">
                                                            <Calendar
                                                                size={12}
                                                            />{' '}
                                                            {eventType}
                                                        </span>
                                                    )}
                                                    {eventDate && (
                                                        <span className="eb2-summary-chip">
                                                            <Calendar
                                                                size={12}
                                                            />{' '}
                                                            {formatDate(
                                                                eventDate,
                                                            )}
                                                        </span>
                                                    )}
                                                    <span className="eb2-summary-chip">
                                                        <Users size={12} /> ~
                                                        {numGuests} guests
                                                    </span>
                                                    {selectedEventItem?.title && (
                                                        <span className="eb2-summary-chip">
                                                            {
                                                                selectedEventItem.title
                                                            }
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="eb2-footer">
                                            <div className="flex gap-3 sm:flex-2">
                                                <motion.button
                                                    className="eb2-alt-btn eb2-email-btn flex flex-1"
                                                    onClick={sendToEmail}
                                                    disabled={!canSubmit}
                                                    whileHover={
                                                        canSubmit
                                                            ? { scale: 1.03 }
                                                            : {}
                                                    }
                                                    whileTap={
                                                        canSubmit
                                                            ? { scale: 0.97 }
                                                            : {}
                                                    }
                                                    title="Send via Email"
                                                >
                                                    <Mail size={14} />
                                                    <span className="hidden sm:inline">
                                                        Send via Email
                                                    </span>
                                                    <span className="sm:hidden">
                                                        Email
                                                    </span>
                                                </motion.button>
                                                <motion.button
                                                    className="eb2-alt-btn eb2-whatsapp-btn flex flex-1"
                                                    onClick={sendToWhatsApp}
                                                    disabled={!canSubmit}
                                                    whileHover={
                                                        canSubmit
                                                            ? { scale: 1.03 }
                                                            : {}
                                                    }
                                                    whileTap={
                                                        canSubmit
                                                            ? { scale: 0.97 }
                                                            : {}
                                                    }
                                                    title="Send via WhatsApp"
                                                >
                                                    <svg
                                                        width="15"
                                                        height="15"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                    >
                                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                                    </svg>
                                                    <span className="hidden sm:inline">
                                                        Send to WhatsApp
                                                    </span>
                                                    <span className="sm:hidden">
                                                        WhatsApp
                                                    </span>
                                                </motion.button>
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
