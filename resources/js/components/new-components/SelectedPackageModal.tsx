import { DatePickerModal } from '@/components/DatePickerModal';
import { ExperiencesTab } from '@/components/ExperiencesTab';
import { SelectionModal } from '@/components/SelectionModal';
import { useRatesBooking } from '@/hooks/RatesCartContext';
import { useSelectedPackage } from '@/hooks/SelectedPackageContext';
import { calculateNights, isHoliday } from '@/lib/dateUtils';
import { getKidsMealCost, getRoomRate, getSupplement } from '@/lib/rateUtils';
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
import { ShoppingCart } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { RecreationTab } from '../RecreationTab';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Inter:wght@400;500;600;700&display=swap');

  .h1 { font-family: 'Cinzel', serif; font-size: clamp(2rem,4vw,3rem); font-weight: 700; line-height: 1.2; color: #1a0f06; margin-bottom: 14px; }
  .h2 { font-family: 'Cinzel', serif; font-size: clamp(1.3rem,3vw,1.9rem); font-weight: 600; color: #1a0f06; margin-bottom: 10px; }
  .h3 { font-family: 'Cinzel', serif; font-size: 1rem; font-weight: 600; color: #1a0f06; }
  .p-lg { font-size: 1.1rem; line-height: 1.7; color: #5a3e2b; margin-bottom: 20px; }
  .p   { font-size: 1rem;   line-height: 1.7; color: #5a3e2b; }
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

  .btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 12px 22px; border-radius: 999px;
    font-size: 0.88rem; font-weight: 600;
    cursor: pointer; text-decoration: none; border: none;
    transition: transform 0.1s ease, box-shadow 0.15s ease;
    white-space: nowrap; font-family: inherit;
  }
  .btn:hover { transform: translateY(-1px); }
  .btn-primary  { background: linear-gradient(135deg,#b8924b,#8a6830); color:#fff; box-shadow: 0 4px 14px rgba(184,146,75,0.35); }
  .btn-primary:hover { box-shadow: 0 6px 20px rgba(184,146,75,0.5); }
  .btn-secondary { background:#fff; color:#5a3e2b; border:1px solid rgba(90,62,43,0.25); box-shadow:0 2px 8px rgba(0,0,0,0.06); }
  .btn-secondary:hover { background:#fbf7f0; }

  .card {
     border:1px solid rgba(184,146,75,0.18);
    border-radius:20px; overflow:hidden;
    box-shadow:0 4px 20px rgba(0,0,0,0.06);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .card:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(0,0,0,0.1); }
  .card-media { height: 180px; overflow: hidden; }
  .card-media img { width:100%; height:100%; object-fit:cover; display:block; transition: transform 0.3s ease; }
  .card:hover .card-media img { transform: scale(1.04); }
  .card-pad { padding: 16px; }

  .grid-3 { display:grid; gap:20px; grid-template-columns: repeat(3,1fr); margin-top:20px; }
  .grid-2 { display:grid; gap:24px; grid-template-columns: repeat(2,1fr); margin-top:20px; }
  .grid-4 { display:grid; gap:20px; grid-template-columns: repeat(4,1fr); margin-top:20px; }

  @media (max-width: 900px) {
    .grid-3 { grid-template-columns: repeat(2,1fr); }
    .grid-2 { grid-template-columns: 1fr; }
    .grid-4 { grid-template-columns: repeat(2,1fr); }
  }
  @media (max-width: 560px) {
    .grid-3 { grid-template-columns: 1fr; }
    .grid-4 { grid-template-columns: 1fr; }
  }

  /* Tab switcher */
  .tabs { display:flex; gap:0; background:rgba(184,146,75,0.1); border:1px solid rgba(184,146,75,0.25); border-radius:16px; padding:4px; margin-bottom:32px; }
  .tab {
    flex:1; padding:12px 20px; border-radius:12px; border:none;
    font-size:0.9rem; font-weight:600; cursor:pointer; font-family:inherit;
    color:#5a3e2b; background:transparent;
    transition: background 0.2s ease, color 0.2s ease;
  }
  .tab.active {  color:#7a5520; box-shadow:0 2px 10px rgba(0,0,0,0.08); }

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

  /* ─── Package Modal ─── */
  .pkg-modal-overlay {
    position: fixed; inset: 0; z-index: 35;
    background: rgba(26,15,6,0.55);
    backdrop-filter: blur(4px);
    display: flex; align-items: flex-end;
    animation: fade-in 0.2s ease;
  }
  @media (min-width: 700px) {
    .pkg-modal-overlay { align-items: center; justify-content: center; }
  }
  @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }

  .pkg-modal {
    background: #fffdf9;
    border-radius: 28px 28px 0 0;
    width:96vw;
    max-height: 96vh;
    overflow-y: auto;
    box-shadow: 0 -8px 48px rgba(0,0,0,0.18);
    animation: slide-up 0.3s cubic-bezier(0.34,1.56,0.64,1);
    display: flex; flex-direction: column;
  }
  @media (min-width: 700px) {
    .pkg-modal {
      border-radius: 28px;
      width: min(860px, 94vw);
      max-height: 88vh;
      animation: scale-in 0.25s cubic-bezier(0.34,1.56,0.64,1);
    }
  }
  @keyframes slide-up {
    from { transform: translateY(60px); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
  }
  @keyframes scale-in {
    from { transform: scale(0.95); opacity: 0; }
    to   { transform: scale(1);    opacity: 1; }
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

  /* Step indicator */
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

  /* Date selection cards */
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
`;

export default function SelectedPackageModal() {
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
    const {
        selectedPackage,
        showSelectedPackageModal,
        setShowSelectedPackageModal,
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
                ]);
                setRooms(roomsRes.data.data || []);
                setLeisureRooms(leisureRoomsRes.data.data || []);
                setMeals(mealsRes.data.data || []);
                setConferences(confRes.data.data || []);
                setLeisureExperiences(leisureRes.data || []);
                setRatesDescriptions(descriptionsRes.data || []);
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
        setShowBookingModal,
    ]);

    useEffect(() => {
        document.body.style.overflow =
            showBookingModal || showDatePicker || showSelectedPackageModal
                ? 'hidden'
                : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [showBookingModal, showDatePicker, showSelectedPackageModal]);

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
        experience: ['arts', 'package', 'essence', 'museum', 'herbarium'],
        introduction: ['introduction', 'two'],
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
        setCheckIn(checkIn);
        setCheckOut(checkOut);
        setPackageStep('rates');
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

                {showSelectedPackageModal && selectedPackage && (
                    <div
                        className="pkg-modal-overlay"
                        onClick={(e) => {
                            if (e.target === e.currentTarget)
                                setShowSelectedPackageModal(false);
                        }}
                    >
                        <div
                            className="pkg-modal"
                            role="dialog"
                            aria-modal="true"
                        >
                            <div className="pkg-modal-header">
                                <div>
                                    <div
                                        style={{
                                            fontFamily: "'Cinzel', serif",
                                            fontSize: '1.1rem',
                                            fontWeight: 700,
                                            color: '#1a0f06',
                                            marginBottom: 4,
                                        }}
                                    >
                                        {selectedPackage.title}
                                    </div>
                                </div>
                                <button
                                    className="pkg-modal-close"
                                    onClick={() =>
                                        setShowSelectedPackageModal(false)
                                    }
                                    aria-label="Close"
                                >
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                    >
                                        <path d="M18 6 6 18M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div
                                className="pkg-modal-body"
                                ref={pkgDateTriggerRef as any}
                            >
                                {packageStep === 'dates' && (
                                    <div>
                                        <div className="date-prompt">
                                            When are you coming?
                                        </div>

                                        <div className="date-fields">
                                            <button
                                                className={`date-field-btn ${checkIn ? 'has-value' : ''}`}
                                                onClick={() =>
                                                    setShowDatePicker(true)
                                                }
                                            >
                                                <span className="date-field-label flex">
                                                    <svg
                                                        width="11"
                                                        height="11"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2.5"
                                                        style={{
                                                            marginRight: 4,
                                                        }}
                                                    >
                                                        <rect
                                                            x="3"
                                                            y="4"
                                                            width="18"
                                                            height="18"
                                                            rx="2"
                                                        />
                                                        <path d="M16 2v4M8 2v4M3 10h18" />
                                                    </svg>
                                                    Check-in
                                                </span>
                                                {checkIn ? (
                                                    <span className="date-field-value">
                                                        {formatDate(checkIn)}
                                                    </span>
                                                ) : (
                                                    <span className="date-field-placeholder">
                                                        Select date
                                                    </span>
                                                )}
                                            </button>

                                            <button
                                                className={`date-field-btn ${checkOut ? 'has-value' : ''}`}
                                                onClick={() =>
                                                    setShowDatePicker(true)
                                                }
                                            >
                                                <span className="date-field-label flex">
                                                    <svg
                                                        width="11"
                                                        height="11"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2.5"
                                                        style={{
                                                            marginRight: 4,
                                                        }}
                                                    >
                                                        <rect
                                                            x="3"
                                                            y="4"
                                                            width="18"
                                                            height="18"
                                                            rx="2"
                                                        />
                                                        <path d="M16 2v4M8 2v4M3 10h18" />
                                                    </svg>
                                                    Check-out
                                                </span>
                                                {checkOut ? (
                                                    <span className="date-field-value">
                                                        {formatDate(checkOut)}
                                                    </span>
                                                ) : (
                                                    <span className="date-field-placeholder">
                                                        Select date
                                                    </span>
                                                )}
                                            </button>
                                        </div>

                                        {showDatePicker && (
                                            <div
                                                style={{
                                                    border: '1px solid rgba(184,146,75,0.25)',
                                                    borderRadius: 20,
                                                    overflow: 'hidden',
                                                    marginBottom: 24,
                                                }}
                                            >
                                                <DatePickerModal
                                                    checkIn={checkIn}
                                                    checkOut={checkOut}
                                                    setCheckIn={setCheckIn}
                                                    setCheckOut={setCheckOut}
                                                    onClose={() =>
                                                        setShowDatePicker(false)
                                                    }
                                                    inline
                                                    triggerRef={
                                                        pkgDateTriggerRef
                                                    }
                                                />
                                            </div>
                                        )}

                                        {pkgNights > 0 && (
                                            <div className="nights-badge">
                                                <svg
                                                    width="14"
                                                    height="14"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                >
                                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                                </svg>
                                                {pkgNights} night
                                                {pkgNights !== 1 ? 's' : ''}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {packageStep === 'rates' && (
                                    <div>
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 10,
                                                padding: '10px 16px',
                                                background:
                                                    'rgba(184,146,75,0.08)',
                                                border: '1px solid rgba(184,146,75,0.25)',
                                                borderRadius: 12,
                                                marginBottom: 14,
                                                flexWrap: 'wrap',
                                            }}
                                        >
                                            <svg
                                                width="14"
                                                height="14"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="#8a6830"
                                                strokeWidth="2"
                                            >
                                                <rect
                                                    x="3"
                                                    y="4"
                                                    width="18"
                                                    height="18"
                                                    rx="2"
                                                />
                                                <path d="M16 2v4M8 2v4M3 10h18" />
                                            </svg>
                                            <span
                                                style={{
                                                    fontSize: '0.88rem',
                                                    fontWeight: 600,
                                                    color: '#5a3e2b',
                                                }}
                                            >
                                                {formatDate(checkIn)} →{' '}
                                                {formatDate(checkOut)}
                                            </span>
                                            <span
                                                className="badge badge-gold"
                                                style={{ marginLeft: 'auto' }}
                                            >
                                                {pkgNights} night
                                                {pkgNights !== 1 ? 's' : ''}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    setPackageStep('dates')
                                                }
                                                style={{
                                                    fontSize: '0.78rem',
                                                    fontWeight: 600,
                                                    color: '#8a6830',
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    textDecoration: 'underline',
                                                    padding: 0,
                                                }}
                                            >
                                                Change
                                            </button>
                                        </div>

                                        <div className="rates-label">
                                            Rates &amp; Booking
                                        </div>

                                        {getTabType(
                                            selectedPackage.title ?? '',
                                        ) === 'experience' ? (
                                            <ExperiencesTab
                                                description={
                                                    experienceDescription
                                                }
                                                rooms={rooms}
                                                meals={meals}
                                                conferences={conferences}
                                                hoveredItem={hoveredItem}
                                                setHoveredItem={setHoveredItem}
                                                residency={residency}
                                                boardType={boardType}
                                                setBoardType={setBoardType}
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
                                        ) : (
                                            <RecreationTab
                                                description={leisureDescription}
                                                leisureRooms={leisureRooms}
                                                leisureExperiences={
                                                    leisureExperiences
                                                }
                                                hoveredItem={hoveredItem}
                                                setHoveredItem={setHoveredItem}
                                                residency={residency}
                                                boardType={boardType}
                                                setBoardType={setBoardType}
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
                                    </div>
                                )}
                            </div>

                            <div className="pkg-modal-footer">
                                {packageStep === 'dates' ? (
                                    <>
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() =>
                                                setShowSelectedPackageModal(
                                                    false,
                                                )
                                            }
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="btn btn-primary"
                                            onClick={handlePkgContinue}
                                            disabled={!checkIn || !checkOut}
                                            style={{
                                                opacity:
                                                    !checkIn || !checkOut
                                                        ? 0.5
                                                        : 1,
                                                cursor:
                                                    !checkIn || !checkOut
                                                        ? 'not-allowed'
                                                        : 'pointer',
                                            }}
                                        >
                                            View Rates
                                            <svg
                                                width="14"
                                                height="14"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2.5"
                                            >
                                                <path d="M5 12h14M12 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() =>
                                                setPackageStep('dates')
                                            }
                                        >
                                            <svg
                                                width="14"
                                                height="14"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2.5"
                                            >
                                                <path d="M19 12H5M12 19l-7-7 7-7" />
                                            </svg>
                                            Back
                                        </button>
                                        {cart.length > 0 && (
                                            <button
                                                onClick={() =>
                                                    setShowCart(true)
                                                }
                                                className={`btn btn-primary relative flex items-center rounded-md px-5 py-2 text-sm font-semibold text-[#93723c] sm:px-6 sm:py-2 sm:text-base`}
                                            >
                                                <div className="relative flex">
                                                    View Cart
                                                    <ShoppingCart className="mx-2 h-5 w-5" />
                                                    <span className="absolute -top-2 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#902729] text-xs font-bold text-white">
                                                        {cart.length}
                                                    </span>
                                                </div>
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {showToast && (
                    <div className="toast">
                        <svg
                            width="20"
                            height="20"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                        {toastMessage}
                    </div>
                )}
            </div>
        </>
    );
}
