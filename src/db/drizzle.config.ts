import { defineConfig } from "drizzle-kit";
import { config } from "../config";

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: config.databaseUrl,
    ssl: { rejectUnauthorized: false },
  },
  schema: ["./src/db/schema/*.ts"],
  out: "./src/db/migrations",
});
