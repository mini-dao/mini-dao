import { pgTable, text } from "drizzle-orm/pg-core";
import { createdAt } from "../columns/createdAt";
import { id } from "../columns/id";

export const wallets = pgTable("wallets", {
  id: id(),
  address: text("address").notNull().unique(),
  privateKey: text("private_key").notNull(),
  createdAt: createdAt(),
});
