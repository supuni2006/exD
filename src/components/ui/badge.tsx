import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        expired: "border-transparent bg-expired text-expired-foreground animate-pulse",
        expiringSoon: "border-transparent bg-expiring-soon text-expiring-soon-foreground",
        fresh: "border-transparent bg-fresh text-fresh-foreground",
        warning: "border-transparent bg-expiring-soon/20 text-expiring-soon border-expiring-soon/30",
        success: "border-transparent bg-fresh/20 text-fresh border-fresh/30",
        danger: "border-transparent bg-expired/20 text-expired border-expired/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
