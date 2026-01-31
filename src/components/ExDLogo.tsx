import { cn } from "@/lib/utils";

interface ExDLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
}

export function ExDLogo({ className, size = "md", showText = true }: ExDLogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
    xl: "w-20 h-20",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-4xl",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("relative", sizeClasses[size])}>
        {/* Logo Container */}
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Background Circle */}
          <circle
            cx="24"
            cy="24"
            r="22"
            className="fill-primary"
          />
          
          {/* Inner design - Abstract expiration/timer concept */}
          <path
            d="M24 8C15.16 8 8 15.16 8 24C8 32.84 15.16 40 24 40C32.84 40 40 32.84 40 24"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            className="stroke-primary-foreground"
          />
          
          {/* Clock hands suggesting time/expiration */}
          <path
            d="M24 14V24L30 28"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="stroke-primary-foreground"
          />
          
          {/* Alert dot */}
          <circle
            cx="38"
            cy="14"
            r="5"
            className="fill-expiring-soon"
          />
        </svg>
      </div>
      
      {showText && (
        <span className={cn("font-display font-bold tracking-tight text-foreground", textSizes[size])}>
          ex<span className="text-primary">D</span>
        </span>
      )}
    </div>
  );
}

export function ExDLogoMark({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(sizeClasses[size], className)}
    >
      <circle cx="24" cy="24" r="22" className="fill-primary" />
      <path
        d="M24 8C15.16 8 8 15.16 8 24C8 32.84 15.16 40 24 40C32.84 40 40 32.84 40 24"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className="stroke-primary-foreground"
      />
      <path
        d="M24 14V24L30 28"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-primary-foreground"
      />
      <circle cx="38" cy="14" r="5" className="fill-expiring-soon" />
    </svg>
  );
}
