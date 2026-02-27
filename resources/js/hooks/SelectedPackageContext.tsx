import { DayVisitPackageItem, Package, Program } from '@/types';
import React, { createContext, ReactNode, useContext, useState } from 'react';

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
