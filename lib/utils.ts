import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string, rates: Record<string, number>): string {
  const rate = rates[currency] || 1;
  const converted = amount / rate; // since rates are RON to currency
  return `${converted.toFixed(2)} ${currency}`;
}
