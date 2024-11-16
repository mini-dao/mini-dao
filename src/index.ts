import { server } from "./api/server";
import { config } from "./config";
import { bot } from "./tg/bot";

server.listen(config.port || 3001, () => {
  console.log(`listening on :${config.port}`);
});

bot
  .launch(() => {
    console.log("Bot is running!");
  })
  .catch((err) => {
    console.error("Failed to start bot:", err);
  });

const exit = (reason: string) => {
  server.close();
  bot.stop(reason);
};

// Enable graceful stop
process.once("SIGINT", () => exit("SIGINT"));
process.once("SIGTERM", () => exit("SIGTERM"));
