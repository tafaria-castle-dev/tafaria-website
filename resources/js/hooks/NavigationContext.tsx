import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react';

interface NavigationContextType {
    history: string[];
    addToHistory: (path: string) => void;
    goBack: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
    undefined,
);

interface NavigationProviderProps {
    children: ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({
    children,
}) => {
    const [history, setHistory] = useState<string[]>([]);

    const addToHistory = (path: string) => {
        setHistory((prev) => [...prev, path]);
    };

    const goBack = () => {
        setHistory((prev) => prev.slice(0, -1));
    };

    useEffect(() => {
        const handleRouteChange = () => {
            const currentPath = window.location.pathname;
            addToHistory(currentPath);
        };

        handleRouteChange();

        return () => {};
    }, []);

    return (
        <NavigationContext.Provider value={{ history, addToHistory, goBack }}>
            {children}
        </NavigationContext.Provider>
    );
};

export const useNavigation = (): NavigationContextType => {
    const context = useContext(NavigationContext);
    if (!context) {
        throw new Error(
            'useNavigation must be used within a NavigationProvider',
        );
    }
    return context;
};
