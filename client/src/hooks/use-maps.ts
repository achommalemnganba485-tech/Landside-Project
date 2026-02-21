import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertLocation } from "@shared/routes";

// GET /api/map
export function useLocations() {
  return useQuery({
    queryKey: [api.map.list.path],
    queryFn: async () => {
      const res = await fetch(api.map.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch locations");
      return api.map.list.responses[200].parse(await res.json());
    },
  });
}

// POST /api/map/location
export function useCreateLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertLocation) => {
      const validated = api.map.create.input.parse(data);
      const res = await fetch(api.map.create.path, {
        method: api.map.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.map.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error('Failed to create location');
      }
      return api.map.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.map.list.path] });
    },
  });
}
