import { GroceryItem, ExpiryStatus, DashboardStats } from '@/types/grocery';
import { differenceInDays, isToday, isBefore, startOfDay, addDays } from 'date-fns';

export function getExpiryStatus(expirationDate: Date): ExpiryStatus {
  const today = startOfDay(new Date());
  const expDate = startOfDay(new Date(expirationDate));
  const daysUntilExpiry = differenceInDays(expDate, today);

  if (daysUntilExpiry < 0) return 'expired';
  if (daysUntilExpiry === 0) return 'expiring-today';
  if (daysUntilExpiry <= 7) return 'expiring-soon';
  return 'fresh';
}

export function getDaysUntilExpiry(expirationDate: Date): number {
  const today = startOfDay(new Date());
  const expDate = startOfDay(new Date(expirationDate));
  return differenceInDays(expDate, today);
}

export function getExpiryLabel(expirationDate: Date): string {
  const days = getDaysUntilExpiry(expirationDate);
  
  if (days < 0) return `Expired ${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} ago`;
  if (days === 0) return 'Expires today';
  if (days === 1) return 'Expires tomorrow';
  if (days <= 7) return `Expires in ${days} days`;
  return `${days} days left`;
}

export function calculateDashboardStats(items: GroceryItem[]): DashboardStats {
  const today = startOfDay(new Date());
  const weekFromNow = addDays(today, 7);

  let expiringToday = 0;
  let expiringThisWeek = 0;
  let expiredItems = 0;
  let freshItems = 0;

  items.forEach((item) => {
    const status = getExpiryStatus(item.expirationDate);
    
    switch (status) {
      case 'expired':
        expiredItems++;
        break;
      case 'expiring-today':
        expiringToday++;
        break;
      case 'expiring-soon':
        expiringThisWeek++;
        break;
      case 'fresh':
        freshItems++;
        break;
    }
  });

  return {
    totalItems: items.length,
    expiringToday,
    expiringThisWeek,
    expiredItems,
    freshItems,
  };
}

export function sortItemsByExpiry(items: GroceryItem[], ascending = true): GroceryItem[] {
  return [...items].sort((a, b) => {
    const comparison = new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime();
    return ascending ? comparison : -comparison;
  });
}

export function filterItemsByStatus(items: GroceryItem[], status: ExpiryStatus | 'all'): GroceryItem[] {
  if (status === 'all') return items;
  return items.filter((item) => getExpiryStatus(item.expirationDate) === status);
}

export function searchItems(items: GroceryItem[], query: string): GroceryItem[] {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return items;

  return items.filter((item) =>
    item.name.toLowerCase().includes(lowerQuery) ||
    item.category.toLowerCase().includes(lowerQuery) ||
    item.batchNumber.toLowerCase().includes(lowerQuery) ||
    item.shelfLocation.toLowerCase().includes(lowerQuery)
  );
}

export function generateId(): string {
  return `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
