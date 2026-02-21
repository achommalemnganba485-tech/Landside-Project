import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertSensor } from "@shared/routes";

// GET /api/sensor/latest
export function useLatestSensor() {
  return useQuery({
    queryKey: [api.sensors.latest.path],
    queryFn: async () => {
      const res = await fetch(api.sensors.latest.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch latest sensor data");
      const data = await res.json();
      return api.sensors.latest.responses[200].parse(data);
    },
    refetchInterval: 5000, // Poll every 5s for near-realtime updates
  });
}

// GET /api/sensor/history
export function useSensorHistory() {
  return useQuery({
    queryKey: [api.sensors.history.path],
    queryFn: async () => {
      const res = await fetch(api.sensors.history.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch sensor history");
      return api.sensors.history.responses[200].parse(await res.json());
    },
  });
}

// POST /api/sensor
export function useCreateSensor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertSensor) => {
      const validated = api.sensors.create.input.parse(data);
      const res = await fetch(api.sensors.create.path, {
        method: api.sensors.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.sensors.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error('Failed to create sensor reading');
      }
      return api.sensors.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.sensors.latest.path] });
      queryClient.invalidateQueries({ queryKey: [api.sensors.history.path] });
    },
  });
}
