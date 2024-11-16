import { and, eq } from "drizzle-orm";
import { Scenes, session, Telegraf } from "telegraf";
import { parseUnits } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { config } from "../config";
import { db, schema } from "../db";
import { decrement } from "../db/sql/decrement";
import { increment } from "../db/sql/increment";
import { sell } from "../lib/dex";
import { buy } from "../lib/dex/buy";
import { getChain } from "../lib/get-chain";
import { getGroup } from "../lib/get-group";
import { getPublicClient } from "../lib/get-public-client";
import { depositDone } from "./actions/deposit-done";
import { refresh } from "./actions/refresh";
import { switchId } from "./actions/switch-id";
import { currentChain } from "./commands/currentChain";
import { deposit } from "./commands/deposit";
import { holdings } from "./commands/holdings";
import { switchChain } from "./commands/switchChain";
import { myChatMember } from "./events/my-chat-member";
import { getGroupWallet } from "./helpers";
import buyWizard from "./scenes/buyWizard2";
import sellWizard from "./scenes/sellWizard";
import { pendingTransactions } from "./types/pending-transactions";

const chains = [
  { id: "ethereum", name: "Ethereum" },
  { id: "scroll", name: "Scroll" },
  { id: "mantle", name: "Mantle" },
];

// Initialize Telegram bot
export const bot = new Telegraf<Scenes.WizardContext>(config.telegramToken);

/**
 * events
 */
myChatMember(bot);

/**
 * commands
 */
holdings(bot);
switchChain(bot);
currentChain(bot);
deposit(bot);

/**
 * actions
 */
refresh(bot);
depositDone(bot);
switchId(bot);

// bot.on("poll", (ctx) => console.log("Poll update", ctx.poll));

// Initialize session and stage

const stage = new Scenes.Stage<Scenes.WizardContext>([buyWizard, sellWizard]);
bot.use(session());
bot.use(stage.middleware());

bot.start(async (ctx) => await ctx.reply("Welcome"));

// bot.command("switch", async (ctx) => {
//   const chainId = ctx.message.text.split(" ")[1]?.toLowerCase();

//   if (!chainId) {
//     await ctx.reply(
//       "Please specify a chain:\n" +
//         "/switch ethereum\n" +
//         "/switch scroll\n" +
//         "/switch mantle"
//     );
//     return;
//   }

//   switchChain(chainId);
//   await ctx.reply(`Switched to ${currentChain.id} network`);
// });

// Start command
bot.command("start", async (ctx) => {
  await ctx.reply(
    "Welcome to MiniDAO Bot! 🤖\n\n" +
      "/deposit - Get deposit address\n" +
      "/block - Get latest block number\n" +
      "/buy - Buy a token\n" +
      "/sell - Sell a token\n" +
      "/holdings - Check your holdings\n" +
      // "/leaderboard - Display leaderboard\n" +
      "/gas - Get current gas price\n" +
      "/help - Show this help message"
  );
});

// Help command
bot.command("help", async (ctx) => {
  await ctx.reply(
    "Available commands:\n" +
      "/deposit - Get deposit address\n" +
      "/block - Get latest block number\n" +
      "/buy - Buy a token\n" +
      "/sell - Sell a token\n" +
      "/holdings - Check your holdings\n" +
      // "/leaderboard - Display leaderboard\n" +
      "/gas - Get current gas price"
  );
});

// Balance command
// bot.command("balance", async (ctx) => {
//   try {
//     const address = ctx.message.text.split(" ")[1];

//     if (!address) {
//       await ctx.reply(
//         "Please provide an Ethereum address.\nUsage: /balance <address>"
//       );
//       return;
//     }

//     const balance = await client.getBalance({
//       address: address as `0x${string}`,
//     });
//     const formattedBalance = formatEther(balance);

//     await ctx.reply(`Balance: ${formattedBalance} ETH`);
//   } catch (error) {
//     await ctx.reply("Error: Invalid address or network issue.");
//   }
// });

