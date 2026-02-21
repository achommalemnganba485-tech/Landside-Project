import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertAlert } from "@shared/routes";

// GET /api/alerts
export function useAlerts() {
  return useQuery({
    queryKey: [api.alerts.list.path],
    queryFn: async () => {
      const res = await fetch(api.alerts.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch alerts");
      return api.alerts.list.responses[200].parse(await res.json());
    },
  });
}

// POST /api/alerts
export function useCreateAlert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertAlert) => {
      const validated = api.alerts.create.input.parse(data);
      const res = await fetch(api.alerts.create.path, {
        method: api.alerts.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.alerts.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error('Failed to create alert');
      }
      return api.alerts.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.alerts.list.path] });
    },
  });
}
