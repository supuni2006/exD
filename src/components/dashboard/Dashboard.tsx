import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatCards } from '@/components/dashboard/StatCards';
import { InventoryTable } from '@/components/dashboard/InventoryTable';
import { AddItemDialog } from '@/components/dashboard/AddItemDialog';
import { calculateDashboardStats } from '@/lib/expiry-utils';
import { GroceryItem, ExpiryStatus } from '@/types/grocery';
import { toast } from '@/hooks/use-toast';

export function Dashboard() {
  const { items, addItem, updateItem, deleteItem } = useApp();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GroceryItem | null>(null);
  const [statusFilter, setStatusFilter] = useState<ExpiryStatus | 'all'>('all');

  const stats = calculateDashboardStats(items);
  const alertCount = stats.expiredItems + stats.expiringToday;

  const handleAddItem = (itemData: Omit<GroceryItem, 'id' | 'addedAt' | 'lastUpdated'>) => {
    if (editingItem) {
      updateItem(editingItem.id, itemData);
      toast({
        title: 'Item Updated',
        description: `${itemData.name} has been updated successfully.`,
      });
    } else {
      addItem(itemData);
      toast({
        title: 'Item Added',
        description: `${itemData.name} has been added to inventory.`,
      });
    }
    setEditingItem(null);
  };

  const handleEdit = (item: GroceryItem) => {
    setEditingItem(item);
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const item = items.find((i) => i.id === id);
    deleteItem(id);
    toast({
      title: 'Item Deleted',
      description: `${item?.name || 'Item'} has been removed from inventory.`,
      variant: 'destructive',
    });
  };

  const handleFilterChange = (filter: string) => {
    setStatusFilter(filter as ExpiryStatus | 'all');
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader onAddItem={() => setIsAddDialogOpen(true)} alertCount={alertCount} />

      <main className="container px-4 md:px-6 py-6 space-y-6">
        {/* Welcome Section */}
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            Inventory Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track and manage product expiration dates across your store
          </p>
        </div>

        {/* Stats Cards */}
        <StatCards stats={stats} onFilterChange={handleFilterChange} activeFilter={statusFilter} />

        {/* Inventory Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg md:text-xl font-display font-semibold text-foreground">
              {statusFilter === 'all' ? 'All Items' : 
               statusFilter === 'expired' ? 'Expired Items' :
               statusFilter === 'expiring-today' ? 'Expiring Today' :
               statusFilter === 'expiring-soon' ? 'Expiring This Week' :
               'Fresh Items'}
            </h2>
          </div>
          <InventoryTable
            items={items}
            onEdit={handleEdit}
            onDelete={handleDelete}
            statusFilter={statusFilter}
          />
        </div>
      </main>

      <AddItemDialog
        open={isAddDialogOpen}
        onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) setEditingItem(null);
        }}
        onSubmit={handleAddItem}
        editItem={editingItem}
      />
    </div>
  );
}
