import type { Receipt } from './types';

export const mockReceipts: Receipt[] = [
  {
    id: '1',
    storeName: 'Whole Foods Market',
    date: '2026-04-25',
    total: 87.43,
    category: 'Groceries',
    items: [
      { name: 'Organic Bananas', price: 2.49, quantity: 1 },
      { name: 'Almond Milk', price: 4.99, quantity: 2 },
      { name: 'Chicken Breast', price: 12.99, quantity: 1 },
    ],
  },
  {
    id: '2',
    storeName: 'Shell Gas Station',
    date: '2026-04-24',
    total: 52.30,
    category: 'Transportation',
  },
  {
    id: '3',
    storeName: 'Starbucks',
    date: '2026-04-23',
    total: 8.75,
    category: 'Dining',
  },
  {
    id: '4',
    storeName: 'Target',
    date: '2026-04-22',
    total: 124.99,
    category: 'Shopping',
  },
  {
    id: '5',
    storeName: 'CVS Pharmacy',
    date: '2026-04-21',
    total: 34.50,
    category: 'Healthcare',
  },
  {
    id: '6',
    storeName: 'Netflix',
    date: '2026-04-20',
    total: 15.99,
    category: 'Entertainment',
  },
  {
    id: '7',
    storeName: 'Trader Joe\'s',
    date: '2026-04-19',
    total: 67.82,
    category: 'Groceries',
  },
  {
    id: '8',
    storeName: 'Uber',
    date: '2026-04-18',
    total: 23.45,
    category: 'Transportation',
  },
];

export const monthlyData = [
  { month: 'Jan', amount: 1250 },
  { month: 'Feb', amount: 980 },
  { month: 'Mar', amount: 1420 },
  { month: 'Apr', amount: 890 },
];
