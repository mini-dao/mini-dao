import { pgTable, text } from "drizzle-orm/pg-core";
import { createdAt } from "../columns/createdAt";
import { id } from "../columns/id";

export const users = pgTable("users", {
  id: id(),
  telegramId: text("telegram_id").notNull().unique(),
  createdAt: createdAt(),
});
