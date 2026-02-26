import { DatePickerModal } from '@/components/DatePickerModal';
import { ExperiencesTab } from '@/components/ExperiencesTab';
import { RecreationTab } from '@/components/RecreationTab';
import { SelectionModal } from '@/components/SelectionModal';
import { useRatesBooking } from '@/hooks/RatesCartContext';
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
    TabType,
} from '@/types/types';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

export default function RackRates() {
    const {
        showBookingModal,
        setShowBookingModal,
        cart,
        addToCart,
        boardType,
        setBoardType,
    } = useRatesBooking();

    const [activeTab, setActiveTab] = useState<TabType>('experiences');
    const [residency, setResidency] = useState<Residency>(
        'East African Resident',
    );
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
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const datePickerTriggerRef = useRef<HTMLDivElement | null>(null);
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 600;

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
        setShowDatePicker(false);
        setSelectedRoom(null);
        setSelectedLeisureRoom(null);
        setSelectedConference(null);
        setSelectedLeisure(null);
        setSelectedOccupancy(null);
        setNumRooms(1);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

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

    const getRoomCountInCart = (roomId: string) => {
        return cart.reduce(
            (total, item) =>
                (item.kind === 'room' && item.room.id === roomId) ||
                (item.kind === 'leisure-room' && item.room.id === roomId)
                    ? total + item.numRooms
                    : total,
            0,
        );
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
                `Sorry, kindly select at least two consecutive nights for ${holidays.join(' and ')} bookings.`,
            );
            return;
        }

        let holidayMessage = '';
        if (holidayNights > 0) {
            const holidays = [];
            if (christmas) holidays.push('Christmas');
            if (easter) holidays.push('Easter');
            holidayMessage = `Includes higher rate due to ${holidays.join(' and ')} Supplement`;
        }

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
                let baseCost = 0;
                let kidsMealCostPerNight = 0;
                let suppTotal = 0;

                const maxKidsForBaseRate =
                    selectedOccupancy === 'Single' ? 1 : 2;

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
                        if (kidsToCharge.length > 3) {
                            const extraKids = kidsToCharge.length - 3;
                            kidsMealCostPerNight += extraKids * bedCost;
                        }
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
                    if (extraKids > 0) {
                        for (let i = 0; i < extraKids; i++) {
                            const kidAge =
                                qualifyingKids[maxKidsForBaseRate + i];
                            if (kidAge > 3 && kidAge < 12) {
                                kidsMealCostPerNight += getKidsMealCost(
                                    boardType,
                                    residency,
                                );
                            }
                        }
                    }
                    if (qualifyingKids.length > 3) {
                        const extraKidsForBed = qualifyingKids.length - 3;
                        kidsMealCostPerNight += extraKidsForBed * bedCost;
                    }
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
                room: room,
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

            setToastMessage(`${room.name} added to cart!`);
        } else if (selectedConference) {
            const perGuest =
                residency === 'East African Resident'
                    ? selectedConference.rate_kshs
                    : selectedConference.rate_usd;
            const adultSupp = getSupplement(residency, true);
            const totalPerNight = bookingData.numGuests! * perGuest;
            const suppTotal =
                bookingData.numGuests! * adultSupp * holidayNights;
            const totalCost = totalPerNight * nights + suppTotal;

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

            setToastMessage(`${selectedConference.name} added to cart!`);
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

            setToastMessage(`${selectedLeisure.title} added to cart!`);
        }

        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
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

    const findDescriptionByGroup = (
        descriptions: RatesDescription[],
        typeGroup: keyof typeof TYPE_GROUPS,
    ): RatesDescription | undefined => {
        const validTypes = TYPE_GROUPS[typeGroup];
        return descriptions.find((desc) =>
            validTypes.some(
                (type) =>
                    desc.type.toLowerCase().includes(type.toLowerCase()) ||
                    desc.description.toLowerCase().includes(type.toLowerCase()),
            ),
        );
    };
    const experienceDescription = findDescriptionByGroup(
        ratesDescriptions,
        'experience',
    );
    const introductionDescription = findDescriptionByGroup(
        ratesDescriptions,
        'introduction',
    );
    const leisureDescription = findDescriptionByGroup(
        ratesDescriptions,
        'recreation',
    );

    return (
        <>
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
                <div className="animate-slide-in-right fixed top-20 right-4 z-50">
                    <div className="rounded-xl bg-[#902729] px-6 py-4 text-white shadow-2xl">
                        <div className="flex items-center gap-3">
                            <svg
                                className="h-6 w-6"
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
                            <span className="font-semibold">
                                {toastMessage}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            <div
                className="min-h-screen bg-cover bg-fixed bg-center"
                style={{
                    backgroundImage: isMobile
                        ? "url('/tafaria1.jpeg')"
                        : "url('/tafaria.jpg')",
                }}
            >
                <style>{`
                    @keyframes slide-in-right {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                    .animate-slide-in-right { animation: slide-in-right 0.3s ease-out; }
                `}</style>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'Hotel',
                            name: 'Tafaria Castle & Centre for the Arts',
                            description:
                                'Tafaria Castle is a Hotel, a Conference Centre and a Centre for the Arts located along Nyeri & Nyahururu road at the intersection of Laikipia, Nyeri and Nyandarua Counties in Kenya near the scenic Aberdare foothills of the Mt Kenya region.',
                            url: 'https://www.tafariacastle.com',
                            address: {
                                '@type': 'PostalAddress',
                                addressCountry: 'Kenya',
                            },
                        }),
                    }}
                />
                {introductionDescription?.description && (
                    <div className="mx-3 mt-8">
                        <div className="container mx-auto mb-1 flex flex-col items-start justify-center rounded-2xl border border-[#93723c]/60 bg-white/80 p-4 sm:p-6">
                            <p
                                className="text-lg md:text-2xl"
                                style={{ marginBottom: 16 }}
                                dangerouslySetInnerHTML={{
                                    __html:
                                        introductionDescription.description ||
                                        '',
                                }}
                            />
                            <div className="mt-2 flex w-full flex-wrap justify-center gap-4">
                                <button
                                    className={`flex-1 rounded-xl px-6 py-3 text-base font-semibold transition-all sm:text-lg ${activeTab === 'experiences' ? 'bg-[#902729] text-white' : 'bg-gray-200 text-gray-800 hover:bg-[#9c7833]/60'}`}
                                    onClick={() => setActiveTab('experiences')}
                                >
                                    {experienceDescription?.type}
                                </button>
                                <button
                                    className={`flex-1 rounded-xl px-6 py-3 text-base font-semibold transition-all sm:text-lg ${activeTab === 'recreation' ? 'bg-[#902729] text-white' : 'bg-gray-400 text-gray-800 hover:bg-[#9c7833]/60'}`}
                                    onClick={() => setActiveTab('recreation')}
                                >
                                    {leisureDescription?.type}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <div className="mx-3">
                    <div className="container mx-auto py-4 sm:py-6 lg:py-8">
                        {activeTab === 'experiences' && (
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
                                handleAddRoomToCart={handleAddRoomToCart}
                                handleAddConferenceToCart={
                                    handleAddConferenceToCart
                                }
                            />
                        )}

                        {activeTab === 'recreation' && (
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
                                handleAddLeisureToCart={handleAddLeisureToCart}
                            />
                        )}
                    </div>
                </div>
                <footer className="mt-16 border-t border-[#9c7833] bg-gradient-to-r from-[#902729] to-[#9c7833] px-4 py-8 sm:px-6 lg:px-8">
                    <div className="container mx-auto text-center">
                        <p className="text-base font-medium text-white sm:text-lg">
                            Kindly note that we operate a dynamic rate card, not
                            a fixed annual rate structure. Our rates are at all
                            times published on our website and updated in real
                            time.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
