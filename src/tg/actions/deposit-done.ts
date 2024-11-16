import type { Scenes, Telegraf } from "telegraf";
import type { Address, Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { db, schema } from "../../db";
import { increment } from "../../db/sql/increment";
import { getChain } from "../../lib/get-chain";
import { getGroup } from "../../lib/get-group";
import { getGroupUser } from "../../lib/get-group-user";
import { getPublicClient } from "../../lib/get-public-client";
import { getWalletClient } from "../../lib/get-wallet-client";
import { NATIVE_TOKEN_ADDRESS } from "../../lib/native-token-address";

export const depositDone = (bot: Telegraf<Scenes.WizardContext>) =>
  bot.action("deposit_done", async (ctx) => {
    try {
      if (!ctx.chat) {
        throw new Error("chat not found.");
      }

      const group = await getGroup(ctx.chat.id.toString());
      const user = await getGroupUser(group.id, ctx.from.id.toString());

      const chain = getChain(group.chainId);

      const publicClient = getPublicClient(chain);

      const balance = await publicClient.getBalance({
        address: user.wallet.address as Address,
      });

      console.log("🚀 ~ bot.action ~ balance:", balance);

      const gasPrice = await getPublicClient(chain).getGasPrice();

      console.log("🚀 ~ bot.action ~ gasPrice:", gasPrice);

      const walletClient = getWalletClient(
        chain,
        privateKeyToAccount(user.wallet.privateKey as Hex)
      );

      const depositAmount = balance - BigInt(gasPrice) * 30000n;
      console.log("🚀 ~ bot.action ~ depositAmount:", depositAmount);

      const hash = await walletClient.sendTransaction({
        to: group.wallet.address as Address,
        value: depositAmount,
      });

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      if (receipt.status !== "success") {
        throw new Error("transaction not successful.");
      }

      await db.transaction(async (tx) => {
        await tx
          .insert(schema.walletHoldings)
          .values({
            walletId: user.wallet.id,
            chainId: chain.id,
            address: NATIVE_TOKEN_ADDRESS,
            amount: depositAmount.toString(),
          })
          .onConflictDoUpdate({
            target: [
              schema.walletHoldings.walletId,
              schema.walletHoldings.chainId,
              schema.walletHoldings.address,
            ],
            set: {
              amount: increment(
                schema.walletHoldings.amount,
                depositAmount.toString()
              ),
            },
          });

        await tx
          .insert(schema.walletHoldings)
          .values({
            walletId: group.wallet.id,
            chainId: chain.id,
            address: NATIVE_TOKEN_ADDRESS,
            amount: depositAmount.toString(),
          })
          .onConflictDoUpdate({
            target: [
              schema.walletHoldings.walletId,
              schema.walletHoldings.chainId,
              schema.walletHoldings.address,
            ],
            set: {
              amount: increment(
                schema.walletHoldings.amount,
                depositAmount.toString()
              ),
            },
          });
      });

      console.log("🚀 ~ bot.action ~ wallet:", user.wallet.address);
      console.log("🚀 ~ bot.action ~ groupWallet:", group.wallet.address);

      await ctx.reply("✅ Deposit done!");
    } catch {
      await ctx.reply(
        "❌ Sorry, there was an error processing your request. Please try again later."
      );
    }
  });
