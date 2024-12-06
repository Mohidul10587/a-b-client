"use client";
// SettingsContext.tsx
import React, { createContext, useContext } from "react";

// Define the shape of your settings data
interface SettingsData {
  // Define your settings data structure here
  [key: string]: any;
}

// Create a context with an appropriate type
const SettingsContext = createContext<SettingsData | null>(null);

// Create a provider component
export const SettingsProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: SettingsData;
}) => {
  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

// Create a custom hook to use the settings context
export const useSettings = () => useContext(SettingsContext);
