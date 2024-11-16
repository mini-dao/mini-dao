import dotenv from "dotenv";
import type { Hex } from "viem";

dotenv.config({
  path: ".env.local",
});

export const config = {
  port: process.env.PORT as string,
  databaseUrl: process.env.DATABASE_URL as string,
  telegramToken: process.env.TELEGRAM_TOKEN as string,
  multibaas: {
    mantleSepolia: {
      key: process.env.MULTIBAAS_MANTLE_SEPOLIA_KEY as string,
      basePath: process.env.MULTIBAAS_MANTLE_SEPOLIA_BASE_PATH as string,
    },
    sepolia: {
      key: process.env.MULTIBAAS_SEPOLIA_KEY as string,
      basePath: process.env.MULTIBAAS_SEPOLIA_BASE_PATH as string,
    },
  },
  privateKey: process.env.PRIVATE_KEY as Hex,
};
