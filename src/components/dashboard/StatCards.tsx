import { DashboardStats } from '@/types/grocery';
import { Card, CardContent } from '@/components/ui/card';
import { Package, AlertTriangle, Clock, XCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardsProps {
  stats: DashboardStats;
  onFilterChange?: (filter: string) => void;
  activeFilter?: string;
}

export function StatCards({ stats, onFilterChange, activeFilter = 'all' }: StatCardsProps) {
  const cards = [
    {
      id: 'all',
      label: 'Total Inventory',
      value: stats.totalItems,
      icon: Package,
      className: 'stat-card-neutral',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      id: 'expired',
      label: 'Expired Items',
      value: stats.expiredItems,
      icon: XCircle,
      className: 'stat-card-expired',
      iconBg: 'bg-expired/10',
      iconColor: 'text-expired',
      urgent: stats.expiredItems > 0,
    },
    {
      id: 'expiring-today',
      label: 'Expiring Today',
      value: stats.expiringToday,
      icon: AlertTriangle,
      className: 'stat-card-warning',
      iconBg: 'bg-expiring-soon/10',
      iconColor: 'text-expiring-soon',
      urgent: stats.expiringToday > 0,
    },
    {
      id: 'expiring-soon',
      label: 'Expiring This Week',
      value: stats.expiringThisWeek,
      icon: Clock,
      className: 'stat-card-warning',
      iconBg: 'bg-expiring-soon/10',
      iconColor: 'text-expiring-soon',
    },
    {
      id: 'fresh',
      label: 'Fresh Items',
      value: stats.freshItems,
      icon: CheckCircle,
      className: 'stat-card-success',
      iconBg: 'bg-fresh/10',
      iconColor: 'text-fresh',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card, index) => (
        <Card
          key={card.id}
          className={cn(
            'stat-card cursor-pointer',
            card.className,
            activeFilter === card.id && 'ring-2 ring-primary',
            card.urgent && 'animate-pulse-soft'
          )}
          style={{ animationDelay: `${index * 100}ms` }}
          onClick={() => onFilterChange?.(card.id)}
        >
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-3">
              <div className={cn('p-2 rounded-lg', card.iconBg)}>
                <card.icon className={cn('w-5 h-5', card.iconColor)} />
              </div>
              {card.urgent && (
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-expired opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-expired"></span>
                </span>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-2xl md:text-3xl font-display font-bold text-foreground">
                {card.value}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground font-medium">
                {card.label}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
