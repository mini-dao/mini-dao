import { pgTable, text } from "drizzle-orm/pg-core";
import { id } from "../columns/id";

export const wallets = pgTable("wallets", {
  id: id(),
  address: text("address").notNull().unique(),
  publicKey: text("public_key").notNull(),
  privateKey: text("private_key").notNull(),
});
