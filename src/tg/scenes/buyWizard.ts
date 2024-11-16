import { Scenes } from "telegraf";
import type { Message } from "telegraf/types";

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

const buyWizard = new Scenes.WizardScene<MyContext>(
  "buy-wizard",
  // Step 1: Select chain
  async (ctx) => {
    const keyboard = {
      inline_keyboard: chains.map((chain) => [
        { text: chain.name, callback_data: chain.id },
      ]),
    };
    await ctx.reply("Select a chain:", { reply_markup: keyboard });
    return ctx.wizard.next();
  },
  // Step 2: Handle chain selection and ask for token address
  async (ctx) => {
    if (!ctx.callbackQuery || !("data" in ctx.callbackQuery)) {
      await ctx.reply("Please select a chain using the buttons above.");
      return;
    }

    // Store selected chain
    ctx.scene.session.selectedChain = ctx.callbackQuery.data;
    console.log("Step 2 - Selected chain:", ctx.scene.session.selectedChain);

    // Answer the callback query to clear the loading state
    // await ctx.answerCbQuery();

    await ctx.reply("Please enter the token address:", {
      reply_markup: { force_reply: true },
    });
    console.log("Step 2 - Received message:", ctx.message);
    return ctx.wizard.next();
  },
  // Step 3: Handle token address and show amount options
  async (ctx) => {
    console.log("Step 3 - Received message:", ctx.message);

    if (!ctx.message || !("text" in ctx.message)) {
      await ctx.reply("Please enter a valid token address.");
      return;
    }

    const text = ctx.message.text;
    console.log("Validating address:", text);

    //check valid token address regex
    if (!text.includes("/")) {
      if (!tokenAddressRegex.test(text)) {
        await ctx.reply("Please enter a valid token address (0x...)");
        return;
      }
    }

    // Store token address
    ctx.scene.session.tokenAddress = text;
    console.log("Stored token address:", ctx.scene.session.tokenAddress);

    const keyboard = {
      inline_keyboard: [
        ...amounts.map((amount) => [
          {
            text:
              amount === "Custom"
                ? amount
                : `${amount} ${ctx.scene.session.selectedChain}`,
            callback_data: amount,
          },
        ]),
      ],
    };

    await ctx.reply("Select amount:", { reply_markup: keyboard });
    return ctx.wizard.next();
  },
  // Step 4: Handle amount selection and complete
  async (ctx) => {
    if (ctx.callbackQuery && "data" in ctx.callbackQuery) {
      if (ctx.callbackQuery.data === "Custom") {
        await ctx.reply("Please enter your desired amount:", {
          reply_markup: { force_reply: true },
        });
        return;
      }
      // Handle predefined amount
      await handleBuyOrder(ctx, ctx.callbackQuery.data);
      return await ctx.scene.leave();
    }

    const message = ctx.message as Message.TextMessage;
    if (message?.text) {
      // Handle custom amount
      await handleBuyOrder(ctx, message.text);
      return await ctx.scene.leave();
    }

    await ctx.reply("Please select or enter a valid amount.");
  }
);

async function handleBuyOrder(ctx: MyContext, amount: string) {
  const { selectedChain, tokenAddress } = ctx.scene.session;
  await ctx.reply(
    `Order Summary:\n` +
      `Chain: ${selectedChain}\n` +
      `Token: ${tokenAddress}\n` +
      `Amount: ${amount}\n\n` +
      `Order placed successfully!`
  );
}

export type { MyContext, MyWizardSession };
export default buyWizard;
