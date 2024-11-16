import { timestamp } from "drizzle-orm/pg-core";

export const createdAt = () => timestamp("created_at").notNull().defaultNow();
