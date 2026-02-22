import { DatePickerModal } from '@/components/DatePickerModal';
import { ExperiencesTab } from '@/components/ExperiencesTab';
import { RecreationTab } from '@/components/RecreationTab';
import { SelectionModal } from '@/components/SelectionModal';
import { useRatesBooking } from '@/hooks/RatesCartContext';
import { calculateNights, isHoliday } from '@/lib/dateUtils';
import { getKidsMealCost, getRoomRate, getSupplement } from '@/lib/rateUtils';
import { Amenity, Dining, Package } from '@/types';
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
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { PackagesCards, toTabKey } from './Landing';

interface ExperienceCard {
    image: string;
    alt: string;
    title: string;
    meta: string;
}

interface RecreationCard {
    image: string;
    alt: string;
    title: string;
    meta: string;
}

const EXPERIENCE_CARDS: ExperienceCard[] = [
    {
        image: '/assets/museum.jpeg',
        alt: 'Tafaria Museum interior',
        title: 'Museum Tour',
        meta: '60–90 min • Great for rainy days',
    },
    {
        image: '/assets/herbarium.jpeg',
        alt: 'Tafaria Herbarium interior',
        title: 'Herbarium Tour',
        meta: '45–60 min • Nature lessons',
    },
    {
        image: '/assets/nano farm.jpeg',
        alt: 'Tafaria Nano Farm',
        title: 'Nano Farm Learning Tour',
        meta: '60 min • Families & students',
    },
    {
        image: '/assets/art-studios.png',
        alt: 'Tafaria Art Studios',
        title: 'Art Studios & Installations',
        meta: '45–75 min • Inspiring',
    },
    {
        image: '/assets/castle-front.jpg',
        alt: 'Tafaria Story Walk',
        title: 'Once Upon a Dream Tour',
        meta: '30–45 min • Tafaria story',
    },
    {
        image: '/assets/goDreamLifeskills.jpeg',
        alt: 'Guided Learning Itinerary',
        title: 'Guided Learning Itinerary',
        meta: '2–3 hrs • Curated mix',
    },
];

