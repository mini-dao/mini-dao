import { timestamp } from "drizzle-orm/pg-core";

export const deletedAt = () => timestamp("deleted_at");
