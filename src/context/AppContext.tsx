import { GroceryItem, User } from '@/types/grocery';
import { mockGroceryItems } from '@/data/mock-items';
import { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  items: GroceryItem[];
  addItem: (item: Omit<GroceryItem, 'id' | 'addedAt' | 'lastUpdated'>) => void;
  updateItem: (id: string, updates: Partial<GroceryItem>) => void;
  deleteItem: (id: string) => void;
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<GroceryItem[]>(mockGroceryItems);
  const [user, setUser] = useState<User | null>(null);

  const addItem = (itemData: Omit<GroceryItem, 'id' | 'addedAt' | 'lastUpdated'>) => {
    const newItem: GroceryItem = {
      ...itemData,
      id: `item_${Date.now()}`,
      addedAt: new Date(),
      lastUpdated: new Date(),
    };
    setItems((prev) => [newItem, ...prev]);
  };

  const updateItem = (id: string, updates: Partial<GroceryItem>) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...updates, lastUpdated: new Date() } : item
      )
    );
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const login = (email: string, password: string): boolean => {
    // Mock authentication - in production, this would call an API
    if (email && password.length >= 4) {
      setUser({
        id: 'user_1',
        email,
        name: email.split('@')[0],
        role: email.includes('admin') ? 'admin' : 'staff',
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AppContext.Provider
      value={{
        items,
        addItem,
        updateItem,
        deleteItem,
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
