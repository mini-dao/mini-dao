import { pgTable, unique, uuid } from "drizzle-orm/pg-core";
import { createdAt } from "../columns/createdAt";
import { id } from "../columns/id";
import { groups } from "./groups";
import { users } from "./users";
import { wallets } from "./wallets";

export const groupUsers = pgTable(
  "group_users",
  {
    id: id(),
    groupId: uuid("group_id")
      .notNull()
      .references(() => groups.id),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    walletId: uuid("wallet_id")
      .notNull()
      .references(() => wallets.id),
    createdAt: createdAt(),
  },
  (groupUsers) => [unique().on(groupUsers.groupId, groupUsers.userId)]
);
