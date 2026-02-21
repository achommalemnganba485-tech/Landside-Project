import { cn } from "@/lib/utils";

interface RiskBadgeProps {
  level: string | null | undefined;
  percentage?: number | null;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function RiskBadge({ level, percentage, className, size = "md" }: RiskBadgeProps) {
  const normalizedLevel = level?.toUpperCase() || "UNKNOWN";
  
  const colors = {
    SAFE: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/5",
    MODERATE: "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-500/5",
    HIGH: "bg-red-500/10 text-red-400 border-red-500/20 shadow-red-500/10",
    UNKNOWN: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  };

  const glowColors = {
    SAFE: "shadow-[0_0_15px_rgba(16,185,129,0.3)]",
    MODERATE: "shadow-[0_0_15px_rgba(245,158,11,0.3)]",
    HIGH: "shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse",
    UNKNOWN: "",
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <div className={cn(
      "inline-flex items-center gap-2 rounded-full border font-bold uppercase tracking-wider shadow-lg backdrop-blur-sm transition-all duration-300",
      colors[normalizedLevel as keyof typeof colors],
      glowColors[normalizedLevel as keyof typeof glowColors],
      sizeClasses[size],
      className
    )}>
      <span className={cn(
        "w-2 h-2 rounded-full",
        normalizedLevel === "HIGH" ? "bg-current animate-ping" : "bg-current"
      )} />
      {normalizedLevel}
      {percentage !== undefined && percentage !== null && (
        <span className="opacity-75 ml-1 font-mono">
          {percentage}%
        </span>
      )}
    </div>
  );
}
