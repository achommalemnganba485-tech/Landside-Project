import { z } from 'zod';
import { insertSensorSchema, insertLocationSchema, insertAlertSchema, sensors, locations, alerts } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  sensors: {
    latest: {
      method: 'GET' as const,
      path: '/api/sensor/latest' as const,
      responses: {
        200: z.custom<typeof sensors.$inferSelect>().nullable(),
      },
    },
    history: {
      method: 'GET' as const,
      path: '/api/sensor/history' as const,
      responses: {
        200: z.array(z.custom<typeof sensors.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/sensor' as const,
      input: insertSensorSchema,
      responses: {
        201: z.custom<typeof sensors.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  map: {
    list: {
      method: 'GET' as const,
      path: '/api/map' as const,
      responses: {
        200: z.array(z.custom<typeof locations.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/map/location' as const,
      input: insertLocationSchema,
      responses: {
        201: z.custom<typeof locations.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  alerts: {
    list: {
      method: 'GET' as const,
      path: '/api/alerts' as const,
      responses: {
        200: z.array(z.custom<typeof alerts.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/alerts' as const,
      input: insertAlertSchema,
      responses: {
        201: z.custom<typeof alerts.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export const ws = {
  receive: {
    newAlert: z.object({
      id: z.number(),
      locationName: z.string(),
      message: z.string(),
      riskLevel: z.string(),
      timestamp: z.string()
    })
  }
};
