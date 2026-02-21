import { db } from "./db";
import {
  sensors,
  locations,
  alerts,
  type Sensor,
  type InsertSensor,
  type Location,
  type InsertLocation,
  type Alert,
  type InsertAlert
} from "@shared/schema";
import { desc } from "drizzle-orm";

export interface IStorage {
  // Sensors
  getLatestSensor(): Promise<Sensor | undefined>;
  getSensorHistory(limit?: number): Promise<Sensor[]>;
  createSensor(sensor: InsertSensor & { riskPercentage: number, riskLevel: string }): Promise<Sensor>;
  
  // Locations
  getLocations(): Promise<Location[]>;
  createLocation(location: InsertLocation): Promise<Location>;

  // Alerts
  getAlerts(): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
}

export class DatabaseStorage implements IStorage {
  async getLatestSensor(): Promise<Sensor | undefined> {
    const [sensor] = await db.select().from(sensors).orderBy(desc(sensors.timestamp)).limit(1);
    return sensor;
  }

  async getSensorHistory(limit: number = 50): Promise<Sensor[]> {
    return await db.select().from(sensors).orderBy(desc(sensors.timestamp)).limit(limit);
  }

  async createSensor(sensor: InsertSensor & { riskPercentage: number, riskLevel: string }): Promise<Sensor> {
    const [newSensor] = await db.insert(sensors).values(sensor).returning();
    return newSensor;
  }

  async getLocations(): Promise<Location[]> {
    return await db.select().from(locations);
  }

  async createLocation(location: InsertLocation): Promise<Location> {
    const [newLocation] = await db.insert(locations).values(location).returning();
    return newLocation;
  }

  async getAlerts(): Promise<Alert[]> {
    return await db.select().from(alerts).orderBy(desc(alerts.timestamp)).limit(100);
  }

  async createAlert(alert: InsertAlert): Promise<Alert> {
    const [newAlert] = await db.insert(alerts).values(alert).returning();
    return newAlert;
  }
}

export const storage = new DatabaseStorage();
