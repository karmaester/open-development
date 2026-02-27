import { z } from 'zod';
import { DataSourceType } from '../enums/data-source.enum.js';

export const DataSourceSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  type: z.nativeEnum(DataSourceType),
  baseUrl: z.string().url(),
  apiVersion: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  lastSyncAt: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
});
export type DataSource = z.infer<typeof DataSourceSchema>;

export const CreateDataSourceSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.nativeEnum(DataSourceType),
  baseUrl: z.string().url(),
  apiVersion: z.string().optional(),
  description: z.string().optional(),
});
export type CreateDataSource = z.infer<typeof CreateDataSourceSchema>;