// Block command
bot.command("block", async (ctx) => {
  try {
    const group = await getGroup(ctx.chat.id.toString());

    const chain = getChain(group.chainId);

    const client = getPublicClient(chain);

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
bot.command("sell", (ctx: Scenes.WizardContext) =>
  ctx.scene.enter("sell-wizard")
);

bot.on("poll", async (ctx) => {
  const poll = ctx.poll;
  const txDetails = pendingTransactions.get(poll.id);

  const yesVotes = poll.options[0].voter_count;
  const totalVotes = poll.total_voter_count;
  console.log(
    "🚀 ~ bot.on ~ yesVotes:",
    yesVotes,
    totalVotes,
    txDetails,
    ctx.chat
  );

  if (txDetails) {
    const group = await getGroup(txDetails.chatId.toString());

    const chain = getChain(group.chainId);

    if (totalVotes >= 2) {
      if (yesVotes >= 2) {
        // Majority approved - execute transaction
        console.log("Executing transaction:", {
          chain: txDetails.chain,
          tokenAddress: txDetails.tokenAddress,
          amount: txDetails.amount,
        });
        const { wallet } = await getGroupWallet(txDetails.chatId);
        console.log(
          "🚀 ~ bot.on ~ wallet:",
          wallet,
          parseUnits(parseInt(txDetails.amount).toString(), 6).toString()
        );
        if (txDetails.type === "buy") {
          await ctx.telegram.sendMessage(txDetails.chatId, "Buying...");
          await buy({
            account: privateKeyToAccount(wallet.privateKey as `0x${string}`),
            chain,
            token: txDetails.tokenAddress as `0x${string}`,
            amount: parseUnits(txDetails.amount.toString(), 18).toString(),
          });

          const pepe = parseUnits(txDetails.amount.toString(), 18) / 10n ** 14n;

          await db
            .insert(schema.walletHoldings)
            .values({
              walletId: group.wallet.id,
              chainId: chain.id,
              address: txDetails.tokenAddress,
              amount: pepe.toString(),
            })
            .onConflictDoUpdate({
              target: [
                schema.walletHoldings.walletId,
                schema.walletHoldings.chainId,
                schema.walletHoldings.address,
              ],
              set: {
                amount: increment(
                  schema.walletHoldings.amount,
                  pepe.toString()
                ),
              },
            });
        } else if (txDetails.type === "sell") {
          await ctx.telegram.sendMessage(txDetails.chatId, "Selling...");

          await sell({
            account: privateKeyToAccount(wallet.privateKey as `0x${string}`),
            chain,
            token: txDetails.tokenAddress as `0x${string}`,
            amount: parseUnits(txDetails.amount.toString(), 6).toString(),
          });

          await db
            .update(schema.walletHoldings)
            .set({
              amount: decrement(
                schema.walletHoldings.amount,
                parseUnits(txDetails.amount.toString(), 6).toString()
              ),
            })
            .where(
              and(
                eq(schema.walletHoldings.walletId, group.wallet.id),
                eq(schema.walletHoldings.chainId, chain.id),
                eq(schema.walletHoldings.address, txDetails.tokenAddress)
              )
            );
        }
        await ctx.telegram.sendMessage(
          txDetails.chatId,
          "✅ Transaction approved and executed!"
        );
        pendingTransactions.delete(poll.id);
      } else {
        await ctx.telegram.sendMessage(
          txDetails.chatId,
          "❌ Transaction rejected by voters."
        );
        pendingTransactions.delete(poll.id);
      }
    }
  }
});

bot.on("poll_answer", async (ctx) => {
  const poll = ctx.poll;
  // console.log("🚀 ~ bot.on ~ ctx:", poll, ctx.pollAnswer,ctx.);
  // const txDetails = pendingTransactions.get(poll?.id);
  // if (txDetails) {
  //   const yesVotes = poll!.options[0].voter_count;
  //   const totalVotes = poll!.total_voter_count;

  //   if (yesVotes >= 2) {
  //     // Majority approved - execute transaction
  //     console.log("Executing transaction:", {
  //       chain: txDetails.chain,
  //       tokenAddress: txDetails.tokenAddress,
  //       amount: txDetails.amount,
  //     });

  //     await ctx.telegram.sendMessage(
  //       txDetails.chatId,
  //       "✅ Transaction approved and executed!"
  //     );
  //   }
  //   // else {
  //   //   await ctx.telegram.sendMessage(
  //   //     txDetails.chatId,
  //   //     "❌ Transaction rejected by voters."
  //   //   );
  //   // }

  //   pendingTransactions.delete(poll.id);
  // }
});

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
