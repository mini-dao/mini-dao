import type { Scenes, Telegraf } from "telegraf";
import { formatUnits } from "viem";
import { getChain } from "../../lib/get-chain";
import { getGroup } from "../../lib/get-group";
import { NATIVE_TOKEN_ADDRESS } from "../../lib/native-token-address";

export const holdings = (bot: Telegraf<Scenes.WizardContext>) =>
  bot.command("holdings", async (ctx) => {
    const group = await getGroup(ctx.chat.id.toString());

    const chain = getChain(group.chainId);

    const nativeHolding = group.wallet.holdings.find(
      (holding) =>
        holding.chainId === group.chainId &&
        holding.address === NATIVE_TOKEN_ADDRESS
    );

    await ctx.reply(
      [
        `🔗 ${group.chainId}`,
        `🏦 Native balance: ${formatUnits(
          BigInt(nativeHolding?.amount ?? "0"),
          18
        )} ${chain.nativeCurrency.symbol}`,
        [
          `🏦 Other balances:`,
          group.wallet.holdings
            .filter(
              (holding) =>
                holding.chainId === group.chainId &&
                holding.address !== NATIVE_TOKEN_ADDRESS
            )
            .map(
              (holding) => `PEPE: ${formatUnits(BigInt(holding.amount), 6)}`
            ),
        ]
          .flat()
          .join("\n"),
      ].join("\n\n")
    );
  });
