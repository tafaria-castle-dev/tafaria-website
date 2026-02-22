import {
    ConferencePackage,
    LeisureExperience,
    LeisureRoom,
    Residency,
    Room,
} from '@/types/types';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

interface SelectionModalProps {
    selectedRoom: Room | null;
    selectedLeisureRoom: LeisureRoom | null;
    selectedConference: ConferencePackage | null;
    selectedLeisure: LeisureExperience | null;
    selectedOccupancy: 'Single' | 'Double' | null;
    numRooms: number;
    setNumRooms: (n: number) => void;
    checkIn: string;
    checkOut: string;
    setShowDatePicker: (v: boolean) => void;
    datePickerTriggerRef: React.RefObject<HTMLDivElement | null>;
    residency: Residency;
    getRoomCountInCart: (roomId: string) => number;
    onConfirm: (data: {
        isKidsRoom?: boolean;
        hasKidsSharing?: boolean;
        kidsAgesPerRoom?: number[][];
        numGuests?: number;
        numAdults?: number;
        numKids?: number;
    }) => void;
    onClose: () => void;
}

export const SelectionModal: React.FC<SelectionModalProps> = ({
    selectedRoom,
    selectedLeisureRoom,
    selectedConference,
    selectedLeisure,
    selectedOccupancy,
    numRooms,
    setNumRooms,
    checkIn,
    checkOut,
    setShowDatePicker,
    datePickerTriggerRef,
    residency,
    getRoomCountInCart,
    onConfirm,
    onClose,
}) => {
    const [isKidsRoom, setIsKidsRoom] = useState(false);
    const [hasKidsSharing, setHasKidsSharing] = useState(false);
    const [kidsAgesPerRoom, setKidsAgesPerRoom] = useState<number[][]>([]);
    const [numGuests, setNumGuests] = useState(1);
    const [numAdults, setNumAdults] = useState(1);
    const [numKids, setNumKids] = useState(0);

    const room = selectedRoom || selectedLeisureRoom;
    const maxRooms = room
        ? room.number_of_rooms - getRoomCountInCart(room.id)
        : 1;
    const isRoom = !!(selectedRoom || selectedLeisureRoom);
    const isConference = !!selectedConference;
    const isLeisure = !!selectedLeisure;

    useEffect(() => {
        if (isRoom) {
            setKidsAgesPerRoom(
                Array(numRooms)
                    .fill(0)
                    .map(() => []),
            );
        }
    }, [numRooms, isRoom]);

    const handleConfirmBooking = () => {
        onConfirm({
            isKidsRoom,
            hasKidsSharing,
            kidsAgesPerRoom,
            numGuests,
            numAdults,
            numKids,
        });
    };

    return (
        <>
            <div
                className="fixed inset-0 z-40 bg-black/50 opacity-100 transition-opacity duration-300"
                onClick={onClose}
            />
            <div className="fixed top-1/2 left-1/2 z-50 max-h-[80vh] w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2 scale-100 overflow-y-auto rounded-lg bg-white p-8 opacity-100 shadow-2xl transition-all duration-300">
                <button
                    className="absolute top-4 right-4 z-10 rounded-full bg-[#902729] p-2 text-white hover:bg-[#9c7833]"
                    onClick={onClose}
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

                <h4 className="mb-6 text-xl font-bold tracking-wide text-[#902729]">
                    {room
                        ? `${room.name} - ${selectedOccupancy}`
                        : selectedConference
                          ? selectedConference.name
                          : selectedLeisure?.title}
                </h4>

                <div className="space-y-4">
                    <div
                        className="flex items-center gap-2 rounded-xl border border-[#9c7833] bg-white px-4 py-3"
                        ref={datePickerTriggerRef}
                    >
                        <svg
                            className="h-5 w-5 text-[#94723C]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        <span className="flex-1 text-gray-800">
                            {checkIn
                                ? format(new Date(checkIn), 'dd MMM yyyy')
                                : 'Check-in'}{' '}
                            —{' '}
                            {checkOut
                                ? format(new Date(checkOut), 'dd MMM yyyy')
                                : 'Check-out'}
                        </span>
                        <button
                            onClick={() => setShowDatePicker(true)}
                            className="text-sm text-[#902729] underline"
                        >
                            Change
                        </button>
                    </div>

                    {isRoom && (
                        <>
                            <div>
                                <label className="block text-base font-semibold text-gray-800">
                                    Number of Rooms (Max: {maxRooms})
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max={maxRooms}
                                    value={numRooms}
                                    onChange={(e) =>
                                        setNumRooms(Number(e.target.value))
                                    }
                                    className="w-full rounded-xl border border-[#9c7833] px-4 py-2 text-gray-800"
                                />
                            </div>

                            <div className="flex gap-4">
                                <button
                                    className={`flex-1 rounded-xl py-2 text-gray-800 ${isKidsRoom ? 'bg-[#902729] text-white' : 'bg-gray-200'}`}
                                    onClick={() => {
                                        setIsKidsRoom(true);
                                        setHasKidsSharing(false);
                                        setKidsAgesPerRoom(
                                            Array(numRooms)
                                                .fill(0)
                                                .map(() => []),
                                        );
                                    }}
                                >
                                    Kids Room
                                </button>
                                <button
                                    className={`flex-1 rounded-xl py-2 text-gray-800 ${!isKidsRoom ? 'bg-[#902729] text-white' : 'bg-gray-200'}`}
                                    onClick={() => {
                                        setIsKidsRoom(false);
                                        setKidsAgesPerRoom(
                                            Array(numRooms)
                                                .fill(0)
                                                .map(() => []),
                                        );
                                    }}
                                >
                                    Adult Room
                                </button>
                            </div>

                            {isKidsRoom ? (
                                <div>
                                    {numRooms > 1 && (
                                        <p className="mb-2 text-gray-600">
                                            If you have multiple rooms, please
                                            enter the ages for the kids in each
                                            room separately.
                                        </p>
                                    )}
                                    <label className="block text-base font-semibold text-gray-800">
                                        Kids Ages (Enter age for each child)
                                    </label>
                                    <div className="space-y-4">
                                        {Array.from({ length: numRooms }).map(
                                            (_, roomIndex) => (
                                                <div
                                                    key={roomIndex}
                                                    className="rounded-xl border border-[#9c7833]/20 bg-[#9c7833]/5 p-4"
                                                >
                                                    <h5 className="font-semibold text-[#902729]">
                                                        Room {roomIndex + 1}
                                                    </h5>
                                                    <div className="mt-2 space-y-2">
                                                        {kidsAgesPerRoom[
                                                            roomIndex
                                                        ]?.map(
                                                            (age, kidIndex) => (
                                                                <div
                                                                    key={
                                                                        kidIndex
                                                                    }
                                                                    className="flex gap-2"
                                                                >
                                                                    <input
                                                                        type="number"
                                                                        min="0"
                                                                        max="12"
                                                                        placeholder="Child age (years)"
                                                                        value={
                                                                            age
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) => {
                                                                            const newPerRoom =
                                                                                [
                                                                                    ...kidsAgesPerRoom,
                                                                                ];
                                                                            newPerRoom[
                                                                                roomIndex
                                                                            ] =
                                                                                [
                                                                                    ...newPerRoom[
                                                                                        roomIndex
                                                                                    ],
                                                                                ];
                                                                            newPerRoom[
                                                                                roomIndex
                                                                            ][
                                                                                kidIndex
                                                                            ] =
                                                                                Number(
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                );
                                                                            setKidsAgesPerRoom(
                                                                                newPerRoom,
                                                                            );
                                                                        }}
                                                                        className="w-full rounded-xl border border-[#9c7833] px-4 py-2 text-gray-800"
                                                                    />
                                                                    <button
                                                                        className="rounded-xl bg-[#902729] px-4 py-2 text-white"
                                                                        onClick={() => {
                                                                            const newPerRoom =
                                                                                [
                                                                                    ...kidsAgesPerRoom,
                                                                                ];
                                                                            newPerRoom[
                                                                                roomIndex
                                                                            ] =
                                                                                newPerRoom[
                                                                                    roomIndex
                                                                                ].filter(
                                                                                    (
                                                                                        _,
                                                                                        i,
                                                                                    ) =>
                                                                                        i !==
                                                                                        kidIndex,
                                                                                );
                                                                            setKidsAgesPerRoom(
                                                                                newPerRoom,
                                                                            );
                                                                        }}
                                                                    >
                                                                        Remove
                                                                    </button>
                                                                </div>
                                                            ),
                                                        )}
                                                        {kidsAgesPerRoom[
                                                            roomIndex
                                                        ]?.length < 6 && (
                                                            <button
                                                                className="mt-2 rounded-xl bg-[#902729] px-4 py-2 text-white"
                                                                onClick={() => {
                                                                    const newPerRoom =
                                                                        [
                                                                            ...kidsAgesPerRoom,
                                                                        ];
                                                                    newPerRoom[
                                                                        roomIndex
                                                                    ] = [
                                                                        ...newPerRoom[
                                                                            roomIndex
                                                                        ],
                                                                        0,
                                                                    ];
                                                                    setKidsAgesPerRoom(
                                                                        newPerRoom,
                                                                    );
                                                                }}
                                                            >
                                                                Add Kid
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={hasKidsSharing}
                                            onChange={(e) =>
                                                setHasKidsSharing(
                                                    e.target.checked,
                                                )
                                            }
                                        />
                                        <span className="text-base font-semibold text-gray-800">
                                            Kids Sharing with Adults
                                        </span>
                                    </label>
                                    {hasKidsSharing && (
                                        <div className="mt-4">
                                            {numRooms > 1 && (
                                                <p className="mb-2 text-gray-600">
                                                    If you have multiple rooms
                                                    and kids sharing, please
                                                    enter the ages for the kids
                                                    in each room separately.
                                                </p>
                                            )}
                                            <label className="block text-base font-semibold text-gray-800">
                                                Kids Ages (enter age for each
                                                child)
                                            </label>
                                            <div className="space-y-4">
                                                {Array.from({
                                                    length: numRooms,
                                                }).map((_, roomIndex) => (
                                                    <div
                                                        key={roomIndex}
                                                        className="rounded-xl border border-[#9c7833]/20 bg-[#9c7833]/5 p-4"
                                                    >
                                                        <h5 className="font-semibold text-[#902729]">
                                                            Room {roomIndex + 1}
                                                        </h5>
                                                        <div className="mt-2 space-y-2">
                                                            {kidsAgesPerRoom[
                                                                roomIndex
                                                            ]?.map(
                                                                (
                                                                    age,
                                                                    kidIndex,
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            kidIndex
                                                                        }
                                                                        className="flex gap-2"
                                                                    >
                                                                        <input
                                                                            type="number"
                                                                            min="0"
                                                                            placeholder="Child age (years)"
                                                                            value={
                                                                                age
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) => {
                                                                                const newPerRoom =
                                                                                    [
                                                                                        ...kidsAgesPerRoom,
                                                                                    ];
                                                                                newPerRoom[
                                                                                    roomIndex
                                                                                ] =
                                                                                    [
                                                                                        ...newPerRoom[
                                                                                            roomIndex
                                                                                        ],
                                                                                    ];
                                                                                newPerRoom[
                                                                                    roomIndex
                                                                                ][
                                                                                    kidIndex
                                                                                ] =
                                                                                    Number(
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                    );
                                                                                setKidsAgesPerRoom(
                                                                                    newPerRoom,
                                                                                );
                                                                            }}
                                                                            className="w-full rounded-xl border border-[#9c7833] px-4 py-2 text-gray-800"
                                                                        />
                                                                        <button
                                                                            className="rounded-xl bg-[#902729] px-4 py-2 text-white"
                                                                            onClick={() => {
                                                                                const newPerRoom =
                                                                                    [
                                                                                        ...kidsAgesPerRoom,
                                                                                    ];
                                                                                newPerRoom[
                                                                                    roomIndex
                                                                                ] =
                                                                                    newPerRoom[
                                                                                        roomIndex
                                                                                    ].filter(
                                                                                        (
                                                                                            _,
                                                                                            i,
                                                                                        ) =>
                                                                                            i !==
                                                                                            kidIndex,
                                                                                    );
                                                                                setKidsAgesPerRoom(
                                                                                    newPerRoom,
                                                                                );
                                                                            }}
                                                                        >
                                                                            Remove
                                                                        </button>
                                                                    </div>
                                                                ),
                                                            )}
                                                            <button
                                                                className="mt-2 rounded-xl bg-[#902729] px-4 py-2 text-white"
                                                                onClick={() => {
                                                                    const newPerRoom =
                                                                        [
                                                                            ...kidsAgesPerRoom,
                                                                        ];
                                                                    newPerRoom[
                                                                        roomIndex
                                                                    ] = [
                                                                        ...newPerRoom[
                                                                            roomIndex
                                                                        ],
                                                                        0,
                                                                    ];
                                                                    setKidsAgesPerRoom(
                                                                        newPerRoom,
                                                                    );
                                                                }}
                                                            >
                                                                Add Kid
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}

                    {isConference && (
                        <div>
                            <label className="block text-base font-semibold text-gray-800">
                                Number of Guests
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={numGuests}
                                onChange={(e) =>
                                    setNumGuests(Number(e.target.value))
                                }
                                className="w-full rounded-xl border border-[#9c7833] px-4 py-2 text-gray-800"
                            />
                        </div>
                    )}

                    {isLeisure && (
                        <>
                            <div>
                                <label className="block text-base font-semibold text-gray-800">
                                    Number of Adults
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={numAdults}
                                    onChange={(e) =>
                                        setNumAdults(Number(e.target.value))
                                    }
                                    className="w-full rounded-xl border border-[#9c7833] px-4 py-2 text-gray-800"
                                />
                            </div>
                            <div>
                                <label className="block text-base font-semibold text-gray-800">
                                    Number of Kids
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={numKids}
                                    onChange={(e) =>
                                        setNumKids(Number(e.target.value))
                                    }
                                    className="w-full rounded-xl border border-[#9c7833] px-4 py-2 text-gray-800"
                                />
                            </div>
                        </>
                    )}

                    <button
                        className="w-full rounded-xl bg-[#902729] py-3 text-white hover:bg-[#9c7833]"
                        onClick={handleConfirmBooking}
                    >
                        Book
                    </button>
                </div>
            </div>
        </>
    );
};
