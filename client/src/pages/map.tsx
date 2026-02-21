import { useEffect, useState } from "react";
import { useLocations } from "@/hooks/use-sensors"; // This assumes useLocations is exported from use-sensors or use-maps
import { useLocations as useLocationsHook } from "@/hooks/use-maps";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { RiskBadge } from "@/components/risk-badge";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { MapPin, Navigation } from "lucide-react";

// Fix Leaflet marker icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom markers based on risk
const createRiskIcon = (level: string) => {
  const colors = {
    SAFE: "#10b981",
    MODERATE: "#f59e0b",
    HIGH: "#ef4444",
  };
  
  const color = colors[level as keyof typeof colors] || "#64748b";
  
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      background-color: ${color};
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 0 15px ${color};
      animation: ${level === 'HIGH' ? 'pulse 2s infinite' : 'none'};
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

function MapUpdater({ locations }: { locations: any[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (locations && locations.length > 0) {
      const bounds = L.latLngBounds(locations.map(l => [l.latitude, l.longitude]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [locations, map]);
  
  return null;
}

export default function MapPage() {
  const { data: locations, isLoading } = useLocationsHook();

  // Default center (can be approximate, will auto-fit)
  const defaultCenter = [20.5937, 78.9629]; // India center

  return (
    <div className="h-[calc(100vh-8rem)] w-full flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Geo-Location Risk Map</h1>
          <p className="text-muted-foreground mt-1">Live tracking of sensor nodes across regions</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 text-sm bg-card/50 px-3 py-1.5 rounded-lg border border-white/5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span> Safe
          </div>
          <div className="flex items-center gap-2 text-sm bg-card/50 px-3 py-1.5 rounded-lg border border-white/5">
            <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></span> Moderate
          </div>
          <div className="flex items-center gap-2 text-sm bg-card/50 px-3 py-1.5 rounded-lg border border-white/5">
            <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span> High Risk
          </div>
        </div>
      </div>

      <Card className="flex-1 overflow-hidden border-white/10 shadow-2xl relative bg-slate-900">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-50">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
              <p className="text-muted-foreground animate-pulse">Loading map data...</p>
            </div>
          </div>
        ) : null}
        
        <MapContainer 
          center={defaultCenter as [number, number]} 
          zoom={5} 
          style={{ height: "100%", width: "100%", zIndex: 0 }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          
          {locations?.map((loc) => (
            <Marker 
              key={loc.id} 
              position={[loc.latitude, loc.longitude]}
              icon={createRiskIcon(loc.riskLevel)}
            >
              <Popup className="bg-transparent border-none shadow-none">
                <div className="p-1">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="font-bold text-base">{loc.name}</span>
                  </div>
                  <div className="space-y-2">
                    <RiskBadge level={loc.riskLevel} percentage={loc.riskPercentage} size="sm" />
                    <div className="text-xs text-muted-foreground pt-1 border-t border-border/50">
                      Updated: {format(new Date(loc.lastUpdated), "MMM d, HH:mm")}
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
          
          <MapUpdater locations={locations || []} />
        </MapContainer>
        
        <div className="absolute bottom-6 right-6 z-[400] bg-card/80 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-2xl max-w-xs">
          <h3 className="font-bold mb-2 flex items-center gap-2">
            <Navigation className="w-4 h-4 text-primary" />
            Legend
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Markers indicate real-time sensor locations. Click on any marker to view detailed sensor telemetry and risk assessment scores.
          </p>
        </div>
      </Card>
    </div>
  );
}
