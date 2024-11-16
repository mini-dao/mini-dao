import { type AnyColumn, sql } from "drizzle-orm";

export const decrement = (column: AnyColumn, value: string) =>
  sql`${column} - ${value}`;
