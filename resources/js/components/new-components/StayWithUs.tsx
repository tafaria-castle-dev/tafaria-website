import { DatePickerModal } from '@/components/DatePickerModal';
import { SelectionModal } from '@/components/SelectionModal';
import { useRatesBooking } from '@/hooks/RatesCartContext';
import { useSelectedPackage } from '@/hooks/SelectedPackageContext';
import { calculateNights, isHoliday } from '@/lib/dateUtils';
import { getKidsMealCost, getRoomRate, getSupplement } from '@/lib/rateUtils';
import { Amenity, DayVisitPackage, Dining, Package } from '@/types';
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
import DOMPurify from 'dompurify';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { PackagesCards } from './Landing';
import { getTabType } from './SelectedPackageModal';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Inter:wght@400;500;600;700&display=swap');

  .badge {
    display: inline-block; padding: 4px 12px; border-radius: 999px;
    font-size: 0.72rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;
  }
  .badge-gold    { background: rgba(184,146,75,0.18); color: #7a5520; border: 1px solid rgba(184,146,75,0.4); }
  .badge-neutral { background: rgba(90,62,43,0.1);   color: #5a3e2b; border: 1px solid rgba(90,62,43,0.2); }
  .badge-olive   { background: rgba(100,120,60,0.12); color: #4a6030; border: 1px solid rgba(100,120,60,0.3); }

  .row { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }


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

`;

export default function StayWithUs({
    packages,
    dining,
    amenities,
    dayVisitPackages,
}: {
    packages: Package[];
    dining: Dining[];
    amenities: Amenity[];
    dayVisitPackages: DayVisitPackage[];
}) {
    const {
        showBookingModal,
        setShowBookingModal,
        cart,
        addToCart,
        setShowCart,
        boardType,
        setBoardType,
    } = useRatesBooking();

    const [activeTab, setActiveTab] = useState<Package | null>(null);
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
    const { setSelectedPackage, setShowSelectedPackageModal } =
        useSelectedPackage();

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

    const introductionDescription = findDesc('introduction');

    const handlePackageSelect = (pkg: Package) => {
        setSelectedPackage(pkg);

        setShowSelectedPackageModal(true);
    };
    const rawHtml =
        introductionDescription?.description ||
        'Visit for the day, stay overnight, bring a school, host an event, or apply for an art residency — Tafaria makes learning and leisure feel magical through its two packages below.';

    const processedHtml = rawHtml
        .replace(/<h1([^>]*)>/gi, '<h1 class="h1"$1>')
        .replace(/<h2([^>]*)>/gi, '<h2 class="rich-h2"$1>');
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

                {/* <section className="section-sm">
                    <div className="container">
                        <h1 className="h1">Visit Tafaria</h1>
                        <p className="p-lg">
                            Choose the lane that matches your day - then add the
                            specific activities you want.
                        </p>
                    </div>
                </section> */}

                {introductionDescription?.description && (
                    <div>
                        <div
                            style={{
                                marginBottom: 25,
                                marginTop: 22,
                            }}
                        >
                            <div className="rich-text-content">
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(
                                            processedHtml,
                                        ),
                                    }}
                                    className="mx-auto flex max-w-6xl flex-col items-center justify-center text-center"
                                ></div>
                            </div>
                            <PackagesCards
                                packages={packages}
                                activeTab={activeTab}
                                onSelectPackage={handlePackageSelect}
                            />
                        </div>
                    </div>
                )}
                {packages.length > 0 &&
                    packages?.map((pkg) => (
                        <section className="section" style={{ paddingTop: 0 }}>
                            <div className="container">
                                <h2 className="h2">
                                    {getTabType(pkg) == 'experience'
                                        ? 'Tafaria Tours'
                                        : 'Tafaria Leisure Activities'}
                                </h2>
                                <p className="p">
                                    {pkg.subtitle ||
                                        'Enhance your event with unique add-on experiences.'}
                                </p>
                                <div className="grid-4">
                                    {pkg?.items?.map((item) => (
                                        <div
                                            key={item.id}
                                            className="card h-fit"
                                        >
                                            <div className="card-media">
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div className="card-pad">
                                                <div
                                                    className="h4"
                                                    style={{
                                                        marginTop: 0,
                                                        marginBottom: 4,
                                                    }}
                                                >
                                                    {item.title}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    ))}
            </div>
        </>
    );
}
