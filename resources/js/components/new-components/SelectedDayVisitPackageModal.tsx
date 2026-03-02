import { DatePickerModal } from '@/components/DatePickerModal';
import { ExperiencesTab } from '@/components/ExperiencesTab';
import { SelectionModal } from '@/components/SelectionModal';
import { useRatesBooking } from '@/hooks/RatesCartContext';
import { useSelectedPackage } from '@/hooks/SelectedPackageContext';
import { calculateNights, isHoliday } from '@/lib/dateUtils';
import { getKidsMealCost, getRoomRate, getSupplement } from '@/lib/rateUtils';
import { DayVisitPackageItem } from '@/types';
import {
    ConferencePackage,
    LeisureExperience,
    LeisureRoom,
    Meal,
    RatesDescription,
    Residency,
    Room,
} from '@/types/types';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Calendar,
    Minus,
    Plus,
    ShoppingCart,
    Sparkles,
    Tag,
    Users,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { RecreationTab } from '../RecreationTab';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Inter:wght@400;500;600;700&display=swap');

  
  .row { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }



  .tabs { display:flex; gap:0; background:rgba(184,146,75,0.1); border:1px solid rgba(184,146,75,0.25); border-radius:16px; padding:4px; margin-bottom:32px; }
  .tab {
    flex:1; padding:12px 20px; border-radius:12px; border:none;
    font-size:0.9rem; font-weight:600; cursor:pointer; font-family:inherit;
    color:#5a3e2b; background:transparent;
    transition: background 0.2s ease, color 0.2s ease;
  }
  .tab.active { color:#7a5520; box-shadow:0 2px 10px rgba(0,0,0,0.08); }

  .section-header { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:14px; margin-bottom:20px; }

  .package-section {
    border: 1px solid rgba(184,146,75,0.2);
    border-radius: 24px;
    padding: 32px;
    margin-bottom: 32px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.05);
  }

  .rates-wrapper {
    background: linear-gradient(135deg, rgba(90,62,43,0.04), rgba(184,146,75,0.08));
    border: 1px solid rgba(184,146,75,0.2);
    border-radius: 24px;
    padding: 32px;
    margin-top: 12px;
  }
  .rates-label {
    font-family: 'Cinzel', serif;
    font-size: 1.1rem; font-weight: 600; color: #1a0f06;
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(184,146,75,0.2);
  }

  .dining-image { height: 220px; overflow: hidden; }
  .dining-image img { width:100%; height:100%; object-fit:cover; display:block; }
  .dining-text { display:flex; flex-direction:column; justify-content:center; }
  .meta-row { display:flex; flex-wrap:wrap; gap:8px; margin:14px 0; }

  .amenity-card { padding: 20px; }

  .toast {
    position: fixed; top: 40px; right: 16px; z-index: 9999;
    background: #902729; color: #fff;
    border-radius: 16px; padding: 14px 20px;
    display: flex; align-items: center; gap: 10px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    animation: slide-in 0.3s ease-out;
    font-weight: 600;
  }
  @keyframes slide-in {
    from { transform: translateX(100%); opacity: 0; }
    to   { transform: translateX(0);   opacity: 1; }
  }

  .pkg-modal-overlay {
    position: fixed; inset: 0; z-index: 35;
    background: rgba(26,15,6,0.55);
    backdrop-filter: blur(4px);
    display: flex; align-items: flex-end;
  }
  @media (min-width: 700px) {
    .pkg-modal-overlay { align-items: center; justify-content: center; }
  }

  .pkg-modal {
    background: #fffdf9;
    border-radius: 28px 28px 0 0;
    width:96vw;
    max-height: 96vh;
    overflow-y: auto;
    box-shadow: 0 -8px 48px rgba(0,0,0,0.18);
    display: flex; flex-direction: column;
  }
  @media (min-width: 700px) {
    .pkg-modal {
      border-radius: 28px;
      width: min(1100px, 94vw);
      max-height: 96vh;
    }
  }

  .pkg-modal-header {
    display: flex; align-items: flex-start; justify-content: space-between;
    padding: 15px 32px;
    border-bottom: 1px solid rgba(184,146,75,0.18);
    position: sticky; top: 0;
    background: #fffdf9; z-index: 2;
    border-radius: 28px 28px 0 0;
  }
  .pkg-modal-close {
    width: 36px; height: 36px; border-radius: 50%; border: none;
    background: rgba(90,62,43,0.08); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: #5a3e2b; flex-shrink: 0;
    transition: background 0.15s ease;
  }
  .pkg-modal-close:hover { background: rgba(90,62,43,0.16); }

  .pkg-modal-body { padding:15px 32px; flex: 1; overflow-y: auto; }

  .step-indicator {
    display: flex; align-items: center; gap: 8px;
    margin-bottom: 28px;
  }
  .step-dot {
    width: 28px; height: 28px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.75rem; font-weight: 700; font-family: inherit;
    transition: all 0.2s ease;
  }
  .step-dot.active { background: linear-gradient(135deg,#b8924b,#8a6830); color: #fff; box-shadow: 0 2px 8px rgba(184,146,75,0.4); }
  .step-dot.done   { background: rgba(184,146,75,0.2); color: #8a6830; }
  .step-dot.idle   { background: rgba(90,62,43,0.08); color: #9a7d5a; }
  .step-line { flex: 1; height: 2px; background: rgba(184,146,75,0.2); border-radius: 2px; }
  .step-line.done { background: rgba(184,146,75,0.5); }
  .step-label { font-size: 0.78rem; font-weight: 600; color: #8a6830; }

  .date-prompt { font-family: 'Cinzel', serif; font-size: 1.35rem; font-weight: 600; color: #1a0f06; margin-bottom: 8px; }
  .date-subtext { font-size: 0.95rem; color: #7a5a3a; margin-bottom: 28px; }

  .date-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 28px; }
  @media (max-width: 500px) { .date-fields { grid-template-columns: 1fr; } }

  .date-field-btn {
    display: flex; flex-direction: column; gap: 4px;
    padding: 12px 20px; border-radius: 16px;
    border: 1.5px solid rgba(184,146,75,0.3);
    background: #fff; cursor: pointer;
    text-align: left; font-family: inherit;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }
  .date-field-btn:hover { border-color: rgba(184,146,75,0.6); box-shadow: 0 2px 12px rgba(184,146,75,0.15); }
  .date-field-btn.has-value { border-color: rgba(184,146,75,0.55); background: rgba(255,251,240,0.8); }
  .date-field-label { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #8a6830; }
  .date-field-value { font-size: 1rem; font-weight: 600; color: #1a0f06; }
  .date-field-placeholder { font-size: 1rem; color: #b89c7a; }

  .nights-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 16px; border-radius: 999px;
    background: rgba(184,146,75,0.12); border: 1px solid rgba(184,146,75,0.3);
    font-size: 0.85rem; font-weight: 600; color: #7a5520;
    margin-bottom: 24px;
  }

  .pkg-modal-footer {
    padding: 12px 32px;
    border-top: 1px solid rgba(184,146,75,0.15);
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
    position: sticky; bottom: 0; background: #fffdf9; z-index: 2;
  }

  .guest-section {
    background: rgba(255,251,240,0.8);
    border: 1px solid rgba(184,146,75,0.25);
    border-radius: 20px;
    padding: 24px;
    margin-top: 0;
  }
  .guest-section-title {
    font-family: 'Cinzel', serif;
    font-size: 0.92rem; font-weight: 600; color: #1a0f06;
    margin-bottom: 18px;
    display: flex; align-items: center; gap: 8px;
  }
  .guest-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid rgba(184,146,75,0.12);
  }
  .guest-row:last-child { border-bottom: none; padding-bottom: 0; }
  .guest-info { display: flex; flex-direction: column; gap: 2px; }
  .guest-label { font-size: 0.9rem; font-weight: 600; color: #1a0f06; }
  .guest-sublabel { font-size: 0.75rem; color: #9a7d5a; }
  .guest-counter { display: flex; align-items: center; gap: 10px; }
  .counter-btn {
    width: 32px; height: 32px; border-radius: 50%; border: 1.5px solid rgba(184,146,75,0.4);
    background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center;
    color: #8a6830; transition: all 0.15s ease;
    font-family: inherit;
  }
  .counter-btn:hover:not(:disabled) { background: rgba(184,146,75,0.12); border-color: rgba(184,146,75,0.7); }
  .counter-btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .counter-value { font-size: 1rem; font-weight: 700; color: #1a0f06; min-width: 20px; text-align: center; }

  .upsell-overlay {
    position: fixed; inset: 0; z-index: 60;
    background: rgba(26,15,6,0.6);
    backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
  }
  .upsell-modal {
    background: #fffdf9;
    border-radius: 28px;
    width: min(500px, 96vw);
    overflow: hidden;
    box-shadow: 0 24px 80px rgba(0,0,0,0.25);
  }
  .upsell-header {
    position: relative; overflow: hidden;
    padding: 36px 32px 28px;
    background: linear-gradient(135deg, #1a0f06, #3d2010);
    text-align: center;
  }
  .upsell-sparkle {
    position: absolute; inset: 0; opacity: 0.07;
    background-image: radial-gradient(circle at 20% 50%, #b8924b 0%, transparent 60%),
                      radial-gradient(circle at 80% 50%, #8a6830 0%, transparent 60%);
  }
  .upsell-icon-wrap {
    width: 64px; height: 64px; border-radius: 50%;
    background: rgba(184,146,75,0.2); border: 1.5px solid rgba(184,146,75,0.4);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 16px;
  }
  .upsell-title {
    font-family: 'Cinzel', serif; font-size: 1.4rem; font-weight: 700;
    color: #f5e6c8; margin-bottom: 8px; position: relative;
  }
  .upsell-subtitle { font-size: 0.9rem; color: rgba(245,230,200,0.7); position: relative; }
  .upsell-body { padding: 28px 32px; }
  .upsell-offer-card {
    background: linear-gradient(135deg, rgba(184,146,75,0.08), rgba(184,146,75,0.04));
    border: 1px solid rgba(184,146,75,0.25);
    border-radius: 16px; padding: 18px 20px; margin-bottom: 20px;
  }
  .upsell-offer-name { font-size: 1rem; font-weight: 700; color: #1a0f06; margin-bottom: 4px; }
  .upsell-offer-desc { font-size: 0.85rem; color: #7a5a3a; margin-bottom: 12px; line-height: 1.5; }
  .upsell-price-row { display: flex; align-items: baseline; gap: 6px; }
  .upsell-price { font-size: 1.3rem; font-weight: 800; color: #8a6830; }
  .upsell-price-per { font-size: 0.8rem; color: #9a7d5a; }
  .upsell-total { font-size: 0.85rem; color: #5a3e2b; font-weight: 600; margin-top: 6px; }
  .upsell-actions { display: flex; flex-direction: column; gap: 10px; }
  .upsell-accept {
    width: 100%; padding: 14px; border-radius: 14px; border: none;
    background: linear-gradient(135deg, #b8924b, #8a6830);
    color: #fff; font-size: 0.95rem; font-weight: 700; cursor: pointer;
    box-shadow: 0 4px 16px rgba(184,146,75,0.35);
    font-family: inherit; transition: all 0.15s ease;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .upsell-accept:hover { box-shadow: 0 6px 22px rgba(184,146,75,0.5); transform: translateY(-1px); }
  .upsell-decline {
    width: 100%; padding: 12px; border-radius: 14px;
    border: 1px solid rgba(90,62,43,0.18);
    background: transparent; color: #7a5a3a;
    font-size: 0.88rem; font-weight: 600; cursor: pointer;
    font-family: inherit; transition: background 0.15s ease;
  }
  .upsell-decline:hover { background: rgba(90,62,43,0.05); }

  .dv-modal-overlay {
    position: fixed; inset: 0; z-index: 45;
    background: rgba(26,15,6,0.55);
    backdrop-filter: blur(4px);
    display: flex; align-items: flex-end;
  }
  @media (min-width: 700px) {
    .dv-modal-overlay { align-items: center; justify-content: center; }
  }
  .dv-modal {
    background: #fffdf9;
    border-radius: 28px 28px 0 0;
    width: 96vw;
    max-height: 96vh;
    overflow-y: auto;
    box-shadow: 0 -8px 48px rgba(0,0,0,0.18);
    display: flex; flex-direction: column;
  }
  @media (min-width: 700px) {
    .dv-modal { border-radius: 28px; width: min(680px, 94vw); max-height: 96vh; }
  }
  .dv-modal-header {
    display: flex; align-items: flex-start; justify-content: space-between;
    padding: 20px 28px 16px;
    border-bottom: 1px solid rgba(184,146,75,0.18);
    position: sticky; top: 0;
    background: #fffdf9; z-index: 2;
    border-radius: 28px 28px 0 0;
  }
  .dv-modal-body { padding: 24px 28px; flex: 1; overflow-y: auto; }
  .dv-modal-footer {
    padding: 16px 28px;
    border-top: 1px solid rgba(184,146,75,0.15);
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
    position: sticky; bottom: 0; background: #fffdf9; z-index: 2;
  }

  .dv-price-breakdown {
    background: linear-gradient(135deg, rgba(184,146,75,0.08), rgba(184,146,75,0.04));
    border: 1px solid rgba(184,146,75,0.25);
    border-radius: 20px;
    padding: 20px 24px;
    margin-top: 24px;
  }
  .dv-price-title {
    font-family: 'Cinzel', serif;
    font-size: 0.85rem; font-weight: 600; color: #8a6830;
    text-transform: uppercase; letter-spacing: 0.05em;
    margin-bottom: 14px;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(184,146,75,0.2);
  }
  .dv-price-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 6px 0; font-size: 0.88rem; color: #5a3e2b;
  }
  .dv-price-row.total {
    font-size: 1.05rem; font-weight: 700; color: #1a0f06;
    margin-top: 10px; padding-top: 12px;
    border-top: 1px solid rgba(184,146,75,0.25);
  }
  .dv-price-row.extra { color: #8a6830; font-size: 0.82rem; }
  .dv-price-amount { font-weight: 600; }
  .dv-price-row.total .dv-price-amount { color: #7a5520; font-size: 1.15rem; }

  .dv-single-date-field {
    display: flex; flex-direction: column; gap: 4px;
    padding: 14px 20px; border-radius: 16px;
    border: 1.5px solid rgba(184,146,75,0.3);
    background: #fff; cursor: pointer;
    text-align: left; font-family: inherit; width: 100%;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
    margin-bottom: 20px;
  }
  .dv-single-date-field:hover { border-color: rgba(184,146,75,0.6); box-shadow: 0 2px 12px rgba(184,146,75,0.15); }
  .dv-single-date-field.has-value { border-color: rgba(184,146,75,0.55); background: rgba(255,251,240,0.8); }

  .dv-package-info {
    border: 1px solid rgba(184,146,75,0.22);
    border-radius: 16px; overflow: hidden;
    margin-bottom: 24px;
  }
  .dv-package-img { height: 160px; overflow: hidden; }
  .dv-package-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .dv-package-meta { padding: 16px 20px; }
  .dv-package-name { font-family: 'Cinzel', serif; font-size: 1.05rem; font-weight: 600; color: #1a0f06; margin-bottom: 4px; }
  .dv-package-base-price {
    display: flex; align-items: baseline; gap: 6px;
    margin-top: 8px;
  }
  .dv-package-price-val { font-size: 1.3rem; font-weight: 800; color: #8a6830; }
  .dv-package-price-per { font-size: 0.8rem; color: #9a7d5a; }
`;

export default function SelectedDayVisitPackageModal() {
    const {
        showBookingModal,
        setShowBookingModal,
        cart,
        addToCart,
        setShowCart,
        boardType,
        setBoardType,
    } = useRatesBooking();

    const [residency] = useState<Residency>('East African Resident');
    const [rooms, setRooms] = useState<Room[]>([]);
    const [leisureRooms, setLeisureRooms] = useState<LeisureRoom[]>([]);
    const [meals, setMeals] = useState<Meal[]>([]);
    const [conferences, setConferences] = useState<ConferencePackage[]>([]);
    const [leisureExperiences, setLeisureExperiences] = useState<
        LeisureExperience[]
    >([]);
    const [dayVisitPackageItems, setDayVisitPackages] = useState<
        DayVisitPackageItem[]
    >([]);
    const [ratesDescriptions, setRatesDescriptions] = useState<
        RatesDescription[]
    >([]);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [selectedLeisureRoom, setSelectedLeisureRoom] =
        useState<LeisureRoom | null>(null);
    const [selectedConference, setSelectedConference] =
        useState<ConferencePackage | null>(null);
    const [selectedLeisure, setSelectedLeisure] =
        useState<LeisureExperience | null>(null);
    const [selectedOccupancy, setSelectedOccupancy] = useState<
        'Single' | 'Double' | null
    >(null);
    const [isLoading, setIsLoading] = useState(true);
    const [numRooms, setNumRooms] = useState(1);
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const datePickerTriggerRef = useRef<HTMLDivElement | null>(null);

    const [numAdults, setNumAdults] = useState(2);
    const [numKids4to11, setNumKids4to11] = useState(0);
    const [numKids0to3, setNumKids0to3] = useState(0);

    const [showUpsellModal, setShowUpsellModal] = useState(false);

    const [visitDate, setVisitDate] = useState('');
    const [showVisitDatePicker, setShowVisitDatePicker] = useState(false);
    const [dvNumAdults, setDvNumAdults] = useState(1);
    const [dvNumKids, setDvNumKids] = useState(0);

    const {
        selectedPackage,
        showSelectedPackageModal,
        setShowSelectedPackageModal,
        selectedDayVisitPackageItem,
        setSelectedDayVisitPackageItem,
        showDayVisitModal,
        setShowDayVisitModal,
    } = useSelectedPackage();

    const [packageStep, setPackageStep] = useState<'dates' | 'rates'>('dates');
    const pkgDateTriggerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [
                    roomsRes,
                    leisureRoomsRes,
                    mealsRes,
                    confRes,
                    leisureRes,
                    descriptionsRes,
                    dayVisitPackagesRes,
                ] = await Promise.all([
                    axios.get('https://website-cms.tafaria.com/api/rooms'),
                    axios.get(
                        'https://website-cms.tafaria.com/api/leisure-rooms',
                    ),
                    axios.get('https://website-cms.tafaria.com/api/meals'),
                    axios.get(
                        'https://website-cms.tafaria.com/api/conference-packages',
                    ),
                    axios.get(
                        'https://website-cms.tafaria.com/api/leisure-experiences',
                    ),
                    axios.get(
                        'https://website-cms.tafaria.com/api/rates-descriptions',
                    ),
                    axios.get(
                        'https://website-cms.tafaria.com/api/day-visit-package-items',
                    ),
                ]);
                setRooms(roomsRes.data.data || []);
                setLeisureRooms(leisureRoomsRes.data.data || []);
                setMeals(mealsRes.data.data || []);
                setConferences(confRes.data.data || []);
                setLeisureExperiences(leisureRes.data || []);
                setRatesDescriptions(descriptionsRes.data || []);
                setDayVisitPackages(dayVisitPackagesRes.data.data || []);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (showUpsellModal) {
                    setShowUpsellModal(false);
                    return;
                }
                if (showVisitDatePicker) {
                    setShowVisitDatePicker(false);
                    return;
                }
                if (showDayVisitModal) {
                    closeDayVisitModal();
                    return;
                }
                if (showDatePicker) {
                    setShowDatePicker(false);
                    return;
                }
                if (showSelectedPackageModal) {
                    setShowSelectedPackageModal(false);
                    return;
                }
                if (showBookingModal) setShowBookingModal(false);
            }
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [
        showDatePicker,
        showBookingModal,
        showSelectedPackageModal,
        showUpsellModal,
        showDayVisitModal,
        showVisitDatePicker,
        setShowBookingModal,
    ]);

    useEffect(() => {
        document.body.style.overflow =
            showBookingModal ||
            showDatePicker ||
            showSelectedPackageModal ||
            showUpsellModal ||
            showDayVisitModal
                ? 'hidden'
                : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [
        showBookingModal,
        showDatePicker,
        showSelectedPackageModal,
        showUpsellModal,
        showDayVisitModal,
    ]);

    const closeModal = () => {
        setShowBookingModal(false);
        setSelectedRoom(null);
        setShowDatePicker(false);
        setSelectedLeisureRoom(null);
        setSelectedConference(null);
        setSelectedLeisure(null);
        setSelectedOccupancy(null);
        setNumRooms(1);
    };

    const closeDayVisitModal = () => {
        setShowDayVisitModal(false);
        setSelectedDayVisitPackageItem(null);
        setVisitDate('');
        setShowVisitDatePicker(false);
        setDvNumAdults(1);
        setDvNumKids(0);
    };

    const calcDayVisitTotal = (
        item: DayVisitPackageItem,
        adults: number,
        kids: number,
    ): number => {
        const totalGuests = adults + kids;
        const basePrice = item.price ?? 0;
        const pax = item.pax ?? 1;
        const extraPaxPrice = item.price_per_extra_pax ?? 0;

        if (pax <= 1) {
            return basePrice * totalGuests;
        }

        if (totalGuests <= pax) {
            return basePrice;
        }

        return basePrice + (totalGuests - pax) * extraPaxPrice;
    };

    const fmtPrice = (v: number) =>
        Number(v).toLocaleString('en-KE', { minimumFractionDigits: 0 });

    const paxLabel = (pax: number | null): string => {
        if (!pax) return '/ person';
        if (pax === 1) return '/ person';
        return `/ group of ${pax}`;
    };

    const getRoomCountInCart = (roomId: string) =>
        cart.reduce(
            (total, item) =>
                (item.kind === 'room' && item.room.id === roomId) ||
                (item.kind === 'leisure-room' && item.room.id === roomId)
                    ? total + item.numRooms
                    : total,
            0,
        );

    const handleAddRoomToCart = (
        room: Room,
        occupancy: 'Single' | 'Double',
    ) => {
        if (cart.length > 0) {
            setCheckIn(cart[0].checkIn);
            setCheckOut(cart[0].checkOut);
        }
        setSelectedRoom(room);
        setSelectedLeisureRoom(null);
        setSelectedConference(null);
        setSelectedLeisure(null);
        setSelectedOccupancy(occupancy);
        setShowBookingModal(true);
    };

    const handleAddLeisureRoomToCart = (
        room: LeisureRoom,
        occupancy: 'Single' | 'Double',
    ) => {
        if (cart.length > 0) {
            setCheckIn(cart[0].checkIn);
            setCheckOut(cart[0].checkOut);
        }
        setSelectedLeisureRoom(room);
        setSelectedRoom(null);
        setSelectedConference(null);
        setSelectedLeisure(null);
        setSelectedOccupancy(occupancy);
        setShowBookingModal(true);
    };

    const handleAddConferenceToCart = (conference: ConferencePackage) => {
        if (cart.length > 0) {
            setCheckIn(cart[0].checkIn);
            setCheckOut(cart[0].checkOut);
        }
        setSelectedConference(conference);
        setSelectedRoom(null);
        setSelectedLeisureRoom(null);
        setSelectedLeisure(null);
        setSelectedOccupancy(null);
        setShowBookingModal(true);
    };

    const handleAddLeisureToCart = (leisure: LeisureExperience) => {
        if (cart.length > 0) {
            setCheckIn(cart[0].checkIn);
            setCheckOut(cart[0].checkOut);
        }
        setSelectedLeisure(leisure);
        setSelectedRoom(null);
        setSelectedLeisureRoom(null);
        setSelectedConference(null);
        setSelectedOccupancy(null);
        setShowBookingModal(true);
    };

    const triggerToast = (message: string) => {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleAddDayVisitToCart = () => {
        if (!selectedDayVisitPackageItem) return;
        if (!visitDate) {
            toast.error('Please select a visit date.');
            return;
        }

        const totalGuests = dvNumAdults + dvNumKids;
        if (totalGuests < 1) {
            toast.error('Please add at least one guest.');
            return;
        }

        const totalCost = calcDayVisitTotal(
            selectedDayVisitPackageItem,
            dvNumAdults,
            dvNumKids,
        );
        const currency = 'KES';

        const syntheticLeisure: LeisureExperience = {
            id: selectedDayVisitPackageItem.id ?? -99,
            title: selectedDayVisitPackageItem.title ?? 'Day Visit',
            description:
                stripHtml(selectedDayVisitPackageItem.description || '') ?? '',
            image_url: selectedDayVisitPackageItem.image ?? null,
            price_adults: selectedDayVisitPackageItem.price ?? 0,
            price_kids: selectedDayVisitPackageItem.price ?? 0,
        };

        addToCart({
            kind: 'leisure',
            leisure: syntheticLeisure,
            numAdults: dvNumAdults,
            numKids: dvNumKids,
            totalCost,
            currency,
            checkIn: visitDate,
            checkOut: visitDate,
            nights: 0,
        });

        triggerToast(`${selectedDayVisitPackageItem.title} added to cart!`);
        closeDayVisitModal();
        setShowCart(true);
    };

    const handleConfirmBooking = (bookingData: {
        isKidsRoom?: boolean;
        hasKidsSharing?: boolean;
        kidsAgesPerRoom?: number[][];
        numGuests?: number;
        numAdults?: number;
        numKids?: number;
    }) => {
        if (!checkIn || !checkOut) {
            toast.error('Please select check-in and check-out dates.');
            return;
        }

        const nights = calculateNights(checkIn, checkOut);
        let holidayNights = 0;
        let christmas = false;
        let easter = false;
        let current = new Date(checkIn);
        const end = new Date(checkOut);

        while (current < end) {
            if (isHoliday(current)) {
                holidayNights++;
                const month = current.getMonth();
                const day = current.getDate();
                if (month === 11 && day >= 24 && day <= 26) christmas = true;
                else easter = true;
            }
            current.setDate(current.getDate() + 1);
        }

        if (holidayNights > 0 && holidayNights < 2) {
            const holidays = [];
            if (christmas) holidays.push('Christmas');
            if (easter) holidays.push('Easter');
            toast.error(
                `Please select at least two consecutive nights for ${holidays.join(' and ')} bookings.`,
            );
            return;
        }

        const holidayMessage =
            holidayNights > 0
                ? `Includes higher rate due to ${[christmas && 'Christmas', easter && 'Easter'].filter(Boolean).join(' and ')} Supplement`
                : '';

        const currency = residency === 'East African Resident' ? 'KES' : 'USD';

        if ((selectedRoom || selectedLeisureRoom) && selectedOccupancy) {
            const room = (selectedRoom || selectedLeisureRoom)!;
            const basePerRoom = getRoomRate(
                room,
                boardType,
                residency,
                selectedOccupancy,
            );
            const numAdultsInRoom = selectedOccupancy === 'Single' ? 1 : 2;
            const adultSupp = getSupplement(residency, true);
            const childSupp = getSupplement(residency, false);
            const bedCost = residency === 'East African Resident' ? 2000 : 20;

            let totalCost = 0;
            let allKidsAges: number[] = [];
            let perRoomCosts: number[] = [];

            for (let roomIndex = 0; roomIndex < numRooms; roomIndex++) {
                const kidsAges = bookingData.kidsAgesPerRoom?.[roomIndex] || [];
                allKidsAges = [...allKidsAges, ...kidsAges];
                const qualifyingKids = kidsAges.filter(
                    (age) => age > 3 && age < 12,
                );
                const maxKidsForBaseRate =
                    selectedOccupancy === 'Single' ? 1 : 2;
                let baseCost = 0;
                let kidsMealCostPerNight = 0;
                let suppTotal = 0;

                if (!bookingData.isKidsRoom) {
                    baseCost += basePerRoom;
                    suppTotal += numAdultsInRoom * adultSupp * holidayNights;
                    if (bookingData.hasKidsSharing) {
                        const singleRate = getRoomRate(
                            room,
                            boardType,
                            residency,
                            'Single',
                        );
                        const doubleRate = getRoomRate(
                            room,
                            boardType,
                            residency,
                            'Double',
                        );
                        const ratesAreEqual = singleRate === doubleRate;
                        let kidsToCharge = qualifyingKids;
                        if (
                            ratesAreEqual &&
                            selectedOccupancy === 'Single' &&
                            qualifyingKids.length > 0
                        ) {
                            kidsToCharge = qualifyingKids.slice(1);
                        }
                        kidsMealCostPerNight +=
                            kidsToCharge.length *
                            getKidsMealCost(boardType, residency);
                        if (kidsToCharge.length > 3)
                            kidsMealCostPerNight +=
                                (kidsToCharge.length - 3) * bedCost;
                    }
                } else {
                    const kidsInBaseRate = Math.min(
                        qualifyingKids.length,
                        maxKidsForBaseRate,
                    );
                    if (kidsInBaseRate > 0) baseCost += basePerRoom * 0.8;
                    const extraKids = Math.max(
                        0,
                        qualifyingKids.length - maxKidsForBaseRate,
                    );
                    for (let i = 0; i < extraKids; i++) {
                        const kidAge = qualifyingKids[maxKidsForBaseRate + i];
                        if (kidAge > 3 && kidAge < 12)
                            kidsMealCostPerNight += getKidsMealCost(
                                boardType,
                                residency,
                            );
                    }
                    if (qualifyingKids.length > 3)
                        kidsMealCostPerNight +=
                            (qualifyingKids.length - 3) * bedCost;
                }

                qualifyingKids.forEach(() => {
                    suppTotal += childSupp * holidayNights;
                });
                const roomCostPerNight = baseCost + kidsMealCostPerNight;
                const roomTotal = roomCostPerNight * nights + suppTotal;
                perRoomCosts.push(roomTotal);
                totalCost += roomTotal;
            }

            addToCart({
                kind: selectedRoom ? 'room' : 'leisure-room',
                room,
                occupancy: selectedOccupancy,
                isKidsRoom: bookingData.isKidsRoom || false,
                hasKidsSharing: bookingData.hasKidsSharing || false,
                numRooms,
                kidsCount: allKidsAges.length,
                kidsAges: allKidsAges,
                kidsAgesPerRoom: bookingData.kidsAgesPerRoom || [],
                perRoomCosts,
                totalCost,
                currency,
                checkIn,
                checkOut,
                nights,
                boardType,
                holidayMessage: holidayMessage || undefined,
                roomRatePerNight: basePerRoom,
            });
            triggerToast(`${room.name} added to cart!`);
        } else if (selectedConference) {
            const perGuest =
                residency === 'East African Resident'
                    ? selectedConference.rate_kshs
                    : selectedConference.rate_usd;
            const adultSupp = getSupplement(residency, true);
            const totalCost =
                bookingData.numGuests! * perGuest * nights +
                bookingData.numGuests! * adultSupp * holidayNights;
            addToCart({
                kind: 'conference',
                conference: selectedConference,
                numGuests: bookingData.numGuests!,
                totalCost,
                currency,
                checkIn,
                checkOut,
                nights,
                holidayMessage: holidayMessage || undefined,
            });
            triggerToast(`${selectedConference.name} added to cart!`);
        } else if (selectedLeisure) {
            const adultPrice =
                residency === 'East African Resident'
                    ? selectedLeisure.price_adults || 0
                    : (selectedLeisure.price_adults || 0) / 130;
            const kidPrice =
                residency === 'East African Resident'
                    ? selectedLeisure.price_kids || 0
                    : (selectedLeisure.price_kids || 0) / 130;
            const totalCost =
                bookingData.numAdults! * adultPrice +
                bookingData.numKids! * kidPrice;
            addToCart({
                kind: 'leisure',
                leisure: selectedLeisure,
                numAdults: bookingData.numAdults!,
                numKids: bookingData.numKids!,
                totalCost,
                currency,
                checkIn,
                checkOut,
                nights,
            });
            triggerToast(`${selectedLeisure.title} added to cart!`);
        }

        closeModal();
    };

    const TYPE_GROUPS = {
        experience: ['arts', 'essence', 'museum', 'herbarium', 'immersion'],
        recreation: [
            'leisure',
            'recreation',
            'activities',
            'archery',
            'mini golf',
        ],
    } as const;

    const getTabType = (title: string) => {
        const lower = title.toLowerCase();
        if (TYPE_GROUPS.experience.some((k) => lower.includes(k)))
            return 'experience';
        if (TYPE_GROUPS.recreation.some((k) => lower.includes(k)))
            return 'recreation';
        return null;
    };

    const findDesc = (
        group: keyof typeof TYPE_GROUPS,
    ): RatesDescription | undefined =>
        ratesDescriptions.find((d) =>
            TYPE_GROUPS[group].some(
                (t) =>
                    d.type.toLowerCase().includes(t) ||
                    d.description.toLowerCase().includes(t),
            ),
        );

    const experienceDescription = findDesc('experience');
    const leisureDescription = findDesc('recreation');

    const handlePkgContinue = () => {
        if (!checkIn || !checkOut) {
            toast.error('Please select both check-in and check-out dates.');
            return;
        }
        setPackageStep('rates');
    };

    const selectedPackageType = selectedPackage
        ? getTabType(selectedPackage.title ?? '')
        : null;

    const upsellGuestCount = numAdults + numKids4to11;
    const IMMERSION_PRICE = 1500;
    const upsellTotalCost = upsellGuestCount * IMMERSION_PRICE;

    const findDayVisitItem = (
        keywords: string[],
    ): DayVisitPackageItem | undefined =>
        dayVisitPackageItems?.find((item) =>
            keywords.some((kw) => item.title?.toLowerCase().includes(kw)),
        );

    const stripHtml = (html: string): string =>
        html?.replace(/<[^>]*>/g, '').trim() ?? '';

    const getUpsellOffer = () => {
        if (!selectedPackageType) return null;

        if (selectedPackageType === 'recreation') {
            const item = findDayVisitItem([
                'immersion',
                'experience',
                'arts',
                'museum',
                'herbarium',
            ]);
            const price = item?.price ?? 1500;
            return {
                name: item?.title ?? 'Immersion Experience',
                description: item?.description
                    ? stripHtml(item.description)
                    : 'Deepen your stay with a curated cultural immersion — guided walks through our herbarium, arts encounters, and sensory museum trails.',
                price,
                totalCost: upsellGuestCount * price,
                icon: '🌿',
            };
        }

        if (selectedPackageType === 'experience') {
            const item = findDayVisitItem([
                'leisure',
                'recreation',
                'activities',
                'archery',
                'golf',
            ]);
            const price = item?.price ?? 1500;
            return {
                name: item?.title ?? 'Leisure & Recreation Ticket',
                description: item?.description
                    ? stripHtml(item.description)
                    : 'Complement your cultural journey with access to leisure activities — archery, mini golf, nature walks, and poolside relaxation.',
                price,
                totalCost: upsellGuestCount * price,
                icon: '🏹',
            };
        }

        return null;
    };

    const handleViewCart = () => {
        const offer = getUpsellOffer();
        if (offer && cart.length > 0) {
            setShowUpsellModal(true);
        } else {
            setShowCart(true);
        }
    };

    const handleUpsellAccept = () => {
        const offer = getUpsellOffer();
        if (!offer) return;

        const currency = residency === 'East African Resident' ? 'KES' : 'USD';
        const cartRef = cart[0];

        const upsellLeisure: LeisureExperience = {
            id: -1,
            title: offer.name,
            description: offer.description,
            image_url: null,
            price_adults: IMMERSION_PRICE,
            price_kids: IMMERSION_PRICE,
        };

        addToCart({
            kind: 'leisure',
            leisure: upsellLeisure,
            numAdults: numAdults,
            numKids: numKids4to11,
            totalCost: offer.totalCost,
            currency,
            checkIn: cartRef?.checkIn || checkIn,
            checkOut: cartRef?.checkOut || checkOut,
            nights: cartRef
                ? calculateNights(cartRef.checkIn, cartRef.checkOut)
                : 0,
        });

        triggerToast(`${offer.name} added to cart!`);
        setShowUpsellModal(false);
        setShowCart(true);
    };

    const handleUpsellDecline = () => {
        setShowUpsellModal(false);
        setShowCart(true);
    };

    const pkgNights =
        checkIn && checkOut ? calculateNights(checkIn, checkOut) : 0;

    const formatDate = (d: string) =>
        d
            ? new Date(d).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
              })
            : null;

    const dvTotalGuests = dvNumAdults + dvNumKids;
    const dvTotal = selectedDayVisitPackageItem
        ? calcDayVisitTotal(selectedDayVisitPackageItem, dvNumAdults, dvNumKids)
        : 0;
    const dvPax = selectedDayVisitPackageItem?.pax ?? 1;
    const dvIsGroupTicket = dvPax > 1;
    const dvExtraGuests = dvIsGroupTicket
        ? Math.max(0, dvTotalGuests - dvPax)
        : 0;

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
        <div className="guest-counter">
            <motion.button
                className="counter-btn"
                onClick={onDecrement}
                disabled={value <= min}
                whileTap={{ scale: 0.85 }}
            >
                <Minus size={13} />
            </motion.button>
            <motion.span
                key={value}
                initial={{ scale: 1.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                className="counter-value"
            >
                {value}
            </motion.span>
            <motion.button
                className="counter-btn"
                onClick={onIncrement}
                whileTap={{ scale: 0.85 }}
            >
                <Plus size={13} />
            </motion.button>
        </div>
    );

    const upsellOffer = getUpsellOffer();

    return (
        <>
            <style>{styles}</style>
            <div className="container">
                {showDatePicker && (
                    <DatePickerModal
                        checkIn={checkIn}
                        checkOut={checkOut}
                        setCheckIn={setCheckIn}
                        setCheckOut={setCheckOut}
                        onClose={() => setShowDatePicker(false)}
                        triggerRef={datePickerTriggerRef}
                        inline
                    />
                )}

                {showBookingModal &&
                    (selectedRoom ||
                        selectedLeisureRoom ||
                        selectedConference ||
                        selectedLeisure) && (
                        <SelectionModal
                            selectedRoom={selectedRoom}
                            selectedLeisureRoom={selectedLeisureRoom}
                            selectedConference={selectedConference}
                            selectedLeisure={selectedLeisure}
                            selectedOccupancy={selectedOccupancy}
                            numRooms={numRooms}
                            setNumRooms={setNumRooms}
                            checkIn={checkIn}
                            checkOut={checkOut}
                            setShowDatePicker={setShowDatePicker}
                            datePickerTriggerRef={datePickerTriggerRef}
                            residency={residency}
                            getRoomCountInCart={getRoomCountInCart}
                            onConfirm={handleConfirmBooking}
                            onClose={closeModal}
                        />
                    )}

                <AnimatePresence>
                    {showUpsellModal && upsellOffer && (
                        <motion.div
                            className="upsell-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={(e) => {
                                if (e.target === e.currentTarget)
                                    setShowUpsellModal(false);
                            }}
                        >
                            <motion.div
                                className="upsell-modal"
                                initial={{ opacity: 0, scale: 0.88, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.92, y: 20 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 340,
                                    damping: 28,
                                }}
                            >
                                <div className="upsell-header">
                                    <div className="upsell-sparkle" />
                                    <motion.div
                                        className="upsell-icon-wrap"
                                        initial={{ scale: 0, rotate: -20 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{
                                            type: 'spring',
                                            stiffness: 400,
                                            damping: 20,
                                            delay: 0.15,
                                        }}
                                    >
                                        <Sparkles size={28} color="#b8924b" />
                                    </motion.div>
                                    <motion.p
                                        className="upsell-title"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        Complement Your Stay
                                    </motion.p>
                                </div>

                                <motion.div
                                    className="upsell-body"
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <div className="upsell-offer-card">
                                        <div className="upsell-offer-name">
                                            {upsellOffer.icon}{' '}
                                            {upsellOffer.name}
                                        </div>
                                        <div className="upsell-offer-desc">
                                            {upsellOffer.description}
                                        </div>
                                        <div className="upsell-price-row">
                                            <span className="upsell-price">
                                                KES 1,500
                                            </span>
                                            <span className="upsell-price-per">
                                                / person
                                            </span>
                                        </div>
                                        {upsellGuestCount > 0 && (
                                            <div className="upsell-total">
                                                {upsellGuestCount} guest
                                                {upsellGuestCount !== 1
                                                    ? 's'
                                                    : ''}{' '}
                                                ×&nbsp;KES 1,500&nbsp;=&nbsp;
                                                <strong>
                                                    KES{' '}
                                                    {upsellTotalCost.toLocaleString()}
                                                </strong>
                                            </div>
                                        )}
                                    </div>

                                    <div className="upsell-actions">
                                        <motion.button
                                            className="upsell-accept"
                                            onClick={handleUpsellAccept}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.97 }}
                                        >
                                            <Sparkles size={16} />
                                            Add to cart &amp; View Cart
                                        </motion.button>
                                        <button
                                            className="upsell-decline"
                                            onClick={handleUpsellDecline}
                                        >
                                            No thanks, proceed to cart
                                        </button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {showDayVisitModal && selectedDayVisitPackageItem && (
                        <motion.div
                            className="dv-modal-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.22 }}
                            onClick={(e) => {
                                if (e.target === e.currentTarget)
                                    closeDayVisitModal();
                            }}
                        >
                            <motion.div
                                className="dv-modal"
                                initial={{ opacity: 0, y: 60, scale: 0.97 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 40, scale: 0.97 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 300,
                                    damping: 30,
                                }}
                            >
                                <div className="dv-modal-header">
                                    <div>
                                        <div
                                            className="h3"
                                            style={{ marginBottom: 2 }}
                                        >
                                            Book Day Visit
                                        </div>
                                        <div
                                            className="small"
                                            style={{ color: '#9a7d5a' }}
                                        >
                                            Select your date and number of
                                            guests
                                        </div>
                                    </div>
                                    <button
                                        className="pkg-modal-close"
                                        onClick={closeDayVisitModal}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>

                                <div className="dv-modal-body">
                                    <div className="dv-package-info">
                                        {selectedDayVisitPackageItem.image && (
                                            <div className="dv-package-img">
                                                <img
                                                    src={
                                                        selectedDayVisitPackageItem.image
                                                    }
                                                    alt={
                                                        selectedDayVisitPackageItem.title ??
                                                        ''
                                                    }
                                                    loading="lazy"
                                                />
                                            </div>
                                        )}
                                        <div className="dv-package-meta">
                                            <div className="dv-package-name">
                                                {
                                                    selectedDayVisitPackageItem.title
                                                }
                                            </div>
                                            <div className="dv-package-base-price">
                                                <span className="dv-package-price-val">
                                                    KES{' '}
                                                    {fmtPrice(
                                                        selectedDayVisitPackageItem.price ??
                                                            0,
                                                    )}
                                                </span>
                                                <span className="dv-package-price-per">
                                                    {paxLabel(
                                                        selectedDayVisitPackageItem.pax ??
                                                            1,
                                                    )}
                                                </span>
                                            </div>
                                            {selectedDayVisitPackageItem.price_per_extra_pax &&
                                                dvIsGroupTicket && (
                                                    <div
                                                        className="small"
                                                        style={{
                                                            marginTop: 4,
                                                            color: '#8a6830',
                                                        }}
                                                    >
                                                        + KES{' '}
                                                        {fmtPrice(
                                                            selectedDayVisitPackageItem.price_per_extra_pax,
                                                        )}{' '}
                                                        per extra person beyond{' '}
                                                        {dvPax}
                                                    </div>
                                                )}
                                        </div>
                                    </div>

                                    <div
                                        className="date-prompt"
                                        style={{ fontSize: '1.1rem' }}
                                    >
                                        When are you coming?
                                    </div>
                                    <div style={{ height: 12 }} />

                                    <motion.button
                                        className={`dv-single-date-field ${visitDate ? 'has-value' : ''}`}
                                        onClick={() =>
                                            setShowVisitDatePicker((v) => !v)
                                        }
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                    >
                                        <span className="date-field-label">
                                            <Calendar
                                                size={11}
                                                style={{
                                                    display: 'inline',
                                                    marginRight: 4,
                                                }}
                                            />
                                            Visit Date
                                        </span>
                                        {visitDate ? (
                                            <span className="date-field-value">
                                                {formatDate(visitDate)}
                                            </span>
                                        ) : (
                                            <span className="date-field-placeholder">
                                                Select a date
                                            </span>
                                        )}
                                    </motion.button>

                                    <AnimatePresence>
                                        {showVisitDatePicker && (
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
                                                style={{ overflow: 'hidden' }}
                                            >
                                                <DatePickerModal
                                                    checkIn=""
                                                    checkOut=""
                                                    setCheckIn={(v) => {
                                                        setVisitDate(v);
                                                        setShowVisitDatePicker(
                                                            false,
                                                        );
                                                    }}
                                                    setCheckOut={() => {}}
                                                    onClose={() =>
                                                        setShowVisitDatePicker(
                                                            false,
                                                        )
                                                    }
                                                    inline
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <motion.div
                                        className="guest-section"
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.08 }}
                                    >
                                        <div className="guest-section-title">
                                            <Users size={16} color="#8a6830" />
                                            Who's coming?
                                        </div>

                                        <div
                                            style={{
                                                display: 'flex',
                                                gap: '16px',
                                                flexWrap: 'wrap',
                                            }}
                                        >
                                            <div
                                                className="guest-row"
                                                style={{
                                                    flex: 1,
                                                    minWidth: '140px',
                                                    paddingRight: '10px',
                                                    borderRight:
                                                        '1px solid #e8d9c0',
                                                }}
                                            >
                                                <div className="guest-info">
                                                    <div className="guest-label">
                                                        <span
                                                            style={{
                                                                marginRight: 6,
                                                            }}
                                                        >
                                                            👤
                                                        </span>
                                                        Adults
                                                    </div>
                                                    <div className="guest-sublabel">
                                                        Age 12 and above
                                                    </div>
                                                </div>
                                                <GuestCounter
                                                    value={dvNumAdults}
                                                    onIncrement={() =>
                                                        setDvNumAdults(
                                                            (n) => n + 1,
                                                        )
                                                    }
                                                    onDecrement={() =>
                                                        setDvNumAdults((n) =>
                                                            Math.max(1, n - 1),
                                                        )
                                                    }
                                                    min={1}
                                                />
                                            </div>

                                            <div
                                                className="guest-row"
                                                style={{
                                                    flex: 1,
                                                    minWidth: '140px',
                                                }}
                                            >
                                                <div className="guest-info">
                                                    <div className="guest-label">
                                                        <span
                                                            style={{
                                                                marginRight: 6,
                                                            }}
                                                        >
                                                            🧒
                                                        </span>
                                                        Children
                                                    </div>
                                                    <div className="guest-sublabel">
                                                        Age 4 – 11 years
                                                    </div>
                                                </div>
                                                <GuestCounter
                                                    value={dvNumKids}
                                                    onIncrement={() =>
                                                        setDvNumKids(
                                                            (n) => n + 1,
                                                        )
                                                    }
                                                    onDecrement={() =>
                                                        setDvNumKids((n) =>
                                                            Math.max(0, n - 1),
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </motion.div>

                                    <AnimatePresence>
                                        {dvTotalGuests > 0 && (
                                            <motion.div
                                                className="dv-price-breakdown"
                                                initial={{ opacity: 0, y: 12 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 8 }}
                                                transition={{
                                                    type: 'spring',
                                                    stiffness: 320,
                                                    damping: 28,
                                                }}
                                            >
                                                <div className="dv-price-title">
                                                    <Tag
                                                        size={11}
                                                        style={{
                                                            display: 'inline',
                                                            marginRight: 6,
                                                        }}
                                                    />
                                                    Price Breakdown
                                                </div>

                                                {dvIsGroupTicket ? (
                                                    <>
                                                        <div className="dv-price-row">
                                                            <span>
                                                                Group ticket
                                                                (covers up to{' '}
                                                                {dvPax}{' '}
                                                                {dvPax === 1
                                                                    ? 'person'
                                                                    : 'people'}
                                                                )
                                                            </span>
                                                            <span className="dv-price-amount">
                                                                KES{' '}
                                                                {fmtPrice(
                                                                    selectedDayVisitPackageItem.price ??
                                                                        0,
                                                                )}
                                                            </span>
                                                        </div>
                                                        {dvExtraGuests > 0 &&
                                                            selectedDayVisitPackageItem.price_per_extra_pax && (
                                                                <div className="dv-price-row extra">
                                                                    <span>
                                                                        {
                                                                            dvExtraGuests
                                                                        }{' '}
                                                                        extra
                                                                        guest
                                                                        {dvExtraGuests !==
                                                                        1
                                                                            ? 's'
                                                                            : ''}{' '}
                                                                        × KES{' '}
                                                                        {fmtPrice(
                                                                            selectedDayVisitPackageItem.price_per_extra_pax,
                                                                        )}
                                                                    </span>
                                                                    <span className="dv-price-amount">
                                                                        KES{' '}
                                                                        {fmtPrice(
                                                                            dvExtraGuests *
                                                                                (selectedDayVisitPackageItem.price_per_extra_pax ??
                                                                                    0),
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        {dvExtraGuests > 0 &&
                                                            !selectedDayVisitPackageItem.price_per_extra_pax && (
                                                                <div className="dv-price-row extra">
                                                                    <span>
                                                                        {
                                                                            dvExtraGuests
                                                                        }{' '}
                                                                        extra
                                                                        guest
                                                                        {dvExtraGuests !==
                                                                        1
                                                                            ? 's'
                                                                            : ''}{' '}
                                                                        (no
                                                                        extra
                                                                        charge
                                                                        listed)
                                                                    </span>
                                                                    <span className="dv-price-amount">
                                                                        —
                                                                    </span>
                                                                </div>
                                                            )}
                                                    </>
                                                ) : (
                                                    <div className="dv-price-row">
                                                        <span>
                                                            {dvTotalGuests}{' '}
                                                            guest
                                                            {dvTotalGuests !== 1
                                                                ? 's'
                                                                : ''}{' '}
                                                            × KES{' '}
                                                            {fmtPrice(
                                                                selectedDayVisitPackageItem.price ??
                                                                    0,
                                                            )}
                                                        </span>
                                                        <span className="dv-price-amount">
                                                            KES{' '}
                                                            {fmtPrice(dvTotal)}
                                                        </span>
                                                    </div>
                                                )}

                                                <div className="dv-price-row total">
                                                    <span>Total</span>
                                                    <motion.span
                                                        key={dvTotal}
                                                        className="dv-price-amount"
                                                        initial={{
                                                            scale: 1.15,
                                                            color: '#b8924b',
                                                        }}
                                                        animate={{
                                                            scale: 1,
                                                            color: '#7a5520',
                                                        }}
                                                        transition={{
                                                            type: 'spring',
                                                            stiffness: 400,
                                                            damping: 22,
                                                        }}
                                                    >
                                                        KES {fmtPrice(dvTotal)}
                                                    </motion.span>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="dv-modal-footer">
                                    <div
                                        className="small"
                                        style={{ color: '#9a7d5a' }}
                                    >
                                        {dvTotalGuests} guest
                                        {dvTotalGuests !== 1 ? 's' : ''} ·{' '}
                                        {visitDate
                                            ? formatDate(visitDate)
                                            : 'No date selected'}
                                    </div>
                                    <motion.button
                                        className="btn btn-primary"
                                        onClick={handleAddDayVisitToCart}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        disabled={
                                            !visitDate || dvTotalGuests < 1
                                        }
                                        style={{
                                            opacity:
                                                !visitDate || dvTotalGuests < 1
                                                    ? 0.5
                                                    : 1,
                                        }}
                                    >
                                        <ShoppingCart size={15} />
                                        Add to Cart · KES {fmtPrice(dvTotal)}
                                    </motion.button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {showSelectedPackageModal && selectedPackage && (
                        <motion.div
                            className="pkg-modal-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.22 }}
                            onClick={(e) => {
                                if (e.target === e.currentTarget)
                                    setShowSelectedPackageModal(false);
                            }}
                        >
                            <motion.div
                                className="pkg-modal"
                                initial={{ opacity: 0, y: 60, scale: 0.97 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 40, scale: 0.97 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 300,
                                    damping: 30,
                                }}
                            >
                                <div className="pkg-modal-header">
                                    <div>
                                        <div
                                            className="h3"
                                            style={{ marginBottom: 2 }}
                                        >
                                            {selectedPackage.title}
                                        </div>
                                    </div>
                                    <button
                                        className="pkg-modal-close"
                                        onClick={() =>
                                            setShowSelectedPackageModal(false)
                                        }
                                    >
                                        <X size={16} />
                                    </button>
                                </div>

                                <div className="pkg-modal-body">
                                    <AnimatePresence mode="wait">
                                        {packageStep === 'dates' && (
                                            <motion.div
                                                key="dates-step"
                                                initial={{ opacity: 0, x: -24 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 24 }}
                                                transition={{
                                                    type: 'spring',
                                                    stiffness: 320,
                                                    damping: 28,
                                                }}
                                            >
                                                <div className="date-prompt">
                                                    When are you coming?
                                                </div>
                                                <div className="date-subtext">
                                                    Choose your dates and tell
                                                    us about your group.
                                                </div>

                                                <div
                                                    className="date-fields"
                                                    ref={pkgDateTriggerRef}
                                                >
                                                    <motion.button
                                                        className={`date-field-btn ${checkIn ? 'has-value' : ''}`}
                                                        onClick={() =>
                                                            setShowDatePicker(
                                                                true,
                                                            )
                                                        }
                                                        whileHover={{
                                                            scale: 1.01,
                                                        }}
                                                        whileTap={{
                                                            scale: 0.99,
                                                        }}
                                                    >
                                                        <span className="date-field-label">
                                                            Check-in
                                                        </span>
                                                        {checkIn ? (
                                                            <span className="date-field-value">
                                                                {formatDate(
                                                                    checkIn,
                                                                )}
                                                            </span>
                                                        ) : (
                                                            <span className="date-field-placeholder">
                                                                Select date
                                                            </span>
                                                        )}
                                                    </motion.button>
                                                    <motion.button
                                                        className={`date-field-btn ${checkOut ? 'has-value' : ''}`}
                                                        onClick={() =>
                                                            setShowDatePicker(
                                                                true,
                                                            )
                                                        }
                                                        whileHover={{
                                                            scale: 1.01,
                                                        }}
                                                        whileTap={{
                                                            scale: 0.99,
                                                        }}
                                                    >
                                                        <span className="date-field-label">
                                                            Check-out
                                                        </span>
                                                        {checkOut ? (
                                                            <span className="date-field-value">
                                                                {formatDate(
                                                                    checkOut,
                                                                )}
                                                            </span>
                                                        ) : (
                                                            <span className="date-field-placeholder">
                                                                Select date
                                                            </span>
                                                        )}
                                                    </motion.button>
                                                </div>

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
                                                                marginBottom: 24,
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
                                                                overflow:
                                                                    'hidden',
                                                            }}
                                                        >
                                                            <DatePickerModal
                                                                checkIn={
                                                                    checkIn
                                                                }
                                                                checkOut={
                                                                    checkOut
                                                                }
                                                                setCheckIn={
                                                                    setCheckIn
                                                                }
                                                                setCheckOut={
                                                                    setCheckOut
                                                                }
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

                                                <AnimatePresence>
                                                    {pkgNights > 0 && (
                                                        <motion.div
                                                            className="nights-badge"
                                                            initial={{
                                                                opacity: 0,
                                                                scale: 0.8,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                scale: 1,
                                                            }}
                                                            exit={{
                                                                opacity: 0,
                                                                scale: 0.8,
                                                            }}
                                                            transition={{
                                                                type: 'spring',
                                                                stiffness: 400,
                                                                damping: 22,
                                                            }}
                                                        >
                                                            🌙 {pkgNights} night
                                                            {pkgNights !== 1
                                                                ? 's'
                                                                : ''}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>

                                                <motion.div
                                                    className="guest-section"
                                                    initial={{
                                                        opacity: 0,
                                                        y: 12,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    transition={{ delay: 0.1 }}
                                                >
                                                    <div className="guest-section-title">
                                                        <Users
                                                            size={16}
                                                            color="#8a6830"
                                                        />
                                                        Who's coming?
                                                    </div>

                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            gap: '16px',
                                                            flexWrap: 'wrap',
                                                        }}
                                                    >
                                                        <div
                                                            className="guest-row"
                                                            style={{
                                                                flex: 1,
                                                                minWidth:
                                                                    '140px',
                                                                paddingRight:
                                                                    '10px',
                                                                borderRight:
                                                                    '1px solid #e8d9c0',
                                                            }}
                                                        >
                                                            <div className="guest-info">
                                                                <div className="guest-label">
                                                                    <span
                                                                        style={{
                                                                            marginRight: 6,
                                                                        }}
                                                                    >
                                                                        👤
                                                                    </span>
                                                                    Adults
                                                                </div>
                                                                <div className="guest-sublabel">
                                                                    Age 12 and
                                                                    above
                                                                </div>
                                                            </div>
                                                            <GuestCounter
                                                                value={
                                                                    numAdults
                                                                }
                                                                onIncrement={() =>
                                                                    setNumAdults(
                                                                        (n) =>
                                                                            n +
                                                                            1,
                                                                    )
                                                                }
                                                                onDecrement={() =>
                                                                    setNumAdults(
                                                                        (n) =>
                                                                            Math.max(
                                                                                1,
                                                                                n -
                                                                                    1,
                                                                            ),
                                                                    )
                                                                }
                                                                min={1}
                                                            />
                                                        </div>

                                                        <div
                                                            className="guest-row"
                                                            style={{
                                                                flex: 1,
                                                                minWidth:
                                                                    '140px',
                                                                paddingRight:
                                                                    '10px',
                                                                borderRight:
                                                                    '1px solid #e8d9c0',
                                                            }}
                                                        >
                                                            <div className="guest-info">
                                                                <div className="guest-label">
                                                                    <span
                                                                        style={{
                                                                            marginRight: 6,
                                                                        }}
                                                                    >
                                                                        🧒
                                                                    </span>
                                                                    Children
                                                                </div>
                                                                <div className="guest-sublabel">
                                                                    Age 4 – 11
                                                                    years
                                                                </div>
                                                            </div>
                                                            <GuestCounter
                                                                value={
                                                                    numKids4to11
                                                                }
                                                                onIncrement={() =>
                                                                    setNumKids4to11(
                                                                        (n) =>
                                                                            n +
                                                                            1,
                                                                    )
                                                                }
                                                                onDecrement={() =>
                                                                    setNumKids4to11(
                                                                        (n) =>
                                                                            Math.max(
                                                                                0,
                                                                                n -
                                                                                    1,
                                                                            ),
                                                                    )
                                                                }
                                                            />
                                                        </div>

                                                        <div
                                                            className="guest-row"
                                                            style={{
                                                                flex: 1,
                                                                minWidth:
                                                                    '140px',
                                                            }}
                                                        >
                                                            <div className="guest-info">
                                                                <div className="guest-label">
                                                                    <span
                                                                        style={{
                                                                            marginRight: 6,
                                                                        }}
                                                                    >
                                                                        👶
                                                                    </span>
                                                                    Infants
                                                                </div>
                                                                <div className="guest-sublabel">
                                                                    Age 0 – 3
                                                                    years ·
                                                                    complimentary
                                                                </div>
                                                            </div>
                                                            <GuestCounter
                                                                value={
                                                                    numKids0to3
                                                                }
                                                                onIncrement={() =>
                                                                    setNumKids0to3(
                                                                        (n) =>
                                                                            n +
                                                                            1,
                                                                    )
                                                                }
                                                                onDecrement={() =>
                                                                    setNumKids0to3(
                                                                        (n) =>
                                                                            Math.max(
                                                                                0,
                                                                                n -
                                                                                    1,
                                                                            ),
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            </motion.div>
                                        )}

                                        {packageStep === 'rates' && (
                                            <motion.div
                                                key="rates-step"
                                                initial={{ opacity: 0, x: 24 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -24 }}
                                                transition={{
                                                    type: 'spring',
                                                    stiffness: 320,
                                                    damping: 28,
                                                }}
                                            >
                                                <motion.div
                                                    className="row"
                                                    style={{ marginBottom: 24 }}
                                                    initial={{
                                                        opacity: 0,
                                                        y: -8,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                >
                                                    <div
                                                        className="nights-badge"
                                                        style={{
                                                            marginBottom: 0,
                                                        }}
                                                    >
                                                        📅 {formatDate(checkIn)}{' '}
                                                        → {formatDate(checkOut)}{' '}
                                                        · {pkgNights}{' '}
                                                        {pkgNights > 1
                                                            ? 'nights'
                                                            : 'night'}
                                                    </div>
                                                    <div
                                                        className="nights-badge"
                                                        style={{
                                                            marginBottom: 0,
                                                        }}
                                                    >
                                                        👥 {numAdults} adult
                                                        {numAdults !== 1
                                                            ? 's'
                                                            : ''}
                                                        {numKids4to11 > 0
                                                            ? ` · ${numKids4to11} child${numKids4to11 !== 1 ? 'ren' : ''}`
                                                            : ''}
                                                        {numKids0to3 > 0
                                                            ? ` · ${numKids0to3} infant${numKids0to3 !== 1 ? 's' : ''}`
                                                            : ''}
                                                    </div>
                                                    <button
                                                        className="btn btn-secondary"
                                                        style={{
                                                            padding: '6px 14px',
                                                            fontSize: '0.8rem',
                                                        }}
                                                        onClick={() =>
                                                            setPackageStep(
                                                                'dates',
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>
                                                </motion.div>

                                                {selectedPackageType ===
                                                    'experience' && (
                                                    <ExperiencesTab
                                                        description={
                                                            selectedPackage.description ||
                                                            ''
                                                        }
                                                        rooms={rooms}
                                                        meals={meals}
                                                        conferences={
                                                            conferences
                                                        }
                                                        hoveredItem={
                                                            hoveredItem
                                                        }
                                                        setHoveredItem={
                                                            setHoveredItem
                                                        }
                                                        residency={residency}
                                                        boardType={boardType}
                                                        setBoardType={
                                                            setBoardType
                                                        }
                                                        isLoading={isLoading}
                                                        getRoomCountInCart={
                                                            getRoomCountInCart
                                                        }
                                                        handleAddRoomToCart={
                                                            handleAddRoomToCart
                                                        }
                                                        handleAddConferenceToCart={
                                                            handleAddConferenceToCart
                                                        }
                                                    />
                                                )}
                                                {selectedPackageType ===
                                                    'recreation' && (
                                                    <RecreationTab
                                                        description={
                                                            selectedPackage.description ||
                                                            ''
                                                        }
                                                        leisureRooms={
                                                            leisureRooms
                                                        }
                                                        leisureExperiences={
                                                            leisureExperiences
                                                        }
                                                        meals={meals}
                                                        hoveredItem={
                                                            hoveredItem
                                                        }
                                                        setHoveredItem={
                                                            setHoveredItem
                                                        }
                                                        residency={residency}
                                                        boardType={boardType}
                                                        setBoardType={
                                                            setBoardType
                                                        }
                                                        isLoading={isLoading}
                                                        getRoomCountInCart={
                                                            getRoomCountInCart
                                                        }
                                                        handleAddLeisureRoomToCart={
                                                            handleAddLeisureRoomToCart
                                                        }
                                                        handleAddLeisureToCart={
                                                            handleAddLeisureToCart
                                                        }
                                                    />
                                                )}
                                                {!selectedPackageType && (
                                                    <div
                                                        className="p"
                                                        style={{
                                                            color: '#9a7d5a',
                                                            textAlign: 'center',
                                                            padding: '40px 0',
                                                        }}
                                                    >
                                                        No rates available for
                                                        this package type.
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="pkg-modal-footer">
                                    {packageStep === 'dates' ? (
                                        <>
                                            <div
                                                className="small"
                                                style={{ color: '#9a7d5a' }}
                                            >
                                                {numAdults +
                                                    numKids4to11 +
                                                    numKids0to3}{' '}
                                                guest
                                                {numAdults +
                                                    numKids4to11 +
                                                    numKids0to3 !==
                                                1
                                                    ? 's'
                                                    : ''}{' '}
                                                total
                                            </div>
                                            <motion.button
                                                className="btn btn-primary"
                                                onClick={handlePkgContinue}
                                                whileHover={{ scale: 1.03 }}
                                                whileTap={{ scale: 0.97 }}
                                                disabled={!checkIn || !checkOut}
                                                style={{
                                                    opacity:
                                                        !checkIn || !checkOut
                                                            ? 0.5
                                                            : 1,
                                                }}
                                            >
                                                Continue to Rooms →
                                            </motion.button>
                                        </>
                                    ) : (
                                        <>
                                            <motion.button
                                                className="btn btn-secondary"
                                                onClick={() =>
                                                    setPackageStep('dates')
                                                }
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.97 }}
                                            >
                                                ← Back
                                            </motion.button>
                                            {cart.length > 0 && (
                                                <motion.button
                                                    className="btn btn-primary"
                                                    onClick={handleViewCart}
                                                    whileHover={{ scale: 1.03 }}
                                                    whileTap={{ scale: 0.97 }}
                                                    style={{
                                                        position: 'relative',
                                                    }}
                                                >
                                                    <ShoppingCart size={16} />
                                                    View Cart
                                                    {cart.length > 0 && (
                                                        <motion.span
                                                            initial={{
                                                                scale: 0,
                                                            }}
                                                            animate={{
                                                                scale: 1,
                                                            }}
                                                            style={{
                                                                position:
                                                                    'absolute',
                                                                top: -6,
                                                                right: -6,
                                                                width: 18,
                                                                height: 18,
                                                                borderRadius:
                                                                    '50%',
                                                                background:
                                                                    '#902729',
                                                                color: '#fff',
                                                                fontSize:
                                                                    '0.65rem',
                                                                fontWeight: 700,
                                                                display: 'flex',
                                                                alignItems:
                                                                    'center',
                                                                justifyContent:
                                                                    'center',
                                                            }}
                                                        >
                                                            {cart.length}
                                                        </motion.span>
                                                    )}
                                                </motion.button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {showToast && (
                        <motion.div
                            className="toast"
                            initial={{ x: '110%', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '110%', opacity: 0 }}
                            transition={{
                                type: 'spring',
                                stiffness: 320,
                                damping: 28,
                            }}
                        >
                            <ShoppingCart size={16} />
                            {toastMessage}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}
