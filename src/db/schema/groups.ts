import { relations } from "drizzle-orm";
import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt } from "../columns/createdAt";
import { deletedAt } from "../columns/deletedAt";
import { id } from "../columns/id";
import { updatedAt } from "../columns/updatedAt";
import { groupUsers } from "./groupUsers";
import { wallets } from "./wallets";

export const groups = pgTable("groups", {
  id: id(),
  telegramId: text("telegram_id").notNull().unique(),
  walletId: uuid("wallet_id")
    .notNull()
    .references(() => wallets.id),
  chainId: integer("chain_id").notNull(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
  deletedAt: deletedAt(),
});

export const groupRelations = relations(groups, ({ one, many }) => ({
  wallet: one(wallets, {
    fields: [groups.walletId],
    references: [wallets.id],
  }),
  users: many(groupUsers),
}));
