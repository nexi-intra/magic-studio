/**
 * Koksmat Model Utilities
 *
 * This module provides utilities for interacting with the Koksmat Model
 * database. The `useDatabaseSharedKoksmatModel` hook allows you to interact
 * with a specific record in the Koksmat Model table.
 *
 * @module KoksmatModel
 */

import { z, ZodObject } from "zod";
import useDatabaseRecord from "@/components/hooks/use-database-record";
import { useSQLSelect3 } from "@/app/koksmat/usesqlselect3";
/**
 * Schema for validating and describing a Koksmat Model record.
 * The `CreateKoksmatModel` schema defines the structure of the model.
 */
export const schema = z
  .object({
    id: z.string(), // Unique identifier for the model
    name: z.string().optional(), // Optional name for the model
    description: z.string().optional(), // Optional description for the model
    data: z.record(z.any()).optional(), // Optional data payload associated with the model
  })
  .describe("Koksmat Model Schema");

/**
 * Name of the database table where Koksmat Models are stored.
 */
export const tableName = "koksmat_model";

/**
 * TypeScript type inferred from the Koksmat Model schema.
 * This type can be used to ensure type safety when working with Koksmat Model records.
 */
export type Model = z.infer<typeof schema>;

/**
 * Hook to interact with a shared Koksmat Model record in the database.
 *
 * @param key - The key of the record to fetch.
 * @param database - The name of the database where the record is stored.
 * @returns An object containing the Koksmat Model record and related methods.
 */
export function useSharedKoksmatModelTableItem(key: string, database: string) {
  return useDatabaseRecord(schema, key, database, tableName);
}

export function useSharedKoksmatModelTable(database: string) {
  const table = useSQLSelect3<z.infer<typeof schema>>(
    database,
    `select * from ${tableName} where deleted_at is null  order by name`
  );

  return { ...table };
}
