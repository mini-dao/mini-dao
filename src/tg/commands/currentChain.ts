import { type Scenes, type Telegraf } from "telegraf";
import { getChain } from "../../lib/get-chain";
import { getGroup } from "../../lib/get-group";

export const currentChain = (bot: Telegraf<Scenes.WizardContext>) =>
  bot.command("currentChain", async (ctx) => {
    const group = await getGroup(ctx.chat.id.toString());

    const chain = getChain(group.chainId);

    await ctx.reply(`Current chain: ${chain.name}`);
  });
