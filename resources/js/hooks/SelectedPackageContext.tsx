import { Package } from '@/types';
import React, { createContext, ReactNode, useContext, useState } from 'react';

interface SelectedPackageContextType {
    showSelectedPackageModal: boolean;
    setShowSelectedPackageModal: (show: boolean) => void;
    setSelectedPackage: (currentPackage: Package) => void;
    selectedPackage: Package | null;
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

    return (
        <SelectedPackageContext.Provider
            value={{
                showSelectedPackageModal,
                setShowSelectedPackageModal,
                setSelectedPackage,
                selectedPackage,
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
