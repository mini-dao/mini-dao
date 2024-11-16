import { relations } from "drizzle-orm";
import { numeric, pgTable, text, unique, uuid } from "drizzle-orm/pg-core";
import { createdAt } from "../columns/createdAt";
import { id } from "../columns/id";
import { updatedAt } from "../columns/updatedAt";
import { wallets } from "./wallets";

export const walletHoldings = pgTable(
  "wallet_holdings",
  {
    id: id(),
    walletId: uuid("wallet_id")
      .notNull()
      .references(() => wallets.id),
    address: text("address").notNull(),
    amount: numeric("amount").notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (groupUsers) => [unique().on(groupUsers.walletId, groupUsers.address)]
);

export const walletHoldingRelations = relations(walletHoldings, ({ one }) => ({
  wallet: one(wallets, {
    fields: [walletHoldings.walletId],
    references: [wallets.id],
  }),
}));
