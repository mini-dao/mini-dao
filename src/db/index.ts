import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "../config";
import { wallets } from "./schema/wallets";

export const schema = {
  wallets,
};

export const hawkeye = drizzle({
  connection: {
    url: config.databaseUrl,
    ssl: { rejectUnauthorized: false },
  },
  schema,
});
