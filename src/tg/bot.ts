import { Markup, Scenes, session, Telegraf } from "telegraf";
import { createWalletClient, formatEther, http, type Chain } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import {
  mainnet,
  mantleSepoliaTestnet,
  scrollSepolia,
  sepolia,
} from "viem/chains";
import { config } from "../config";
import { buy } from "../lib/dex/buy";
import { getPublicClient } from "../lib/get-public-client";
import { holdings } from "./commands/holdings";
import { myChatMember } from "./events/my-chat-member";
import { getGroupWallet, getUserWallet } from "./helpers";
import buyWizard, { pendingTransactions } from "./scenes/buyWizard2";

let currentChain: Chain = sepolia;

const chains = [
  { id: "ethereum", name: "Ethereum" },
  { id: "scroll", name: "Scroll" },
  { id: "mantle", name: "Mantle" },
];

const switchChain = (chainName: string) => {
  switch (chainName) {
    case "ethereum":
      currentChain = sepolia;
      break;
    case "scroll":
      currentChain = scrollSepolia;
      break;
    case "mantle":
      currentChain = mantleSepoliaTestnet;
      break;
    default:
      currentChain = sepolia;
  }
};

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

bot.command("switchChain", async (ctx) => {
  await ctx.reply(
    "Select a network:",
    Markup.inlineKeyboard([
      [
        Markup.button.callback("Ethereum", "switch_ethereum"),
        Markup.button.callback("Scroll", "switch_scroll"),
        Markup.button.callback("Mantle", "switch_mantle"),
      ],
    ])
  );
});

bot.action(/^switch_(.+)$/, async (ctx) => {
  const chain = ctx.match[1];
  switchChain(chain);
  await ctx.editMessageText(`Switched to ${currentChain.name} network`);
});

bot.command("currentChain", async (ctx) => {
  await ctx.reply(`Current chain: ${currentChain.name}`);
});

bot.command("deposit", async (ctx) => {
  try {
    const { wallet } = await getUserWallet(ctx);
    const client = getPublicClient(currentChain);
    const balance = await client.getBalance({
      address: wallet.address as `0x${string}`,
    });
    const formattedBalance = formatEther(balance);
    const chainSymbol = mainnet.nativeCurrency.symbol;

    await ctx.reply(
      `🏦 Your deposit address on Sepolia:\n\n` +
        `\`${wallet.address}\`\n\n` +
        `💰 Balance: ${formattedBalance} ${chainSymbol}\n\n` +
        `✅ Send tokens to this address to deposit them into your account.\n` +
        `⚠️ Only send tokens on supported networks!`,
      {
        parse_mode: "Markdown",
        ...Markup.inlineKeyboard([
          [
            Markup.button.url(
              "View on Blockscout",
              `https://eth-sepolia.blockscout.com/address/${wallet.address}`
            ),
            Markup.button.callback("Refresh", `refresh`),
            Markup.button.callback("✅ Done", "deposit_done"),
          ],
        ]),
      }
    );
  } catch (error) {
    console.error("Error in deposit command:", error);

    await ctx.reply(
      "❌ Sorry, there was an error processing your request. Please try again later."
    );
  }
});

bot.action("deposit_done", async (ctx) => {
  const { wallet } = await getUserWallet(ctx);
  const { wallet: groupWallet } = await getGroupWallet(ctx.chat!.id);
  const client = getPublicClient(currentChain);
  const balance = await client.getBalance({
    address: wallet.address as `0x${string}`,
  });
  console.log("🚀 ~ bot.action ~ balance:", balance);

  const gasPrice = await getPublicClient(sepolia).getGasPrice();
  console.log("🚀 ~ bot.action ~ gasPrice:", gasPrice);

  const walletClient = createWalletClient({
    account: privateKeyToAccount(wallet.privateKey as `0x${string}`),
    chain: sepolia,
    transport: http(),
  });

  const depositAmount = balance - BigInt(gasPrice) * 30000n;
  console.log("🚀 ~ bot.action ~ depositAmount:", depositAmount);

  const hash = await walletClient.sendTransaction({
    account: privateKeyToAccount(wallet.privateKey as `0x${string}`),
    to: groupWallet.address as `0x${string}`,
    value: depositAmount,
  });

  console.log("🚀 ~ bot.action ~ wallet:", wallet);
  console.log("🚀 ~ bot.action ~ groupWallet:", groupWallet);

  await ctx.reply("✅ Deposit done!");
});

