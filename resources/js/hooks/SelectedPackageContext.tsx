import { DayVisitPackageItem, Package, Program } from '@/types';
import React, { createContext, ReactNode, useContext, useState } from 'react';

export interface EventItem {
    id: number | string;
    image?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    badge_content?: string;
    button_message?: string;
}

interface SelectedPackageContextType {
    showSelectedPackageModal: boolean;
    setShowSelectedPackageModal: (show: boolean) => void;
    setSelectedPackage: (currentPackage: Package) => void;
    selectedPackage: Package | null;
    selectedDayVisitPackageItem: DayVisitPackageItem | null;
    setSelectedDayVisitPackageItem: (item: DayVisitPackageItem | null) => void;
    showDayVisitModal: boolean;
    setShowDayVisitModal: (v: boolean) => void;
    showSchoolQuoteModal: boolean;
    setShowSchoolQuoteModal: (v: boolean) => void;
    quoteInitialProgram: Program | null;
    setQuoteInitialProgram: (p: Program | null) => void;
    showEventBookingModal: boolean;
    setShowEventBookingModal: (v: boolean) => void;
    selectedEventItem: EventItem | null;
    setSelectedEventItem: (item: EventItem | null) => void;
}

const SelectedPackageContext = createContext<
    SelectedPackageContextType | undefined
>(undefined);

export const SelectedPackageProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [showSelectedPackageModal, setShowSelectedPackageModal] =
        useState(false);
    const [selectedPackage, setSelectedPackage] = useState<Package | null>(
        null,
    );
    const [showDayVisitModal, setShowDayVisitModal] = useState(false);
    const [selectedDayVisitPackageItem, setSelectedDayVisitPackageItem] =
        useState<DayVisitPackageItem | null>(null);
    const [showSchoolQuoteModal, setShowSchoolQuoteModal] = useState(false);
    const [quoteInitialProgram, setQuoteInitialProgram] =
        useState<Program | null>(null);
    const [showEventBookingModal, setShowEventBookingModal] = useState(false);
    const [selectedEventItem, setSelectedEventItem] =
        useState<EventItem | null>(null);

    return (
        <SelectedPackageContext.Provider
            value={{
                showSelectedPackageModal,
                setShowSelectedPackageModal,
                setSelectedPackage,
                selectedPackage,
                showDayVisitModal,
                setShowDayVisitModal,
                selectedDayVisitPackageItem,
                setSelectedDayVisitPackageItem,
                showSchoolQuoteModal,
                setShowSchoolQuoteModal,
                quoteInitialProgram,
                setQuoteInitialProgram,
                showEventBookingModal,
                setShowEventBookingModal,
                selectedEventItem,
                setSelectedEventItem,
            }}
        >
            {children}
        </SelectedPackageContext.Provider>
    );
};

export const useSelectedPackage = () => {
    const context = useContext(SelectedPackageContext);
    if (context === undefined) {
        throw new Error(
            'useSelectedPackage must be used within a SelectedPackageProvider',
        );
    }
    return context;
};
