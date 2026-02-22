'use client';

import { getRoomRate } from '@/lib/rateUtils';
import {
    BoardType,
    ChildPolicy,
    ConferencePackage,
    Meal,
    RatesDescription,
    Residency,
    Room,
} from '@/types/types';
import { AnimatePresence, motion } from 'framer-motion';
import { LoadingComponent } from './LoadingComponent';

interface ExperiencesTabProps {
    description: RatesDescription | undefined;
    rooms: Room[];
    meals: Meal[];
    conferences: ConferencePackage[];
    hoveredItem: string | null;
    setHoveredItem: (id: string | null) => void;
    residency: Residency;
    boardType: BoardType;
    setBoardType: (type: BoardType) => void;
    isLoading: boolean;
    getRoomCountInCart: (roomId: string) => number;
    handleAddRoomToCart: (room: Room, occupancy: 'Single' | 'Double') => void;
    handleAddConferenceToCart: (conference: ConferencePackage) => void;
}

const extractImageUrl = (html: string): string | null => {
    const match = html?.match(/src="([^"]*)"/i);
    return match ? match[1] : null;
};

const removeImg = (html: string): string =>
    html?.replace(/<img[^>]*>/gi, '').trim();

export const RoomCard: React.FC<{
    room: Room;
    boardType: BoardType;
    residency: Residency;
    handleAddRoomToCart: (room: Room, occupancy: 'Single' | 'Double') => void;
    getRoomCountInCart: (roomId: string) => number;
    hoveredItem: string | null;
    setHoveredItem: (id: string | null) => void;
}> = ({
    room,
    boardType,
    residency,
    handleAddRoomToCart,
    getRoomCountInCart,
    hoveredItem,
    setHoveredItem,
}) => {
    const id = room.id;
    const isHovered = hoveredItem === id;
    const nameParts = room.name.split(' - ');
    const roomName = nameParts[0];
    const roomType = nameParts[1] || 'Standard';
    const imageUrl = extractImageUrl(room.description);
    const descHtml = removeImg(room.description);
    const singleRate = getRoomRate(room, boardType, residency, 'Single');
    const doubleRate = getRoomRate(room, boardType, residency, 'Double');
    const currency = residency === 'East African Resident' ? 'KES' : 'USD';
    const roomCountInCart = getRoomCountInCart(room.id);
    const canAddToCart = roomCountInCart < room.number_of_rooms;

    return (
        <motion.div
            onMouseEnter={() => setHoveredItem(id)}
            onMouseLeave={() => setHoveredItem(null)}
            layout
            transition={{ layout: { duration: 0.35, ease: 'easeInOut' } }}
            className="cursor-pointer overflow-hidden rounded-lg bg-white shadow-md"
            whileHover={{ boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
        >
            {imageUrl && (
                <div className="overflow-hidden">
                    <motion.img
                        src={imageUrl}
                        alt={roomName}
                        className="h-48 w-full object-cover"
                        animate={{ scale: isHovered ? 1.05 : 1 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                    />
                </div>
            )}
            <div className="p-4">
                <span className="rounded bg-gray-200 px-2 py-1 text-xs font-medium text-gray-800">
                    {roomType}
                </span>
                <h3 className="mt-2 text-lg font-bold text-[#902729]">
                    {roomName}
                </h3>
                <AnimatePresence initial={false} mode="wait">
                    {isHovered ? (
                        <motion.div
                            key="full"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.35, ease: 'easeInOut' }}
                            className="mt-1 overflow-hidden text-sm text-gray-600"
                            dangerouslySetInnerHTML={{ __html: descHtml }}
                        />
                    ) : (
                        <motion.div
                            key="truncated"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-1 line-clamp-3 text-sm text-gray-600"
                            dangerouslySetInnerHTML={{ __html: descHtml }}
                        />
                    )}
                </AnimatePresence>
                <div className="mt-4 flex justify-between gap-4">
                    <div className="flex-1">
                        <span className="block text-sm font-semibold text-[#902729]">
                            {currency} {singleRate.toLocaleString()} (Single)
                        </span>
                        {canAddToCart && (
                            <button
                                onClick={() =>
                                    handleAddRoomToCart(room, 'Single')
                                }
                                className="mt-2 w-full rounded-xl bg-[#902729] px-4 py-2 text-sm text-white hover:bg-[#9c7833]"
                            >
                                Book Single
                            </button>
                        )}
                    </div>
                    <div className="flex-1">
                        <span className="block text-sm font-semibold text-[#902729]">
                            {currency} {doubleRate.toLocaleString()} (Double)
                        </span>
                        {canAddToCart && (
                            <button
                                onClick={() =>
                                    handleAddRoomToCart(room, 'Double')
                                }
                                className="mt-2 w-full rounded-xl bg-[#902729] px-4 py-2 text-sm text-white hover:bg-[#9c7833]"
                            >
                                Book Double
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export const ChildPolicyCard: React.FC<{ policy: ChildPolicy }> = ({
    policy,
}) => {
    return (
        <div className="overflow-hidden rounded-lg bg-white shadow-md">
            <div className="p-4">
                <h3 className="text-lg font-bold text-[#902729]">
                    {policy.age}
                </h3>
                <div className="text-sm text-gray-600">
                    Sharing: {policy.sharing}
                </div>
                <div className="text-sm text-gray-600">
                    Non-Sharing: {policy.nonSharing}
                </div>
            </div>
        </div>
    );
};

export const MealCard: React.FC<{
    meal: Meal;
    residency: Residency;
    hoveredItem: string | null;
    setHoveredItem: (id: string | null) => void;
}> = ({ meal, residency, hoveredItem, setHoveredItem }) => {
    const id = meal.id;
    const isHovered = hoveredItem === id;
    const imageUrl = extractImageUrl(meal.description);
    const descHtml = removeImg(meal.description);
    const adultRate =
        residency === 'East African Resident'
            ? meal.adult_rate_kshs
            : meal.adult_rate_usd;
    const childRate =
        residency === 'East African Resident'
            ? meal.child_rate_kshs
            : meal.child_rate_usd;
    const currency = residency === 'East African Resident' ? 'KES' : 'USD';

    return (
        <motion.div
            onMouseEnter={() => setHoveredItem(id)}
            onMouseLeave={() => setHoveredItem(null)}
            layout
            transition={{ layout: { duration: 0.35, ease: 'easeInOut' } }}
            className="cursor-pointer overflow-hidden rounded-lg bg-white shadow-md"
            whileHover={{ boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
        >
            {imageUrl && (
                <div className="overflow-hidden">
                    <motion.img
                        src={imageUrl}
                        alt={meal.name}
                        className="h-48 w-full object-cover"
                        animate={{ scale: isHovered ? 1.05 : 1 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                    />
                </div>
            )}
            <div className="p-4">
                <span className="rounded bg-gray-200 px-2 py-1 text-xs font-medium text-gray-800">
                    Buffet Meal
                </span>
                <h3 className="mt-2 text-lg font-bold text-[#902729]">
                    {meal.name}
                </h3>
                <AnimatePresence initial={false} mode="wait">
                    {isHovered ? (
                        <motion.div
                            key="full"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.35, ease: 'easeInOut' }}
                            className="mt-1 overflow-hidden bg-[#9c7833]/10 px-2 py-1 text-sm text-gray-700"
                            dangerouslySetInnerHTML={{ __html: descHtml }}
                        />
                    ) : (
                        <motion.div
                            key="truncated"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-1 line-clamp-3 text-sm text-gray-600"
                            dangerouslySetInnerHTML={{ __html: descHtml }}
                        />
                    )}
                </AnimatePresence>
                <div className="mt-4 flex justify-between gap-4">
                    <div className="flex-1">
                        <span className="block text-sm font-semibold text-[#902729]">
                            Adult: {currency} {adultRate.toLocaleString()}
                        </span>
                    </div>
                    <div className="flex-1">
                        <span className="block text-sm font-semibold text-[#902729]">
                            Child: {currency} {childRate.toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export const ConferenceCard: React.FC<{
    conference: ConferencePackage;
    residency: Residency;
    handleAddConferenceToCart: (conference: ConferencePackage) => void;
    hoveredItem: string | null;
    setHoveredItem: (id: string | null) => void;
}> = ({
    conference,
    residency,
    handleAddConferenceToCart,
    hoveredItem,
    setHoveredItem,
}) => {
    const id = conference.id;
    const isHovered = hoveredItem === id;
    const imageUrl = extractImageUrl(conference.description);
    const descHtml = removeImg(conference.description);
    const rate =
        residency === 'East African Resident'
            ? conference.rate_kshs
            : conference.rate_usd;
    const currency = residency === 'East African Resident' ? 'KES' : 'USD';

    return (
        <motion.div
            onMouseEnter={() => setHoveredItem(id)}
            onMouseLeave={() => setHoveredItem(null)}
            layout
            transition={{ layout: { duration: 0.35, ease: 'easeInOut' } }}
            className="cursor-pointer overflow-hidden rounded-lg bg-white shadow-md"
            whileHover={{ boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
        >
            {imageUrl && (
                <div className="overflow-hidden">
                    <motion.img
                        src={imageUrl}
                        alt={conference.name}
                        className="h-48 w-full object-cover"
                        animate={{ scale: isHovered ? 1.05 : 1 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                    />
                </div>
            )}
            <div className="p-4">
                <span className="rounded bg-gray-200 px-2 py-1 text-xs font-medium text-gray-800">
                    Conference Package
                </span>
                <h3 className="mt-2 text-lg font-bold text-[#902729]">
                    {conference.name}
                </h3>
                <AnimatePresence initial={false} mode="wait">
                    {isHovered ? (
                        <motion.div
                            key="full"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.35, ease: 'easeInOut' }}
                            className="mt-1 overflow-hidden bg-[#9c7833]/10 px-2 py-1 text-sm text-gray-700"
                            dangerouslySetInnerHTML={{ __html: descHtml }}
                        />
                    ) : (
                        <motion.div
                            key="truncated"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-1 line-clamp-3 text-sm text-gray-600"
                            dangerouslySetInnerHTML={{ __html: descHtml }}
                        />
                    )}
                </AnimatePresence>
                <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#902729]">
                        {currency} {rate.toLocaleString()}
                    </span>
                    <button
                        onClick={() => handleAddConferenceToCart(conference)}
                        className="rounded-xl bg-[#902729] px-4 py-2 text-sm text-white hover:bg-[#9c7833]"
                    >
                        Book
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export const ExperiencesTab: React.FC<ExperiencesTabProps> = ({
    description,
    rooms,
    meals,
    conferences,
    hoveredItem,
    setHoveredItem,
    residency,
    boardType,
    setBoardType,
    isLoading,
    getRoomCountInCart,
    handleAddRoomToCart,
    handleAddConferenceToCart,
}) => {
    const childrenPolicy: ChildPolicy[] = [
        {
            age: '3 years and below',
            sharing: 'Complimentary',
            nonSharing: 'N/A',
        },
        {
            age: '4 to 11 years',
            sharing: '50% adult rate',
            nonSharing: '80% adult rate',
        },
        {
            age: '12 Years and Above',
            sharing: '100% adult rate',
            nonSharing: '100% adult rate',
        },
    ];

    return (
        <div className="space-y-6">
            <section aria-labelledby="room-rates">
                <h2
                    id="room-rates"
                    className="mb-6 text-center text-lg font-bold tracking-tight text-[#902729] sm:text-xl md:text-2xl lg:text-3xl"
                >
                    Rates
                </h2>
                <div className="mb-4 flex space-x-2">
                    {['FB', 'HB', 'BB'].map((type) => (
                        <button
                            key={type}
                            className={`flex-1 rounded-xl px-2 py-2 text-sm font-semibold transition-all duration-500 ease-in-out sm:px-4 ${boardType === type ? 'bg-[#902729] text-white' : 'bg-gray-200 text-gray-800 hover:bg-[#9c7833]/60'}`}
                            onClick={() => setBoardType(type as BoardType)}
                        >
                            {type === 'FB'
                                ? 'Full Board'
                                : type === 'HB'
                                  ? 'Half Board'
                                  : 'Bed & Breakfast'}
                        </button>
                    ))}
                </div>
                {isLoading ? (
                    <LoadingComponent />
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {rooms.map((room) => (
                            <RoomCard
                                key={room.id}
                                room={room}
                                boardType={boardType}
                                residency={residency}
                                handleAddRoomToCart={handleAddRoomToCart}
                                getRoomCountInCart={getRoomCountInCart}
                                hoveredItem={hoveredItem}
                                setHoveredItem={setHoveredItem}
                            />
                        ))}
                    </div>
                )}
            </section>

            <section aria-labelledby="children-policy">
                <h2
                    id="children-policy"
                    className="mb-6 text-center text-lg font-bold tracking-tight text-[#902729] sm:text-xl md:text-2xl lg:text-3xl"
                >
                    Children Policy
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {childrenPolicy.map((policy, index) => (
                        <ChildPolicyCard key={index} policy={policy} />
                    ))}
                </div>
            </section>

            <section aria-labelledby="holiday-supplements">
                <h2
                    id="holiday-supplements"
                    className="mb-8 text-center text-lg font-bold tracking-tight text-[#902729] sm:text-xl md:text-2xl lg:text-3xl"
                >
                    Holiday Supplements
                </h2>
                <p className="rounded-xl border border-[#9c7833]/20 bg-white/80 p-4 text-[#000]">
                    Holiday supplements apply during Christmas (Dec 24-25-26)
                    and Easter (Good Friday, Easter Saturday, Easter Sunday,
                    Easter Monday). Adults are charged KES 4,000 per night,
                    children (ages 4-11) KES 2,000 per night,while children 0-3
                    stay free; minimum 2-night stay. East African Residents
                    receive a premium brunch and activity vouchers.
                </p>
            </section>

            <section aria-labelledby="buffet-meals">
                <h2
                    id="buffet-meals"
                    className="mb-6 text-center text-lg font-bold tracking-tight text-[#902729] sm:text-xl md:text-2xl lg:text-3xl"
                >
                    Buffet Meals
                </h2>
                {isLoading ? (
                    <LoadingComponent />
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {meals.map((meal) => (
                            <MealCard
                                key={meal.id}
                                meal={meal}
                                residency={residency}
                                hoveredItem={hoveredItem}
                                setHoveredItem={setHoveredItem}
                            />
                        ))}
                    </div>
                )}
            </section>

            <section aria-labelledby="meeting-packages">
                <h2
                    id="meeting-packages"
                    className="mb-6 text-center text-lg font-bold tracking-tight text-[#902729] sm:text-xl md:text-2xl lg:text-3xl"
                >
                    Conference Packages
                </h2>
                {isLoading ? (
                    <LoadingComponent />
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {conferences.map((conference) => (
                            <ConferenceCard
                                key={conference.id}
                                conference={conference}
                                residency={residency}
                                handleAddConferenceToCart={
                                    handleAddConferenceToCart
                                }
                                hoveredItem={hoveredItem}
                                setHoveredItem={setHoveredItem}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};
