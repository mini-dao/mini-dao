import { relations } from "drizzle-orm";
import {
  integer,
  numeric,
  pgTable,
  text,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
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
    chainId: integer("chain_id").notNull(),
    address: text("address").notNull(),
    amount: numeric("amount").notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (walletHoldings) => [
    unique().on(
      walletHoldings.walletId,
      walletHoldings.chainId,
      walletHoldings.address
    ),
  ]
);

export const walletHoldingRelations = relations(walletHoldings, ({ one }) => ({
  wallet: one(wallets, {
    fields: [walletHoldings.walletId],
    references: [wallets.id],
  }),
}));
