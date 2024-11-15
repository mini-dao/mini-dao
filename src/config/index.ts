import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

export const config = {
  port: process.env.PORT as string,
  databaseUrl: process.env.DATABASE_URL as string,
};
