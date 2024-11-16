import { eq } from "drizzle-orm";
import type { Scenes, Telegraf } from "telegraf";
import { db, schema } from "../../db";
import { getChain } from "../../lib/get-chain";

export const switchId = (bot: Telegraf<Scenes.WizardContext>) =>
  bot.action(/^switch_(.+)$/, async (ctx) => {
    try {
      if (!ctx.chat) {
        throw new Error("chat not found.");
      }

      const chain = getChain(parseInt(ctx.match[1]));

      const group = await db
        .update(schema.groups)
        .set({
          chainId: chain.id,
        })
        .where(eq(schema.groups.telegramId, ctx.chat.id.toString()))
        .returning();

      await ctx.editMessageText(`Switched to ${chain.name} network.`);
    } catch {
      await ctx.reply(
        "❌ Sorry, there was an error processing your request. Please try again later."
      );
    }
  });
