import React, { createContext, ReactNode, useContext, useState } from 'react';

interface BookingContextType {
    showBookingModal: boolean;
    setShowBookingModal: (show: boolean) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [showBookingModal, setShowBookingModal] = useState(false);

    return (
        <BookingContext.Provider
            value={{ showBookingModal, setShowBookingModal }}
        >
            {children}
        </BookingContext.Provider>
    );
};

export const useBooking = () => {
    const context = useContext(BookingContext);
    if (context === undefined) {
        throw new Error('useBooking must be used within a BookingProvider');
    }
    return context;
};
