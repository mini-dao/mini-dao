import { sql, type AnyColumn } from "drizzle-orm";

export const increment = (column: AnyColumn, value: string) =>
  sql`${column} + ${value}`;
