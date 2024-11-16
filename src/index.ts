import { privateKeyToAccount } from "viem/accounts";
import { mantleSepoliaTestnet } from "viem/chains";
import { server } from "./api/server";
import { config } from "./config";
import { readContract } from "./lib/read-contract";
import { writeContract } from "./lib/write-contract";
import { bot } from "./tg/bot";

server.listen(config.port || 3000, () => {
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

console.log(
  await readContract({
    contract: "minidao",
    fn: "myVar",
  })
);

console.log(
  await writeContract(
    mantleSepoliaTestnet,
    privateKeyToAccount(config.privateKey),
    {
      contract: "minidao",
      fn: "increase",
    }
  )
);

console.log(
  await readContract({
    contract: "minidao",
    fn: "myVar",
  })
);
