import { Scenes, session, Telegraf } from "telegraf";
import { createPublicClient, formatEther, http } from "viem";
import { mainnet } from "viem/chains";
import { config } from "../config";
import buyWizard from "./scenes/buyWizard";

// Initialize Telegram bot
export const bot = new Telegraf<Scenes.WizardContext>(config.telegramToken);

// Initialize Viem client
const client = createPublicClient({
  chain: mainnet,
  transport: http(),
});

// Initialize session and stage
const stage = new Scenes.Stage<Scenes.WizardContext>([buyWizard]);
bot.use(session({ defaultSession: () => ({}) }));
bot.use(stage.middleware());

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
