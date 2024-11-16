import type { Scenes, Telegraf } from "telegraf";
import { getGroup } from "../../lib/get-group";
import { NATIVE_TOKEN_ADDRESS } from "../../lib/native-token-address";

export const holdings = (bot: Telegraf<Scenes.WizardContext>) =>
  bot.command("holdings", async (ctx) => {
    const group = await getGroup(ctx.chat.id.toString());

    const nativeHolding = group.wallet.holdings.find(
      (holding) =>
        holding.chainId === group.chainId &&
        holding.address === NATIVE_TOKEN_ADDRESS
    );

    await ctx.reply(
      [
        `🔗 ${group.chainId}`,
        `🏦 Native balance: ${nativeHolding?.amount ?? "0"}`,
        [
          `🏦 Other balances:`,
          group.wallet.holdings
            .filter(
              (holding) =>
                holding.chainId === group.chainId &&
                holding.address !== NATIVE_TOKEN_ADDRESS
            )
            .map((holding) => `${holding.address}: ${holding.amount}`),
        ]
          .flat()
          .join("\n"),
      ].join("\n\n")
    );
  });
