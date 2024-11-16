import { Markup, type Scenes, type Telegraf } from "telegraf";
import { chains } from "../../lib/chains";
import { chunk } from "../../utils/chunk";

export const switchChain = (bot: Telegraf<Scenes.WizardContext>) =>
  bot.command("switchChain", async (ctx) => {
    await ctx.reply(
      "Select a network:",
      Markup.inlineKeyboard(
        chunk(
          chains.map((chain) =>
            Markup.button.callback(chain.name, `switch_${chain.id.toString()}`)
          ),
          3
        )
      )
    );
  });
