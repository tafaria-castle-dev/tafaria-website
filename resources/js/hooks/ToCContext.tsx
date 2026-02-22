"use client";
import { createContext, useContext, useState } from "react";

interface ToCContextType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const ToCContext = createContext<ToCContextType | undefined>(undefined);

export const ToCProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <ToCContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </ToCContext.Provider>
  );
};

export const useToC = () => {
  const context = useContext(ToCContext);
  if (!context) {
    throw new Error("useToC must be used within a ToCProvider");
  }
  return context;
};
