import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "../config";
import { groups } from "./schema/groups";
import { groupUsers } from "./schema/groupUsers";
import { users } from "./schema/users";
import { wallets } from "./schema/wallets";

export const schema = {
  wallets,
  groups,
  groupUsers,
  users,
};

export const db = drizzle({
  connection: {
    url: config.databaseUrl,
    ssl: { rejectUnauthorized: false },
  },
  schema,
});
