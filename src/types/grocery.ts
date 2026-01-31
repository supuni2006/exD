export interface GroceryItem {
  id: string;
  name: string;
  category: string;
  batchNumber: string;
  quantity: number;
  shelfLocation: string;
  expirationDate: Date;
  addedAt: Date;
  lastUpdated: Date;
}

export interface DashboardStats {
  totalItems: number;
  expiringToday: number;
  expiringThisWeek: number;
  expiredItems: number;
  freshItems: number;
}

export type ExpiryStatus = 'expired' | 'expiring-today' | 'expiring-soon' | 'fresh';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff';
  avatar?: string;
}

export const CATEGORIES = [
  'Dairy',
  'Meat & Poultry',
  'Seafood',
  'Fruits',
  'Vegetables',
  'Bakery',
  'Beverages',
  'Frozen Foods',
  'Canned Goods',
  'Snacks',
  'Condiments',
  'Deli',
  'Other',
] as const;

export const SHELF_LOCATIONS = [
  'A1', 'A2', 'A3', 'A4', 'A5',
  'B1', 'B2', 'B3', 'B4', 'B5',
  'C1', 'C2', 'C3', 'C4', 'C5',
  'D1', 'D2', 'D3', 'D4', 'D5',
  'Cold Storage 1', 'Cold Storage 2',
  'Freezer 1', 'Freezer 2',
  'Display Front', 'Display Center', 'Display Back',
] as const;
