import { Markup, type Scenes, type Telegraf } from "telegraf";
import { formatEther } from "viem";
import { getChain } from "../../lib/get-chain";
import { getGroup } from "../../lib/get-group";
import { getGroupUser } from "../../lib/get-group-user";
import { getPublicClient } from "../../lib/get-public-client";

export const refresh = (bot: Telegraf<Scenes.WizardContext>) =>
  bot.action("refresh", async (ctx) => {
    try {
      if (!ctx.chat) {
        throw new Error("chat not found.");
      }

      const group = await getGroup(ctx.chat.id.toString());
      const user = await getGroupUser(group.id, ctx.from.id.toString());

      const chain = getChain(group.chainId);

      const client = getPublicClient(chain);

      const balance = await client.getBalance({
        address: user.wallet.address as `0x${string}`,
      });

      // Update the message with fresh data
      await ctx.editMessageText(
        `🏦 Your deposit address on Sepolia:\n\n` +
          `\`${user.wallet.address}\`\n\n` +
          `💰 Balance: ${formatEther(balance)} ${
            chain.nativeCurrency.symbol
          }\n\n` +
          `✅ Send tokens to this address to deposit them into your account.\n` +
          `⚠️ Only send tokens on supported networks!`,
        {
          parse_mode: "Markdown",
          reply_markup: Markup.inlineKeyboard([
            [
              Markup.button.url(
                "View on Etherscan",
                `${chain.blockExplorers.default.url}/address/${user.wallet.address}`
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
