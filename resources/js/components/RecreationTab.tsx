'use client';

import { getRoomRate } from '@/lib/rateUtils';
import {
    BoardType,
    ChildPolicy,
    LeisureExperience,
    LeisureRoom,
    Meal,
    Residency,
} from '@/types/types';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { MealCard } from './ExperiencesTab';
import { LoadingComponent } from './LoadingComponent';

interface RecreationTabProps {
    description: string | null;
    leisureRooms: LeisureRoom[];
    leisureExperiences: LeisureExperience[];
    meals: Meal[];
    hoveredItem: string | null;
    setHoveredItem: (id: string | null) => void;
    residency: Residency;
    boardType: BoardType;
    setBoardType: (type: BoardType) => void;
    isLoading: boolean;
    getRoomCountInCart: (roomId: string) => number;
    handleAddLeisureRoomToCart: (
        room: LeisureRoom,
        occupancy: 'Single' | 'Double',
    ) => void;
    handleAddLeisureToCart: (leisure: LeisureExperience) => void;
}

const extractImageUrl = (html: string): string | null => {
    const match = html?.match(/src="([^"]*)"/i);
    return match ? match[1] : null;
};

const removeImg = (html: string): string =>
    html?.replace(/<img[^>]*>/gi, '').trim();

export const LeisureExperienceCard: React.FC<{
    activity: LeisureExperience;
    residency: Residency;
    handleAddLeisureToCart: (leisure: LeisureExperience) => void;
    hoveredItem: string | null;
    setHoveredItem: (id: string | null) => void;
}> = ({
    activity,
    residency,
    handleAddLeisureToCart,
    hoveredItem,
    setHoveredItem,
}) => {
    const id = activity.id.toString();
    const isHovered = hoveredItem === id;
    const imageUrl = extractImageUrl(activity.description || '');
    const descHtml = removeImg(activity.description || '');
    const adultPrice =
        residency === 'East African Resident'
            ? activity.price_adults || 0
            : (activity.price_adults || 0) / 130;
    const kidPrice =
        residency === 'East African Resident'
            ? activity.price_kids || 0
            : (activity.price_kids || 0) / 130;
    const currency = residency === 'East African Resident' ? 'KES' : 'USD';
    const [expanded, setExpanded] = useState(false);
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
                        alt={activity.title}
                        className="h-48 w-full object-cover"
                        animate={{ scale: isHovered ? 1.05 : 1 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                    />
                </div>
            )}
            <div className="p-4">
                <span className="rounded bg-gray-200 px-2 py-1 text-xs font-medium text-gray-800">
                    Recreation Activity
                </span>
                <h3 className="mt-2 text-lg font-bold text-[#902729]">
                    {activity.title}
                </h3>
                <AnimatePresence initial={false} mode="wait">
                    {expanded && descHtml ? (
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

                <button
                    onClick={() => setExpanded((prev) => !prev)}
                    className="mt-1 text-xs font-semibold text-[#902729] hover:underline"
                >
                    {expanded ? 'Read less' : 'Read more'}
                </button>
                <div className="mt-4 flex items-end justify-between gap-4">
                    <div>
                        <span className="block text-sm font-semibold text-[#902729]">
                            Adult: {currency} {adultPrice.toLocaleString()}
                        </span>
                        <span className="block text-sm font-semibold text-[#902729]">
                            Kids: {currency} {kidPrice.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-500">
                            per session
                        </span>
                    </div>
                    <button
                        onClick={() => handleAddLeisureToCart(activity)}
                        className="rounded-xl bg-[#902729] px-4 py-2 text-sm text-white hover:bg-[#9c7833]"
                    >
                        Book
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export const LeisureRoomCard: React.FC<{
    room: LeisureRoom;
    boardType: BoardType;
    residency: Residency;
    handleAddLeisureRoomToCart: (
        room: LeisureRoom,
        occupancy: 'Single' | 'Double',
    ) => void;
    getRoomCountInCart: (roomId: string) => number;
    hoveredItem: string | null;
    setHoveredItem: (id: string | null) => void;
}> = ({
    room,
    boardType,
    residency,
    handleAddLeisureRoomToCart,
    getRoomCountInCart,
    hoveredItem,
    setHoveredItem,
}) => {
    const id = room.id;
    const isHovered = hoveredItem === id;
    const imageUrl = extractImageUrl(room.description || '');
    const descHtml = removeImg(room.description || '');
    const singleRate = getRoomRate(room, boardType, residency, 'Single');
    const doubleRate = getRoomRate(room, boardType, residency, 'Double');
    const currency = residency === 'East African Resident' ? 'KES' : 'USD';
    const roomCountInCart = getRoomCountInCart(room.id);
    const canAddToCart = roomCountInCart < room.number_of_rooms;
    const [expanded, setExpanded] = useState(false);

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
                        alt={room.name}
                        className="h-48 w-full object-cover"
                        animate={{ scale: isHovered ? 1.05 : 1 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                    />
                </div>
            )}
            <div className="p-4">
                <span className="rounded bg-gray-200 px-2 py-1 text-xs font-medium text-gray-800">
                    Leisure Room
                </span>
                <h3 className="mt-2 text-lg font-bold text-[#902729]">
                    {room.name}
                </h3>
                <AnimatePresence initial={false} mode="wait">
                    {expanded && descHtml ? (
                        <motion.div
                            key="full"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.35, ease: 'easeInOut' }}
                            className="prose mt-1 max-w-none overflow-hidden bg-[#9c7833]/10 px-2 py-1 text-sm text-gray-700"
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

                <button
                    onClick={() => setExpanded((prev) => !prev)}
                    className="mt-1 text-xs font-semibold text-[#902729] hover:underline"
                >
                    {expanded ? 'Read less' : 'Read more'}
                </button>
                <div className="mt-4 flex justify-between gap-4">
                    <div className="flex-1">
                        <span className="block text-sm font-semibold text-[#902729]">
                            {currency} {singleRate.toLocaleString()} (Single)
                        </span>
                        {canAddToCart && (
                            <button
                                onClick={() =>
                                    handleAddLeisureRoomToCart(room, 'Single')
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
                                    handleAddLeisureRoomToCart(room, 'Double')
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

export const RecreationTab: React.FC<RecreationTabProps> = ({
    description,
    leisureRooms,
    leisureExperiences,
    hoveredItem,
    meals,
    setHoveredItem,
    residency,
    boardType,
    setBoardType,
    isLoading,
    getRoomCountInCart,
    handleAddLeisureRoomToCart,
    handleAddLeisureToCart,
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
            {description && (
                <div className="mb-8 rounded-2xl border border-[#9c7833]/60 bg-white/80 p-6">
                    <p
                        className="mb-4 text-base text-gray-800 sm:text-lg"
                        dangerouslySetInnerHTML={{ __html: description }}
                    ></p>
                </div>
            )}

            <section aria-labelledby="leisure-room-rates">
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
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {leisureRooms.map((room) => (
                            <LeisureRoomCard
                                key={room.id}
                                room={room}
                                boardType={boardType}
                                residency={residency}
                                handleAddLeisureRoomToCart={
                                    handleAddLeisureRoomToCart
                                }
                                getRoomCountInCart={getRoomCountInCart}
                                hoveredItem={hoveredItem}
                                setHoveredItem={setHoveredItem}
                            />
                        ))}
                    </div>
                )}
            </section>

            <section aria-labelledby="children-policy-recreation">
                <h2
                    id="children-policy-recreation"
                    className="mb-6 text-center text-lg font-bold tracking-tight text-[#902729] sm:text-xl md:text-2xl lg:text-3xl"
                >
                    Children Policy
                </h2>
                <div className="overflow-x-auto rounded-2xl border-1 border-[#9c7833]/60 shadow-lg">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gradient-to-r from-[#902729] to-[#9c7833]">
                                <th className="border-r-2 border-[#9c7833] px-6 py-4 text-left text-base font-bold text-white sm:text-lg">
                                    Age Group
                                </th>
                                <th className="border-r-2 border-[#9c7833] px-6 py-4 text-center text-base font-bold text-white sm:text-lg">
                                    Sharing Room
                                </th>
                                <th className="px-6 py-4 text-center text-base font-bold text-white sm:text-lg">
                                    Non-Sharing
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {childrenPolicy.map((policy, index) => (
                                <tr
                                    key={index}
                                    className={`border-b border-[#9c7833]/60 transition-all duration-300 ${index % 2 === 0 ? 'bg-white' : 'bg-white/80'} hover:bg-[#9c7833]/50`}
                                >
                                    <td className="border-r border-[#9c7833]/60 px-6 py-4">
                                        <span className="text-base font-bold text-[#902729] sm:text-lg">
                                            {policy.age}
                                        </span>
                                    </td>
                                    <td className="border-r border-[#9c7833]/60 px-6 py-4 text-center">
                                        <span className="text-base font-bold text-[#902729] sm:text-lg">
                                            {policy.sharing}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-base font-bold text-[#902729] sm:text-lg">
                                            {policy.nonSharing}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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
            {/* <section aria-labelledby="holiday-supplements-recreation">
                <h2
                    id="holiday-supplements-recreation"
                    className="mb-8 text-center text-lg font-bold tracking-tight text-[#902729] sm:text-xl md:text-2xl lg:text-3xl"
                >
                    Holiday Supplements
                </h2>
                <p className="rounded-xl border border-[#9c7833]/20 bg-white/80 p-4 text-[#000]">
                    Holiday supplements apply during Christmas (Dec 24-25-26)
                    and Easter (Good Friday, Easter Saturday, Easter Sunday,
                    Easter Monday). Adults are charged KES 4,000 per night,
                    children (ages 4-11) KES 2,000 per night, while children 0-3
                    stay free; minimum 2-night stay. East African Residents
                    receive a premium brunch and activity vouchers.
                </p>
            </section> */}
        </div>
    );
};