const RECREATION_CARDS: RecreationCard[] = [
    {
        image: '/assets/horse-riding.png',
        alt: 'Horse Riding at Tafaria',
        title: 'Horse Riding',
        meta: 'Booking recommended',
    },
    {
        image: '/assets/archery.jpeg',
        alt: 'Archery at Tafaria',
        title: 'Archery',
        meta: '30–45 min • Fun & focus',
    },
    {
        image: '/assets/Mini Golf.png',
        alt: 'Mini Golf at Tafaria',
        title: 'Mini Golf',
        meta: '30–45 min • Family-friendly',
    },
    {
        image: '/assets/swimming_pool.jpg',
        alt: 'Pool & Moat at Tafaria',
        title: 'Pool & Moat',
        meta: 'Flexible • Relax',
    },
    {
        image: '/assets/arts.jpg',
        alt: 'Nature Walks at Tafaria',
        title: 'Nature Walks',
        meta: 'Self-guided • Slow down',
    },
    {
        image: '/assets/lords-room.png',
        alt: 'Family Play Zone at Tafaria',
        title: 'Family Play Zone',
        meta: 'Kids & parents',
    },
];

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
    position: fixed; top: 80px; right: 16px; z-index: 9999;
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
`;

export default function StayWithUs({
    packages,
    dining,
    amenities,
}: {
    packages: Package[];
    dining: Dining[];
    amenities: Amenity[];
}) {
    useEffect(() => {
        const savedTab = localStorage.getItem('tafaria-selected-tab');
        if (savedTab) {
            setActiveTab(savedTab);
            localStorage.removeItem('tafaria-selected-tab');
        }
    }, []);
    const {
        showBookingModal,
        setShowBookingModal,
        cart,
        addToCart,
        boardType,
        setBoardType,
    } = useRatesBooking();

    const [activeTab, setActiveTab] = useState<string>('');
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
                if (showDatePicker) setShowDatePicker(false);
                if (showBookingModal) setShowBookingModal(false);
            }
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [showDatePicker, showBookingModal, setShowBookingModal]);

    useEffect(() => {
        document.body.style.overflow =
            showBookingModal || showDatePicker ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [showBookingModal, showDatePicker]);

    const closeModal = () => {
        setShowBookingModal(false);
        setSelectedRoom(null);
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
    const introductionDescription = findDesc('introduction');
    const leisureDescription = findDesc('recreation');

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

                <section className="section-sm">
                    <div className="container">
                        <h1 className="h1">Visit Tafaria</h1>
                        <p className="p-lg">
                            Choose the lane that matches your day - then add the
                            specific activities you want.
                        </p>
                    </div>
                </section>

                {introductionDescription?.description && (
                    <div>
                        <div
                            style={{
                                border: '1px solid rgba(184,146,75,0.22)',
                                borderRadius: 20,
                                padding: '20px 24px',
                                marginBottom: 8,
                            }}
                        >
                            <p
                                className="text-lg md:text-2xl"
                                style={{ marginBottom: 16 }}
                            >
                                {introductionDescription.description}
                            </p>

                            <PackagesCards
                                packages={packages}
                                activeTab={activeTab}
                                onTabSelect={(key) => setActiveTab(key)}
                            />
                        </div>
                    </div>
                )}

                {packages.map((pkg) => {
                    const key = toTabKey(pkg.title);
                    if (activeTab !== key) return null;
                    return (
                        <section id={key} className="section">
                            <div className="container">
                                <div className="package-section">
                                    <div className="section-header">
                                        <div>
                                            <h2 className="h2">{pkg.title}</h2>
                                            <span className="badge badge-gold">
                                                {pkg.subtitle}
                                            </span>
                                        </div>
                                    </div>
                                    {pkg.description && (
                                        <div className="mb-8">
                                            <p
                                                className="mb-4 text-base text-gray-800 sm:text-lg"
                                                dangerouslySetInnerHTML={{
                                                    __html: pkg.description,
                                                }}
                                            ></p>
                                        </div>
                                    )}
                                    <div className="grid-3">
                                        {pkg.items?.map((card) => (
                                            <div
                                                key={card.title}
                                                className="card"
                                            >
                                                <div className="card-media">
                                                    <img
                                                        src={card.image}
                                                        alt={card.title}
                                                        loading="lazy"
                                                    />
                                                </div>
                                                <div className="card-pad">
                                                    <div
                                                        className="h3"
                                                        style={{
                                                            marginBottom: 4,
                                                        }}
                                                    >
                                                        {card.title}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div style={{ marginTop: 24 }}>
                                        <a
                                            className="btn btn-primary"
                                            href="book.html?package=immersion"
                                        >
                                            Book this Package
                                        </a>
                                    </div>
                                </div>

                                <div className="rates-wrapper">
                                    <div className="rates-label">
                                        Rates &amp; Booking
                                    </div>
                                    <ExperiencesTab
                                        description={experienceDescription}
                                        rooms={rooms}
                                        meals={meals}
                                        conferences={conferences}
                                        hoveredItem={hoveredItem}
                                        setHoveredItem={setHoveredItem}
                                        residency={residency}
                                        boardType={boardType}
                                        setBoardType={setBoardType}
                                        isLoading={isLoading}
                                        getRoomCountInCart={getRoomCountInCart}
                                        handleAddRoomToCart={
                                            handleAddRoomToCart
                                        }
                                        handleAddConferenceToCart={
                                            handleAddConferenceToCart
                                        }
                                    />
                                </div>
                            </div>
                        </section>
                    );
                })}

                {activeTab === 'recreation' && (
                    <section id="recreation" className="section">
                        <div className="container">
                            <div className="package-section">
                                <div className="section-header">
                                    <div>
                                        <h2 className="h2">
                                            The Tafaria Recreation Package
                                        </h2>
                                        <span className="badge badge-olive">
                                            Unwind &amp; have fun
                                        </span>
                                    </div>
                                    <a
                                        className="btn btn-primary"
                                        href="book.html?package=recreation"
                                    >
                                        Book this Package
                                    </a>
                                </div>
                                {leisureDescription && (
                                    <div className="mb-8">
                                        <p className="mb-4 text-base text-gray-800 sm:text-lg">
                                            {leisureDescription.description}
                                        </p>
                                        {leisureDescription.audio_url && (
                                            <audio
                                                controls
                                                src={
                                                    leisureDescription.audio_url
                                                }
                                                className="w-full"
                                            />
                                        )}
                                    </div>
                                )}
                                <div className="grid-3">
                                    {RECREATION_CARDS.map((card) => (
                                        <div key={card.title} className="card">
                                            <div className="card-media">
                                                <img
                                                    src={card.image}
                                                    alt={card.alt}
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div className="card-pad">
                                                <div
                                                    className="h3"
                                                    style={{ marginBottom: 4 }}
                                                >
                                                    {card.title}
                                                </div>
                                                <div className="small">
                                                    {card.meta}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ marginTop: 24 }}>
                                    <a
                                        className="btn btn-primary"
                                        href="book.html?package=recreation"
                                    >
                                        Book this Package
                                    </a>
                                </div>
                            </div>

                            <div className="rates-wrapper">
                                <div className="rates-label">
                                    Rates &amp; Booking
                                </div>
                                <RecreationTab
                                    description={leisureDescription}
                                    leisureRooms={leisureRooms}
                                    leisureExperiences={leisureExperiences}
                                    hoveredItem={hoveredItem}
                                    setHoveredItem={setHoveredItem}
                                    residency={residency}
                                    boardType={boardType}
                                    setBoardType={setBoardType}
                                    isLoading={isLoading}
                                    getRoomCountInCart={getRoomCountInCart}
                                    handleAddLeisureRoomToCart={
                                        handleAddLeisureRoomToCart
                                    }
                                    handleAddLeisureToCart={
                                        handleAddLeisureToCart
                                    }
                                />
                            </div>
                        </div>
                    </section>
                )}

                <section
                    id="dining"
                    className="section"
                    style={{ paddingTop: 0 }}
                >
                    <div className="container">
                        <h2 className="h2">Dining</h2>
                        <div className="grid-2">
                            <div className="card">
                                <div className="dining-image">
                                    <img
                                        src={dining[0]?.image}
                                        alt="Dining at Tafaria, table set with a view of the castle grounds"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                            <div className="dining-text">
                                <p
                                    className="p-lg"
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            dining[0]?.description ||
                                            'Experience a culinary journey at Tafaria Castle, where our dining offerings are as rich and diverse as our history. From hearty breakfasts to elegant dinners, our menus are crafted to delight every palate. Savor the flavors of locally sourced ingredients, expertly prepared to create memorable meals that complement your stay.',
                                    }}
                                ></p>
                                <div className="meta-row">
                                    <span className="badge badge-neutral">
                                        Breakfast
                                    </span>
                                    <span className="badge badge-neutral">
                                        Lunch
                                    </span>
                                    <span className="badge badge-neutral">
                                        Dinner
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    id="amenities"
                    className="section"
                    style={{ paddingTop: 0 }}
                >
                    <div className="container">
                        <h2 className="h2">Amenities</h2>
                        <div className="grid-4">
                            {amenities?.map(({ title, subtitle, image }) => (
                                <div key={title} className="card">
                                    <div className="amenity-card">
                                        <b
                                            style={{
                                                fontSize: '0.95rem',
                                                color: '#1a0f06',
                                            }}
                                        >
                                            {title}
                                        </b>
                                        <div
                                            className="small"
                                            style={{ marginTop: 4 }}
                                        >
                                            {subtitle}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <footer
                    style={{
                        borderTop: '1px solid rgba(156,120,51,0.3)',
                        background: 'linear-gradient(135deg, #902729, #9c7833)',
                        padding: '32px 24px',
                        textAlign: 'center',
                    }}
                >
                    <p
                        style={{
                            color: '#fff',
                            fontWeight: 500,
                            maxWidth: 760,
                            margin: '0 auto',
                            lineHeight: 1.7,
                        }}
                    >
                        Kindly note that we operate a dynamic rate card, not a
                        fixed annual rate structure. Our rates are published on
                        our website and updated in real time.
                    </p>
                </footer>
            </div>
        </>
    );
}
