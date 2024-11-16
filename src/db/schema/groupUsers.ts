import { relations } from "drizzle-orm";
import { pgTable, text, unique, uuid } from "drizzle-orm/pg-core";
import { createdAt } from "../columns/createdAt";
import { id } from "../columns/id";
import { groups } from "./groups";
import { wallets } from "./wallets";

export const groupUsers = pgTable(
  "group_users",
  {
    id: id(),
    groupId: uuid("group_id")
      .notNull()
      .references(() => groups.id),
    telegramId: text("telegram_id").notNull(),
    walletId: uuid("wallet_id")
      .notNull()
      .references(() => wallets.id),
    createdAt: createdAt(),
  },
  (groupUsers) => [unique().on(groupUsers.groupId, groupUsers.telegramId)]
);

export const groupUserRelations = relations(groupUsers, ({ one, many }) => ({
  group: one(groups, {
    fields: [groupUsers.groupId],
    references: [groups.id],
  }),
  wallet: one(wallets, {
    fields: [groupUsers.walletId],
    references: [wallets.id],
  }),
}));
