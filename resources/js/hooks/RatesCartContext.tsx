import React, { createContext, ReactNode, useContext, useState } from 'react';

type BoardType = 'FB' | 'HB' | 'BB';

interface Room {
    id: string;
    name: string;
    description: string;
    number_of_rooms: number;
    rates: {
        single: {
            bnb: { kshs: number; usd: number };
            half_board: { kshs: number; usd: number };
            full_board: { kshs: number; usd: number };
        };
        double: {
            bnb: { kshs: number; usd: number };
            half_board: { kshs: number; usd: number };
            full_board: { kshs: number; usd: number };
        };
    };
    created_at: string;
    updated_at: string;
}

interface ConferencePackage {
    id: string;
    name: string;
    description: string;
    rate_kshs: number;
    rate_usd: number;
    created_at: string;
    updated_at: string;
}

interface RoomCartItem {
    kind: 'room';
    room: Room;
    occupancy: 'Single' | 'Double';
    isKidsRoom: boolean;
    hasKidsSharing: boolean;
    numRooms: number;
    kidsCount: number;
    kidsAges: number[];
    kidsAgesPerRoom: number[][];
    perRoomCosts: number[];
    totalCost: number;
    currency: 'KES' | 'USD';
    checkIn: string;
    checkOut: string;
    nights: number;
    boardType: BoardType;
    holidayMessage?: string;
    roomRatePerNight: number;
}

interface ConferenceCartItem {
    kind: 'conference';
    conference: ConferencePackage;
    numGuests: number;
    totalCost: number;
    currency: 'KES' | 'USD';
    checkIn: string;
    checkOut: string;
    nights: number;
    holidayMessage?: string;
}
interface LeisureExperience {
    id: number;
    title: string;
    description: string | null;
    image_url: string | null;
    price_adults: number | null;
    price_kids: number | null;
}
interface LeisureCartItem {
    kind: 'leisure';
    leisure: LeisureExperience;
    numAdults: number;
    numKids: number;
    totalCost: number;
    currency: 'KES' | 'USD';
    checkIn: string;
    checkOut: string;
    nights: number;
}
interface LeisureRoomCartItem {
    kind: 'leisure-room';
    room: Room;
    occupancy: 'Single' | 'Double';
    isKidsRoom: boolean;
    hasKidsSharing: boolean;
    numRooms: number;
    kidsCount: number;
    kidsAges: number[];
    kidsAgesPerRoom: number[][];
    perRoomCosts: number[];
    totalCost: number;
    currency: 'KES' | 'USD';
    checkIn: string;
    checkOut: string;
    nights: number;
    boardType: BoardType;
    holidayMessage?: string;
    roomRatePerNight: number;
}
type CartItem =
    | RoomCartItem
    | ConferenceCartItem
    | LeisureCartItem
    | LeisureRoomCartItem;

interface BookingContextType {
    showBookingModal: boolean;
    setShowBookingModal: (show: boolean) => void;
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (index: number) => void;
    clearCart: () => void;
    showCart: boolean;
    setShowCart: (show: boolean) => void;
    boardType: BoardType;
    setBoardType: (board: BoardType) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingCartProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [showCart, setShowCart] = useState(false);
    const [boardType, setBoardType] = useState<BoardType>('FB');

    const addToCart = (item: CartItem) => {
        setCart([...cart, item]);
    };

    const removeFromCart = (index: number) => {
        setCart(cart.filter((_, i) => i !== index));
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <BookingContext.Provider
            value={{
                showBookingModal,
                setShowBookingModal,
                cart,
                addToCart,
                removeFromCart,
                clearCart,
                showCart,
                setShowCart,
                boardType,
                setBoardType,
            }}
        >
            {children}
        </BookingContext.Provider>
    );
};

export const useRatesBooking = () => {
    const context = useContext(BookingContext);
    if (context === undefined) {
        throw new Error(
            'useRatesBooking must be used within a BookingProvider',
        );
    }
    return context;
};
