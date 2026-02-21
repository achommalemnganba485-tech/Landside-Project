import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SensorCardProps {
  title: string;
  value: number;
  unit: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "stable";
  color?: string;
  delay?: number;
}

export function SensorCard({ 
  title, 
  value, 
  unit, 
  icon: Icon, 
  trend = "stable",
  color = "text-primary",
  delay = 0
}: SensorCardProps) {
  return (
    <div 
      className="group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <Card className="glass-panel border-white/5 bg-gradient-to-br from-card to-card/50 hover:from-card/80 hover:to-card transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5 overflow-hidden relative">
        <div className={cn("absolute top-0 right-0 p-24 opacity-[0.03] transition-transform duration-700 group-hover:scale-110", color)}>
          <Icon className="w-full h-full" />
        </div>
        
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {title}
          </CardTitle>
          <div className={cn("p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors", color)}>
            <Icon className="h-4 w-4" />
          </div>
        </CardHeader>
        
        <CardContent className="relative z-10">
          <div className="text-3xl font-bold font-mono tracking-tight flex items-baseline gap-1">
            {value.toFixed(2)}
            <span className="text-sm font-normal text-muted-foreground ml-1 font-sans">{unit}</span>
          </div>
          <div className="h-1 w-full bg-secondary mt-4 rounded-full overflow-hidden">
            <div 
              className={cn("h-full transition-all duration-1000 ease-out rounded-full opacity-50 group-hover:opacity-100", color.replace("text-", "bg-"))}
              style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }} 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