// bot.on("poll", (ctx) => console.log("Poll update", ctx.poll));

// Initialize session and stage

const stage = new Scenes.Stage<Scenes.WizardContext>([buyWizard]);
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
      "/balance - Check ETH balance\n" +
      "/deposit - Get deposit address\n" +
      "/block - Get latest block number\n" +
      "/buy - Buy a token\n" +
      "/sell - Sell a token\n" +
      "/leaderboard - Display leaderboard\n" +
      "/gas - Get current gas price\n" +
      "/help - Show this help message"
  );
});

// Help command
bot.command("help", async (ctx) => {
  await ctx.reply(
    "Available commands:\n" +
      "/balance - Check ETH balance\n" +
      "/deposit - Get deposit address\n" +
      "/block - Get latest block number\n" +
      "/buy - Buy a token\n" +
      "/sell - Sell a token\n" +
      "/leaderboard - Display leaderboard\n" +
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
    const client = getPublicClient(currentChain);
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

// Add action handler for refresh button
bot.action("refresh", async (ctx) => {
  try {
    const telegramId = ctx.from.id.toString();
    const { wallet } = await getUserWallet(ctx);

    const client = getPublicClient(currentChain);

    const balance = await client.getBalance({
      address: wallet.address as `0x${string}`,
    });

    const formattedBalance = formatEther(balance);
    const chainSymbol = mainnet.nativeCurrency.symbol;

    // Update the message with fresh data
    await ctx.editMessageText(
      `🏦 Your deposit address on Sepolia:\n\n` +
        `\`${wallet.address}\`\n\n` +
        `💰 Balance: ${formattedBalance} ${chainSymbol}\n\n` +
        `✅ Send tokens to this address to deposit them into your account.\n` +
        `⚠️ Only send tokens on supported networks!`,
      {
        parse_mode: "Markdown",
        reply_markup: Markup.inlineKeyboard([
          [
            Markup.button.url(
              "View on Etherscan",
              `https://sepolia.etherscan.io/address/${wallet.address}`
            ),
            Markup.button.callback("Refresh", "refresh"),
            Markup.button.callback("✅ Done", "deposit_done"),
          ],
        ]).reply_markup,
      }
    );

    // Answer the callback query to remove loading state
    await ctx.answerCbQuery("Balance updated!");
  } catch (error) {
    console.error("Error in refresh action:", error);
    await ctx.answerCbQuery("❌ Failed to refresh balance");
  }
});

bot.command("balance", async (ctx) => {
  const { wallet } = await getGroupWallet(ctx.chat.id);
  const client = getPublicClient(currentChain);
  const balance = await client.getBalance({
    address: wallet.address as `0x${string}`,
  });

  const formattedBalance = formatEther(balance);
  const chainSymbol = mainnet.nativeCurrency.symbol;

  await ctx.reply(`Balance: ${formattedBalance} ${chainSymbol}`);
});
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
    if (totalVotes >= 1) {
      if (yesVotes >= 1) {
        // Majority approved - execute transaction
        console.log("Executing transaction:", {
          chain: txDetails.chain,
          tokenAddress: txDetails.tokenAddress,
          amount: txDetails.amount,
        });
        const { wallet } = await getGroupWallet(txDetails.chatId);
        console.log("🚀 ~ bot.on ~ wallet:", wallet);
        await ctx.telegram.sendMessage(txDetails.chatId, "Buying...");
        await buy({
          account: privateKeyToAccount(wallet.privateKey as `0x${string}`),
          chain: currentChain,
          token: txDetails.tokenAddress as `0x${string}`,
          amount: txDetails.amount,
        });
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
