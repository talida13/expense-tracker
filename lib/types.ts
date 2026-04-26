export interface Receipt {
  id: string;
  storeName: string;
  date: string;
  total: number;
  category: string;
  items?: ReceiptItem[];
}

export interface ReceiptItem {
  name: string;
  price: number;
  quantity: number;
}

export type Screen = 
  | 'onboarding' 
  | 'dashboard' 
  | 'scan' 
  | 'upload'
  | 'processing' 
  | 'receipt-details' 
  | 'all-receipts' 
  | 'settings';

export const CATEGORIES = [
  'Groceries',
  'Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Healthcare',
  'Utilities',
  'Other'
] as const;

export type Category = typeof CATEGORIES[number];
