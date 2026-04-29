"use client";

import React, { createContext, useContext } from 'react';
import { useSettings } from './useSettings';

const SettingsContext = createContext<ReturnType<typeof useSettings> | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const settings = useSettings();
  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useAppSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useAppSettings must be used within SettingsProvider');
  }
  return context;
}