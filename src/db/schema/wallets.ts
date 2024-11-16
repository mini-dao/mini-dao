import { relations } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";
import { createdAt } from "../columns/createdAt";
import { id } from "../columns/id";
import { walletHoldings } from "./walletHoldings";

export const wallets = pgTable("wallets", {
  id: id(),
  address: text("address").notNull().unique(),
  privateKey: text("private_key").notNull(),
  createdAt: createdAt(),
});

export const walletRelations = relations(wallets, ({ many }) => ({
  holdings: many(walletHoldings),
}));
