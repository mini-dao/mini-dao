import dotenv from "dotenv";
import type { Hex } from "viem";

dotenv.config({
  path: ".env.local",
});

export const config = {
  port: process.env.PORT as string,
  databaseUrl: process.env.DATABASE_URL as string,
  telegramToken: process.env.TELEGRAM_TOKEN as string,
  multibaasKey: process.env.MULTIBAAS_KEY as string,
  multibaasBasePath: process.env.MULTIBAAS_BASE_PATH as string,
  privateKey: process.env.PRIVATE_KEY as Hex,
};
