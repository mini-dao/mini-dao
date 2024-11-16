import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "../config";
import { groupRelations, groups } from "./schema/groups";
import { groupUserRelations, groupUsers } from "./schema/groupUsers";
import {
  walletHoldingRelations,
  walletHoldings,
} from "./schema/walletHoldings";
import { walletRelations, wallets } from "./schema/wallets";

export const schema = {
  wallets,
  walletRelations,
  walletHoldings,
  walletHoldingRelations,
  groups,
  groupRelations,
  groupUsers,
  groupUserRelations,
};

export const db = drizzle({
  connection: {
    url: config.databaseUrl,
    ssl: { rejectUnauthorized: false },
  },
  schema,
});
