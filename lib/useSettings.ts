import { useState, useEffect } from 'react';

export interface Settings {
  currency: string;
  exchangeRate: number; // rate from RON to selected currency
}

const defaultSettings: Settings = {
  currency: 'RON',
  exchangeRate: 1,
};

async function fetchExchangeRates(): Promise<Record<string, number>> {
  try {
    const response = await fetch('/api/exchange-rates');
    const rates = await response.json();
    return rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return { RON: 1 };
  }
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [rates, setRates] = useState<Record<string, number>>({ RON: 1 });

  useEffect(() => {
    fetchExchangeRates().then(setRates);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('expense-tracker-settings');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (e) {
        console.error('Error parsing settings', e);
      }
    }
  }, []);

  const updateSettings = (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('expense-tracker-settings', JSON.stringify(updated));
  };

  return { settings, updateSettings, rates };
}