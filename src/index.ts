import { server } from "./api/server";
import { config } from "./config";
import { bot } from "./tg/bot";

server.listen(3001, () => {
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

// console.log(
//   await readContract({
//     contract: "minidao",
//     fn: "myVar",
//   })
// );

// console.log(
//   await writeContract(
//     mantleSepoliaTestnet,
//     privateKeyToAccount(config.privateKey),
//     {
//       contract: "minidao_mantle_router",
//       label: "minidao_mantle_router5",
//       fn: "buy",
//       value: "1000000000000",
//       args: ["0x89B10fe88a4bb6D4727cfE18ad6356A89BD2FE23"],
//     }
//   )
// );

// console.log(
//   await readContract({
//     contract: "minidao",
//     fn: "myVar",
//   })
// );
