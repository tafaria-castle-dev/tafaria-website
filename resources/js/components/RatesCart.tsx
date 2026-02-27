import { useRatesBooking } from '@/hooks/RatesCartContext';
import { Residency } from '@/types/types';
import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const RatesCart = () => {
    const { cart, removeFromCart, clearCart, setShowCart } = useRatesBooking();
    const [residency, setResidency] = useState<Residency>(
        'East African Resident',
    );
    const getCartMessage = () => {
        const currency = residency === 'East African Resident' ? 'KES' : 'USD';
        let message = `🏰 *Tafaria Castle Booking Request*\n\n`;

        cart.forEach((item, index) => {
            if (item.kind === 'room') {
                message += `📌 *Room Group ${index + 1}*\n`;
                message += `${item.room.name} - ${item.occupancy}\n`;
                message += `${item.numRooms} Room${item.numRooms > 1 ? 's' : ''} | ${item.nights} Night${item.nights > 1 ? 's' : ''}\n`;
                message += `${item.checkIn} → ${item.checkOut}\n`;
                message += `${item.boardType === 'FB' ? 'Full Board' : item.boardType === 'HB' ? 'Half Board' : 'Bed & Breakfast'}\n`;
                message += `Rate per Night: ${item.currency} ${item.roomRatePerNight.toLocaleString()}\n`;
                if (item.isKidsRoom) {
                    message += `Type: Kids Room\n`;
                } else if (item.hasKidsSharing) {
                    message += `Type: Adult Room with sharing kids\n`;
                }

                const hasKids = item.kidsAgesPerRoom.some(
                    (ages) => ages.length > 0,
                );
                if (hasKids) {
                    item.kidsAgesPerRoom.forEach((ages, rIndex) => {
                        if (ages.length > 0) {
                            message += `  Room ${rIndex + 1} - Kids: ${ages.join(', ')} yrs | ${item.currency} ${item.perRoomCosts[rIndex].toLocaleString()}\n`;
                        } else {
                            message += `  Room ${rIndex + 1} - ${item.currency} ${item.perRoomCosts[rIndex].toLocaleString()}\n`;
                        }
                    });
                } else {
                    item.perRoomCosts.forEach((cost, rIndex) => {
                        message += `  Room ${rIndex + 1} - ${item.currency} ${cost.toLocaleString()}\n`;
                    });
                }

                if (item.holidayMessage) {
                    message += `⚠️ ${item.holidayMessage}\n`;
                }
                message += `*Subtotal: ${item.currency} ${item.totalCost.toLocaleString()}*\n\n`;
            } else if (item.kind === 'leisure-room') {
                message += `📌 *Leisure Room Group ${index + 1}*\n`;
                message += `${item.room.name} - ${item.occupancy}\n`;
                message += `${item.numRooms} Room${item.numRooms > 1 ? 's' : ''} | ${item.nights} Night${item.nights > 1 ? 's' : ''}\n`;
                message += `${item.checkIn} → ${item.checkOut}\n`;
                message += `${item.boardType === 'FB' ? 'Full Board' : item.boardType === 'HB' ? 'Half Board' : 'Bed & Breakfast'}\n`;
                message += `Rate per Night: ${item.currency} ${item.roomRatePerNight.toLocaleString()}\n`;
                if (item.isKidsRoom) {
                    message += `Type: Kids Room\n`;
                } else if (item.hasKidsSharing) {
                    message += `Type: Adult Room with sharing kids\n`;
                }

                const hasKids = item.kidsAgesPerRoom.some(
                    (ages) => ages.length > 0,
                );
                if (hasKids) {
                    item.kidsAgesPerRoom.forEach((ages, rIndex) => {
                        if (ages.length > 0) {
                            message += `  Room ${rIndex + 1} - Kids: ${ages.join(', ')} yrs | ${item.currency} ${item.perRoomCosts[rIndex].toLocaleString()}\n`;
                        } else {
                            message += `  Room ${rIndex + 1} - ${item.currency} ${item.perRoomCosts[rIndex].toLocaleString()}\n`;
                        }
                    });
                } else {
                    item.perRoomCosts.forEach((cost, rIndex) => {
                        message += `  Room ${rIndex + 1} - ${item.currency} ${cost.toLocaleString()}\n`;
                    });
                }

                if (item.holidayMessage) {
                    message += `⚠️ ${item.holidayMessage}\n`;
                }
                message += `*Subtotal: ${item.currency} ${item.totalCost.toLocaleString()}*\n\n`;
            } else if (item.kind === 'conference') {
                message += `📌 *Conference Package ${index + 1}*\n`;
                message += `${item.conference.name}\n`;
                message += `${item.numGuests} Guest${item.numGuests > 1 ? 's' : ''} | ${item.nights} Night${item.nights > 1 ? 's' : ''}\n`;
                message += `${item.checkIn} → ${item.checkOut}\n`;
                if (item.holidayMessage) {
                    message += `⚠️ ${item.holidayMessage}\n`;
                }
                message += `*Subtotal: ${item.currency} ${item.totalCost.toLocaleString()}*\n\n`;
            } else if (item.kind === 'leisure') {
                message += `📌 *Recreation Activity ${index + 1}*\n`;
                message += `${item.leisure.title}\n`;
                message += `Adults: ${item.numAdults} | Kids: ${item.numKids}\n`;
                message += `${item.checkIn} → ${item.checkOut}\n`;
                message += `*Subtotal: ${item.currency} ${item.totalCost.toLocaleString()}*\n\n`;
            }
        });

        const totalCost = cart.reduce((sum, item) => sum + item.totalCost, 0);
        message += `━━━━━━━━━━━━━━━\n`;
        message += `💰 *TOTAL: ${currency} ${totalCost.toLocaleString()}*\n\n`;
        message += `Please confirm availability and final pricing. Thank you!`;

        return message;
    };
    const sendCartToWhatsApp = () => {
        const phoneNumber = '+254708877244';
        const currency = residency === 'East African Resident' ? 'KES' : 'USD';
        const message = getCartMessage();

        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };
    const clearCartAndClose = () => {
        clearCart();
        setShowCart(false);
    };
    const removeFromCartAndClose = (index: number) => {
        removeFromCart(index);
        if (cart.length <= 1) {
            setShowCart(false);
        }
    };
    const sendCartToEmail = () => {
        const email = 'info@tafaria.com';
        const subject = 'Tafaria Castle Booking Request';
        const currency = residency === 'East African Resident' ? 'KES' : 'USD';

        let textBody = `TAFARIA CASTLE BOOKING REQUEST\n`;
        textBody += `${'='.repeat(50)}\n\n`;
        textBody += `${cart.length} item${cart.length > 1 ? 's' : ''} in booking\n\n`;

        cart.forEach((item, index) => {
            if (item.kind === 'room') {
                textBody += `ROOM GROUP ${index + 1}\n`;
                textBody += `${'-'.repeat(50)}\n`;
                textBody += `Room: ${item.room.name}\n`;
                textBody += `Occupancy: ${item.occupancy}\n`;
                textBody += `Rate per Night: ${item.currency} ${item.roomRatePerNight.toLocaleString()}\n\n`;

                textBody += `Details:\n`;
                textBody += `  - Rooms: ${item.numRooms}\n`;
                textBody += `  - Nights: ${item.nights}\n`;
                textBody += `  - Check-in: ${item.checkIn}\n`;
                textBody += `  - Check-out: ${item.checkOut}\n`;
                textBody += `  - Board Type: ${item.boardType === 'FB' ? 'Full Board' : item.boardType === 'HB' ? 'Half Board' : 'Bed & Breakfast'}\n`;

                if (item.isKidsRoom) {
                    textBody += `  - Type: Kids Room\n`;
                } else if (item.hasKidsSharing) {
                    textBody += `  - Type: Adult Room with Kids\n`;
                }

                const hasKids = item.kidsAgesPerRoom.some(
                    (ages) => ages.length > 0,
                );
                if (hasKids) {
                    textBody += `\nRoom Breakdown:\n`;
                    item.kidsAgesPerRoom.forEach((ages, rIndex) => {
                        if (ages.length > 0) {
                            textBody += `  Room ${rIndex + 1} - Kids: ${ages.join(', ')} yrs | ${item.currency} ${item.perRoomCosts[rIndex].toLocaleString()}\n`;
                        } else {
                            textBody += `  Room ${rIndex + 1} - ${item.currency} ${item.perRoomCosts[rIndex].toLocaleString()}\n`;
                        }
                    });
                } else {
                    textBody += `\nRoom Breakdown:\n`;
                    item.perRoomCosts.forEach((cost, rIndex) => {
                        textBody += `  Room ${rIndex + 1} - ${item.currency} ${cost.toLocaleString()}\n`;
                    });
                }

                if (item.holidayMessage) {
                    textBody += `\n** NOTE: ${item.holidayMessage}\n`;
                }

                textBody += `\nSubtotal: ${item.currency} ${item.totalCost.toLocaleString()}\n\n`;
            } else if (item.kind === 'leisure-room') {
                textBody += `LEISURE ROOM GROUP ${index + 1}\n`;
                textBody += `${'-'.repeat(50)}\n`;
                textBody += `Room: ${item.room.name}\n`;
                textBody += `Occupancy: ${item.occupancy}\n`;
                textBody += `Rate per Night: ${item.currency} ${item.roomRatePerNight.toLocaleString()}\n\n`;

                textBody += `Details:\n`;
                textBody += `  - Rooms: ${item.numRooms}\n`;
                textBody += `  - Nights: ${item.nights}\n`;
                textBody += `  - Check-in: ${item.checkIn}\n`;
                textBody += `  - Check-out: ${item.checkOut}\n`;
                textBody += `  - Board Type: ${item.boardType === 'FB' ? 'Full Board' : item.boardType === 'HB' ? 'Half Board' : 'Bed & Breakfast'}\n`;

                if (item.isKidsRoom) {
                    textBody += `  - Type: Kids Room\n`;
                } else if (item.hasKidsSharing) {
                    textBody += `  - Type: Adult Room with Kids\n`;
                }

                const hasKids = item.kidsAgesPerRoom.some(
                    (ages) => ages.length > 0,
                );
                if (hasKids) {
                    textBody += `\nRoom Breakdown:\n`;
                    item.kidsAgesPerRoom.forEach((ages, rIndex) => {
                        if (ages.length > 0) {
                            textBody += `  Room ${rIndex + 1} - Kids: ${ages.join(', ')} yrs | ${item.currency} ${item.perRoomCosts[rIndex].toLocaleString()}\n`;
                        } else {
                            textBody += `  Room ${rIndex + 1} - ${item.currency} ${item.perRoomCosts[rIndex].toLocaleString()}\n`;
                        }
                    });
                } else {
                    textBody += `\nRoom Breakdown:\n`;
                    item.perRoomCosts.forEach((cost, rIndex) => {
                        textBody += `  Room ${rIndex + 1} - ${item.currency} ${cost.toLocaleString()}\n`;
                    });
                }

                if (item.holidayMessage) {
                    textBody += `\n** NOTE: ${item.holidayMessage}\n`;
                }

                textBody += `\nSubtotal: ${item.currency} ${item.totalCost.toLocaleString()}\n\n`;
            } else if (item.kind === 'conference') {
                textBody += `CONFERENCE PACKAGE ${index + 1}\n`;
                textBody += `${'-'.repeat(50)}\n`;
                textBody += `Package: ${item.conference.name}\n\n`;

                textBody += `Details:\n`;
                textBody += `  - Guests: ${item.numGuests}\n`;
                textBody += `  - Nights: ${item.nights}\n`;
                textBody += `  - Check-in: ${item.checkIn}\n`;
                textBody += `  - Check-out: ${item.checkOut}\n`;

                if (item.holidayMessage) {
                    textBody += `\n** NOTE: ${item.holidayMessage}\n`;
                }

                textBody += `\nSubtotal: ${item.currency} ${item.totalCost.toLocaleString()}\n\n`;
            } else if (item.kind === 'leisure') {
                textBody += `RECREATION ACTIVITY ${index + 1}\n`;
                textBody += `${'-'.repeat(50)}\n`;
                textBody += `Activity: ${item.leisure.title}\n\n`;

                textBody += `Details:\n`;
                textBody += `  - Adults: ${item.numAdults}\n`;
                textBody += `  - Kids: ${item.numKids}\n`;
                textBody += `  - Date: ${item.checkIn}\n`;

                if (item.leisure.description) {
                    textBody += `  - Description: ${item.leisure.description}\n`;
                }

                textBody += `\nSubtotal: ${item.currency} ${item.totalCost.toLocaleString()}\n\n`;
            }
        });

        const totalCost = cart.reduce((sum, item) => sum + item.totalCost, 0);

        textBody += `${'='.repeat(50)}\n`;
        textBody += `GRAND TOTAL: ${currency} ${totalCost.toLocaleString()}\n`;
        textBody += `${'='.repeat(50)}\n\n`;
        textBody += `Please confirm availability and final pricing. Thank you!\n\n`;
        textBody += `Tafaria Castle`;

        const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(textBody)}`;
        window.open(mailtoUrl, '_blank');
    };
    return (
        <div>
            {cart.length > 0 && (
                <section aria-labelledby="cart-summary">
                    <div className="overflow-hidden rounded-2xl border border-[#902729]/20 bg-gradient-to-br from-white to-gray-50 shadow-lg">
                        <div className="flex bg-gradient-to-r from-[#902729] to-[#902729] px-6 py-4">
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-white">
                                    Your Booking Summary
                                </h2>
                            </div>
                            <button
                                onClick={() => setShowCart(false)}
                                className="p-4 text-white"
                            >
                                <FaTimes className="h-9 w-9" />
                            </button>
                        </div>

                        <div className="space-y-4 p-6">
                            <div className="grid sm:grid-cols-2">
                                {cart.map((item, index) => (
                                    <div
                                        key={index}
                                        className="relative rounded-xl border-2 border-[#902729]/30 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                                    >
                                        <div className="absolute top-3 right-3">
                                            <button
                                                className="rounded-full bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100"
                                                onClick={() =>
                                                    removeFromCartAndClose(
                                                        index,
                                                    )
                                                }
                                                title="Remove item"
                                            >
                                                <svg
                                                    className="h-5 w-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>
                                            </button>
                                        </div>

                                        {item.kind === 'room' ||
                                        item.kind === 'leisure-room' ? (
                                            <div className="pr-12">
                                                <div className="mb-3 flex items-start gap-3">
                                                    <div className="rounded-lg bg-[#902729] p-2">
                                                        <svg
                                                            className="h-6 w-6 text-white"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-bold text-gray-800">
                                                            {item.room.name}
                                                        </h3>
                                                        <p className="text-sm text-gray-600">
                                                            {item.occupancy} KES{' '}
                                                            {
                                                                item.roomRatePerNight
                                                            }
                                                            {item.kind ===
                                                            'room'
                                                                ? ' per night'
                                                                : ' per night (Leisure Room)'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mb-3 grid grid-cols-2 gap-3 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-gray-500">
                                                            Rooms:
                                                        </span>
                                                        <span className="font-semibold text-gray-800">
                                                            {item.numRooms}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-gray-500">
                                                            Nights:
                                                        </span>
                                                        <span className="font-semibold text-gray-800">
                                                            {item.nights}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-gray-500">
                                                            Check-in:
                                                        </span>
                                                        <span className="font-semibold text-gray-800">
                                                            {item.checkIn}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-gray-500">
                                                            Check-out:
                                                        </span>
                                                        <span className="font-semibold text-gray-800">
                                                            {item.checkOut}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="mb-3 flex items-center gap-2 text-sm">
                                                    <span className="rounded-full bg-[#902729]/10 px-3 py-1 font-medium text-[#902729]">
                                                        {item.boardType === 'FB'
                                                            ? 'Full Board'
                                                            : item.boardType ===
                                                                'HB'
                                                              ? 'Half Board'
                                                              : 'Bed & Breakfast'}
                                                    </span>
                                                    {item.isKidsRoom && (
                                                        <span className="rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-700">
                                                            Kids Room
                                                        </span>
                                                    )}
                                                    {item.hasKidsSharing &&
                                                        !item.isKidsRoom && (
                                                            <span className="rounded-full bg-purple-50 px-3 py-1 font-medium text-purple-700">
                                                                With Kids
                                                            </span>
                                                        )}
                                                </div>

                                                {item.kidsAgesPerRoom.some(
                                                    (ages) => ages.length > 0,
                                                ) && (
                                                    <div className="mb-3 space-y-2 rounded-lg bg-blue-50 p-3">
                                                        {item.kidsAgesPerRoom.map(
                                                            (ages, rIndex) =>
                                                                ages.length >
                                                                0 ? (
                                                                    <div
                                                                        key={
                                                                            rIndex
                                                                        }
                                                                        className="flex items-center justify-between text-sm"
                                                                    >
                                                                        <div>
                                                                            <span className="font-semibold text-gray-700">
                                                                                Room{' '}
                                                                                {rIndex +
                                                                                    1}
                                                                            </span>
                                                                            <span className="ml-2 text-gray-600">
                                                                                Kids:{' '}
                                                                                {ages.join(
                                                                                    ', ',
                                                                                )}{' '}
                                                                                yrs
                                                                            </span>
                                                                        </div>
                                                                        <span className="font-semibold text-gray-800">
                                                                            {
                                                                                item.currency
                                                                            }{' '}
                                                                            {item.perRoomCosts[
                                                                                rIndex
                                                                            ].toLocaleString()}
                                                                        </span>
                                                                    </div>
                                                                ) : null,
                                                        )}
                                                    </div>
                                                )}

                                                {item.holidayMessage && (
                                                    <div className="mb-3 border-l-4 border-amber-400 bg-amber-50 p-3">
                                                        <p className="text-sm text-amber-800">
                                                            <span className="font-semibold">
                                                                Note:
                                                            </span>{' '}
                                                            {
                                                                item.holidayMessage
                                                            }
                                                        </p>
                                                    </div>
                                                )}

                                                <div className="border-t border-gray-200 pt-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-medium text-gray-600">
                                                            Total for Group:
                                                        </span>
                                                        <span className="text-xl font-bold text-[#902729]">
                                                            {item.currency}{' '}
                                                            {item.totalCost.toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : item.kind === 'conference' ? (
                                            <div className="pr-12">
                                                <div className="mb-3 flex items-start gap-3">
                                                    <div className="rounded-lg bg-[#902729] p-2">
                                                        <svg
                                                            className="h-6 w-6 text-white"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-bold text-gray-800">
                                                            {
                                                                item.conference
                                                                    .name
                                                            }
                                                        </h3>
                                                        <p className="text-sm text-gray-600">
                                                            Conference Package
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mb-3 grid grid-cols-2 gap-3 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-gray-500">
                                                            Guests:
                                                        </span>
                                                        <span className="font-semibold text-gray-800">
                                                            {item.numGuests}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-gray-500">
                                                            Nights:
                                                        </span>
                                                        <span className="font-semibold text-gray-800">
                                                            {item.nights}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-gray-500">
                                                            Check-in:
                                                        </span>
                                                        <span className="font-semibold text-gray-800">
                                                            {item.checkIn}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-gray-500">
                                                            Check-out:
                                                        </span>
                                                        <span className="font-semibold text-gray-800">
                                                            {item.checkOut}
                                                        </span>
                                                    </div>
                                                </div>
                                                {item.holidayMessage && (
                                                    <div className="mb-3 border-l-4 border-amber-400 bg-amber-50 p-3">
                                                        <p className="text-sm text-amber-800">
                                                            <span className="font-semibold">
                                                                Note:
                                                            </span>{' '}
                                                            {
                                                                item.holidayMessage
                                                            }
                                                        </p>
                                                    </div>
                                                )}

                                                <div className="border-t border-gray-200 pt-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-medium text-gray-600">
                                                            Total Cost:
                                                        </span>
                                                        <span className="text-xl font-bold text-[#902729]">
                                                            {item.currency}{' '}
                                                            {item.totalCost.toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="pr-12">
                                                <div className="mb-3 flex items-start gap-3">
                                                    <div className="rounded-lg bg-[#902729] p-2">
                                                        <svg
                                                            className="h-6 w-6 text-white"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-bold text-gray-800">
                                                            {item.leisure.title}
                                                        </h3>
                                                        <p className="text-sm text-gray-600">
                                                            Recreation Activity
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mb-3 grid grid-cols-2 gap-3 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-gray-500">
                                                            Adults:
                                                        </span>
                                                        <span className="font-semibold text-gray-800">
                                                            {item.numAdults}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-gray-500">
                                                            Kids:
                                                        </span>
                                                        <span className="font-semibold text-gray-800">
                                                            {item.numKids}
                                                        </span>
                                                    </div>
                                                    <div className="col-span-2 flex items-center gap-2">
                                                        <span className="text-gray-500">
                                                            Date:
                                                        </span>
                                                        <span className="font-semibold text-gray-800">
                                                            {item.checkIn}
                                                        </span>
                                                    </div>
                                                </div>

                                                {item.leisure.description && (
                                                    <div className="mb-3 rounded-lg bg-gray-50 p-3">
                                                        <p className="text-sm text-gray-700">
                                                            {
                                                                item.leisure
                                                                    .description
                                                            }
                                                        </p>
                                                    </div>
                                                )}

                                                <div className="border-t border-gray-200 pt-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-medium text-gray-600">
                                                            Total Cost:
                                                        </span>
                                                        <span className="text-xl font-bold text-[#902729]">
                                                            {item.currency}{' '}
                                                            {item.totalCost.toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="rounded-xl bg-gradient-to-r from-[#902729] to-[#902729] p-6 text-white">
                                <div className="flex items-center justify-between">
                                    <svg
                                        className="h-12 w-12 opacity-20"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <div>
                                        <p className="text-sm opacity-90">
                                            Grand Total
                                        </p>
                                        <p className="mt-1 text-xl font-bold sm:text-3xl">
                                            {residency ===
                                            'East African Resident'
                                                ? 'KES'
                                                : 'USD'}{' '}
                                            {cart
                                                .reduce(
                                                    (sum, item) =>
                                                        sum + item.totalCost,
                                                    0,
                                                )
                                                .toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                                <button
                                    className="w-full rounded-xl bg-gray-200 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-200 sm:flex-1"
                                    onClick={clearCartAndClose}
                                >
                                    Clear Booking
                                </button>
                                <div className="flex gap-3 sm:flex-2">
                                    <button
                                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#902729] to-[#902729] px-6 py-3 font-semibold text-white transition-shadow hover:shadow-lg"
                                        onClick={sendCartToEmail}
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
                                        <span className="sm:hidden">Email</span>
                                    </button>
                                    <button
                                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#902729] to-[#902729] px-6 py-3 font-semibold text-white transition-shadow hover:shadow-lg"
                                        onClick={sendCartToWhatsApp}
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
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default RatesCart;
