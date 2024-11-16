import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt } from "../columns/createdAt";
import { deletedAt } from "../columns/deletedAt";
import { id } from "../columns/id";
import { updatedAt } from "../columns/updatedAt";
import { wallets } from "./wallets";

export const groups = pgTable("groups", {
  id: id(),
  telegramId: text("telegram_id").notNull().unique(),
  walletId: uuid("wallet_id")
    .notNull()
    .references(() => wallets.id),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
  deletedAt: deletedAt(),
});
