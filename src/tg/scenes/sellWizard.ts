import { Markup, Scenes } from "telegraf";
import type { Message } from "telegraf/types";
import { getChain } from "../../lib/get-chain";
import { getGroup } from "../../lib/get-group";
import { pendingTransactions } from "../types/pending-transactions";

const tokenAddressRegex = /^0x[a-fA-F0-9]{40}$/;

interface MyWizardSession extends Scenes.WizardSessionData {
  selectedChain?: string;
  tokenAddress?: string;
  amount?: string;
}

type MyContext = Scenes.WizardContext<MyWizardSession>;

const chains = [
  { id: "ethereum", name: "Ethereum" },
  { id: "bsc", name: "BSC" },
  { id: "polygon", name: "Polygon" },
];

const amounts = ["0.1", "0.5", "1.0", "2.0", "Custom"];

// Add default chain constant
const DEFAULT_CHAIN = "ethereum";

// Modify the wizard to start from token info when address is provided
const sellWizard = new Scenes.WizardScene<MyContext>(
  "sell-wizard",
  // Step 1: Show token info and amount options
  async (ctx) => {
    // Set default chain
    ctx.scene.session.selectedChain = DEFAULT_CHAIN;
    console.log("🚀 ~ sellWizard ~ ctx.message:", ctx.chat?.id);
    const group = await getGroup(ctx.chat?.id!.toString() ?? "");

    const chain = getChain(group.chainId);
    // Get token address from command
    const message = ctx.message as Message.TextMessage;
    const tokenAddress = message.text?.split(" ")[1];

    if (!tokenAddress || !tokenAddressRegex.test(tokenAddress)) {
      await ctx.reply("Please provide a valid token address: /sell 0x...");
      return await ctx.scene.leave();
    }

    // Store token address
    ctx.scene.session.tokenAddress = tokenAddress;

    // Show token info
    await ctx.reply(
      `Current PEPE Balance: \nAddress: ${tokenAddress}\nChain: ${chain.name}\n`
    );

    // New keyboard layout
    const keyboard = {
      inline_keyboard: [
        [{ text: "Cancel", callback_data: "cancel" }],
        [{ text: "✅ Swap", callback_data: "swap" }],
        [
          { text: "SELL 100 PEPE", callback_data: "100" },
          { text: "SELL 50 PEPE", callback_data: "50" },
          { text: "SELL X PEPE", callback_data: "custom" },
        ],
        [
          Markup.button.url(
            "View PEPE on Blockscout",
            // TODO: use blockscout?
            `https://eth-sepolia.blockscout.com/address/${tokenAddress}`
          ),
        ],
      ],
    };

    await ctx.reply("To sell press one of the buttons below.", {
      reply_markup: keyboard,
    });
    return ctx.wizard.next();
  },
  // Step 2: Handle amount selection
  async (ctx) => {
    if (ctx.callbackQuery && "data" in ctx.callbackQuery) {
      const action = ctx.callbackQuery.data;

      switch (action) {
        case "cancel":
          await ctx.reply("Operation cancelled");
          return await ctx.scene.leave();
        case "refresh":
          // Implement refresh logic
          await ctx.reply("Refreshing data...");
          return;
        case "custom":
          await ctx.reply("Please enter your desired amount:", {
            reply_markup: { force_reply: true },
          });
          return;
        case "dca":
        case "swap":
        case "limit":
          await ctx.reply(`Selected ${action.toUpperCase()} trading`);
          return;
        default:
          // Handle specific amounts (1.0, 2.0)
          await handleSellOrder(ctx, action);
          return await ctx.scene.leave();
      }
    }

    // Handle custom amount text input
    const message = ctx.message as Message.TextMessage;
    if (message?.text) {
      const amount = parseFloat(message.text);
      if (isNaN(amount)) {
        await ctx.reply("Please enter a valid number");
        return;
      }
      await handleSellOrder(ctx, message.text);
      return await ctx.scene.leave();
    }

    await ctx.reply("Please select or enter a valid amount.");
  }
);

async function handleSellOrder(ctx: MyContext, amount: string) {
  const { selectedChain, tokenAddress } = ctx.scene.session;
  //   await ctx.reply(
  //     "Remaining Balance:\n" +
  //       `Order Summary:\n` +
  //       `Chain: ${selectedChain}\n` +
  //       `Token: ${tokenAddress}\n` +
  //       `Amount: ${amount}\n\n` +
  //       `Order placed successfully!`
  //   );

  const orderSummary =
    `*📊 Order Summary / SELL*\n` +
    `━━━━━━━━━━━━━━━\n\n` +
    `🔗 *Network:* ${selectedChain}\n` +
    `🪙 *Token:* \`${tokenAddress}\`\n` +
    `💰 *Amount:* ${amount} PEPE\n` +
    `💵 *Balance:* 0.0 PEPE\n\n` +
    `━━━━━━━━━━━━━━━`;

  await ctx.reply(orderSummary, {
    parse_mode: "Markdown",
  });

  const poll = await ctx.replyWithPoll(
    `⚠️ Do you approve this transaction?*`,
    ["✅ Yes", "❌ No"],
    {
      is_anonymous: false,
      allows_multiple_answers: false,
    }
  );

  pendingTransactions.set(poll.poll.id, {
    type: "sell",
    chain: selectedChain!,
    tokenAddress: tokenAddress!,
    amount,
    chatId: poll.chat.id,
    messageId: poll.message_id,
  });
  console.log("pendingTransactions", pendingTransactions);
}

export type { MyContext, MyWizardSession };
export default sellWizard;
