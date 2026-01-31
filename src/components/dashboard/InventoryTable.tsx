import { GroceryItem, ExpiryStatus, CATEGORIES } from '@/types/grocery';
import { getExpiryStatus, getExpiryLabel, getDaysUntilExpiry } from '@/lib/expiry-utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { Search, MoreHorizontal, Edit, Trash2, MapPin, Package, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface InventoryTableProps {
  items: GroceryItem[];
  onEdit?: (item: GroceryItem) => void;
  onDelete?: (id: string) => void;
  statusFilter?: ExpiryStatus | 'all';
}

function ExpiryBadge({ status, label }: { status: ExpiryStatus; label: string }) {
  const variants: Record<ExpiryStatus, 'expired' | 'expiringSoon' | 'fresh'> = {
    'expired': 'expired',
    'expiring-today': 'expired',
    'expiring-soon': 'expiringSoon',
    'fresh': 'fresh',
  };

  return (
    <Badge variant={variants[status]} className="whitespace-nowrap">
      {label}
    </Badge>
  );
}

function ExpiryProgressBar({ daysLeft }: { daysLeft: number }) {
  let percentage: number;
  let colorClass: string;

  if (daysLeft < 0) {
    percentage = 100;
    colorClass = 'bg-expired';
  } else if (daysLeft === 0) {
    percentage = 95;
    colorClass = 'bg-expired';
  } else if (daysLeft <= 3) {
    percentage = 80;
    colorClass = 'bg-expiring-soon';
  } else if (daysLeft <= 7) {
    percentage = 60;
    colorClass = 'bg-expiring-soon/70';
  } else if (daysLeft <= 14) {
    percentage = 40;
    colorClass = 'bg-fresh/70';
  } else {
    percentage = 20;
    colorClass = 'bg-fresh';
  }

  return (
    <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
      <div
        className={cn('h-full rounded-full transition-all', colorClass)}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

export function InventoryTable({ items, onEdit, onDelete, statusFilter = 'all' }: InventoryTableProps) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredItems = items
    .filter((item) => {
      // Status filter
      if (statusFilter !== 'all' && getExpiryStatus(item.expirationDate) !== statusFilter) {
        return false;
      }

      // Category filter
      if (categoryFilter !== 'all' && item.category !== categoryFilter) {
        return false;
      }

      // Search filter
      if (search) {
        const query = search.toLowerCase();
        return (
          item.name.toLowerCase().includes(query) ||
          item.batchNumber.toLowerCase().includes(query) ||
          item.shelfLocation.toLowerCase().includes(query)
        );
      }

      return true;
    })
    .sort((a, b) => {
      const comparison = new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime();
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search items, batch numbers, shelves..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="w-full sm:w-auto"
        >
          <ArrowUpDown className="w-4 h-4 mr-2" />
          {sortOrder === 'asc' ? 'Expiring Soon' : 'Expiring Later'}
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-xl overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Item</TableHead>
              <TableHead className="font-semibold hidden md:table-cell">Category</TableHead>
              <TableHead className="font-semibold hidden lg:table-cell">Batch #</TableHead>
              <TableHead className="font-semibold hidden sm:table-cell">Qty</TableHead>
              <TableHead className="font-semibold hidden lg:table-cell">Location</TableHead>
              <TableHead className="font-semibold">Expiry</TableHead>
              <TableHead className="font-semibold text-center">Status</TableHead>
              <TableHead className="font-semibold w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                  <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No items found</p>
                  <p className="text-sm">Try adjusting your search or filters</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => {
                const status = getExpiryStatus(item.expirationDate);
                const daysLeft = getDaysUntilExpiry(item.expirationDate);
                const expiryLabel = getExpiryLabel(item.expirationDate);

                return (
                  <TableRow
                    key={item.id}
                    className={cn(
                      'transition-colors',
                      status === 'expired' && 'table-row-expired',
                      (status === 'expiring-today' || status === 'expiring-soon') && 'table-row-warning'
                    )}
                  >
                    <TableCell>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground md:hidden">
                        {item.category}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {item.category}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell font-mono text-sm text-muted-foreground">
                      {item.batchNumber}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className="font-medium">{item.quantity}</span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span className="text-sm">{item.shelfLocation}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">
                          {format(new Date(item.expirationDate), 'MMM d, yyyy')}
                        </div>
                        <ExpiryProgressBar daysLeft={daysLeft} />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <ExpiryBadge status={status} label={expiryLabel} />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit?.(item)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Item
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDelete?.(item.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Item
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredItems.length} of {items.length} items
      </div>
    </div>
  );
}
