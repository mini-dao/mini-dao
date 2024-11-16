import { timestamp } from "drizzle-orm/pg-core";

export const updatedAt = () =>
  timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date());
