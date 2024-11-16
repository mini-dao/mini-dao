import type { Scenes, Telegraf } from "telegraf";
import { getGroup } from "../../lib/get-group";

export const holdings = (
  bot: Telegraf<Scenes.WizardContext<Scenes.WizardSessionData>>
) =>
  bot.command("holdings", async (ctx) => {
    const group = await getGroup(ctx.chat.id.toString());

    await ctx.reply(`
        `);
  });
