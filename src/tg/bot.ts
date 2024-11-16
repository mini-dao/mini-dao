import { eq } from "drizzle-orm";
import { Markup, Scenes, session, Telegraf } from "telegraf";
import { createPublicClient, formatEther, http } from "viem";
import { generatePrivateKey, privateKeyToAddress } from "viem/accounts";
import { mainnet } from "viem/chains";
import { config } from "../config";
import { db, schema } from "../db";
import buyWizard from "./scenes/buyWizard";

const keyboard = Markup.keyboard([
  Markup.button.pollRequest("Create poll", "regular"),
  Markup.button.pollRequest("Create quiz", "quiz"),
]);

// Initialize Telegram bot
export const bot = new Telegraf<Scenes.WizardContext>(config.telegramToken);

bot.on("my_chat_member", async (ctx) => {
  const { new_chat_member } = ctx.update.my_chat_member;

  if (new_chat_member && new_chat_member.user.id === ctx.botInfo.id) {
    if (new_chat_member.status === "member") {
      const [group] = (await db.$count(
        schema.groups,
        eq(schema.groups.telegramId, ctx.chat.id.toString())
      ))
        ? await db
            .update(schema.groups)
            .set({
              deletedAt: null,
            })
            .where(eq(schema.groups.telegramId, ctx.chat.id.toString()))
            .returning()
        : await db.transaction(async (tx) => {
            const privateKey = generatePrivateKey();

            const [wallet] = await tx
              .insert(schema.wallets)
              .values({
                address: privateKeyToAddress(privateKey),
                privateKey,
              })
              .returning();

            return await tx
              .insert(schema.groups)
              .values({
                telegramId: ctx.chat.id.toString(),
                walletId: wallet.id,
              })
              .returning();
          });

      console.log("joined", { group });

      await ctx.reply("🚀🌑");
    } else if (new_chat_member.status === "left") {
      const [group] = await db
        .update(schema.groups)
        .set({
          deletedAt: new Date(),
        })
        .where(eq(schema.groups.telegramId, ctx.chat.id.toString()))
        .returning();

      console.log("left", { group });
    }
  }
});

bot.on("poll", (ctx) => console.log("Poll update", ctx.poll));
bot.on("poll_answer", (ctx) => console.log("Poll answer", ctx.pollAnswer));

// Initialize Viem client
const client = createPublicClient({
  chain: mainnet,
  transport: http(),
});

// Initialize session and stage

const stage = new Scenes.Stage<Scenes.WizardContext>([buyWizard]);
bot.use(session());
bot.use(stage.middleware());

bot.start(async (ctx) => await ctx.reply("Welcome"));

// Start command
bot.command("start", async (ctx) => {
  await ctx.reply(
    "Welcome to Web3 Bot! 🤖\n\n" +
      "Available commands:\n" +
      "/balance <address> - Check ETH balance\n" +
      "/block - Get latest block number\n" +
      "/gas - Get current gas price\n" +
      "/help - Show this help message"
  );
});

// Help command
bot.command("help", async (ctx) => {
  await ctx.reply(
    "Available commands:\n" +
      "/balance <address> - Check ETH balance\n" +
      "/block - Get latest block number\n" +
      "/buy - Buy a token\n" +
      "/sell - Sell a token\n" +
      "/leaderboard - Display leaderboard\n" +
      "/gas - Get current gas price"
  );
});

// Balance command
bot.command("balance", async (ctx) => {
  try {
    const address = ctx.message.text.split(" ")[1];

    if (!address) {
      await ctx.reply(
        "Please provide an Ethereum address.\nUsage: /balance <address>"
      );
      return;
    }

    const balance = await client.getBalance({
      address: address as `0x${string}`,
    });
    const formattedBalance = formatEther(balance);

    await ctx.reply(`Balance: ${formattedBalance} ETH`);
  } catch (error) {
    await ctx.reply("Error: Invalid address or network issue.");
  }
});

// Block command
bot.command("block", async (ctx) => {
  try {
    const blockNumber = await client.getBlockNumber();
    await ctx.reply(`Current block number: ${blockNumber}`);
  } catch (error) {
    await ctx.reply("Error: Unable to fetch block number.");
  }
});

// Gas price command
// bot.command("gas", async (ctx) => {
//   try {
//     const gasPrice = await client.getGasPrice();
//     const gasPriceGwei = formatEther(gasPrice) * 1e9;
//     await ctx.reply(`Current gas price: ${gasPriceGwei.toFixed(2)} Gwei`);
//   } catch (error) {
//     await ctx.reply("Error: Unable to fetch gas price.");
//   }
// });

// Add the buy command handler
bot.command("buy", (ctx: Scenes.WizardContext) =>
  ctx.scene.enter("buy-wizard")
);

// Error handling
bot.catch((err: any) => {
  console.error("Bot error:", err);
});

// Start the bot
// bot
//   .launch()
//   .then(() => {
//     console.log("Bot is running!");
//   })
//   .catch((err) => {
//     console.error("Failed to start bot:", err);
//   });

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

export default bot;
