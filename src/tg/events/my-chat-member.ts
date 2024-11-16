import { eq } from "drizzle-orm";
import type { Scenes, Telegraf } from "telegraf";
import { generatePrivateKey, privateKeyToAddress } from "viem/accounts";
import { sepolia } from "viem/chains";
import { db, schema } from "../../db";

export const myChatMember = (
  bot: Telegraf<Scenes.WizardContext<Scenes.WizardSessionData>>
) =>
  bot.on("my_chat_member", async (ctx) => {
    const { new_chat_member } = ctx.update.my_chat_member;

    if (new_chat_member && new_chat_member.user.id === ctx.botInfo.id) {
      if (new_chat_member.status === "member") {
        const [group] = (await db.$count(
          schema.groups,
          eq(schema.groups.telegramId, ctx.chat.id.toString())
        ))
          ? await db
              .update(schema.groups)
              .set({
                deletedAt: null,
              })
              .where(eq(schema.groups.telegramId, ctx.chat.id.toString()))
              .returning()
          : await db.transaction(async (tx) => {
              const privateKey = generatePrivateKey();

              const [wallet] = await tx
                .insert(schema.wallets)
                .values({
                  address: privateKeyToAddress(privateKey),
                  privateKey,
                })
                .returning();

              return await tx
                .insert(schema.groups)
                .values({
                  telegramId: ctx.chat.id.toString(),
                  walletId: wallet.id,
                  chainId: sepolia.id,
                })
                .returning();
            });

        console.log("joined", { group });

        await ctx.reply("🚀🌑");
      } else if (new_chat_member.status === "left") {
        const [group] = await db
          .update(schema.groups)
          .set({
            deletedAt: new Date(),
          })
          .where(eq(schema.groups.telegramId, ctx.chat.id.toString()))
          .returning();

        console.log("left", { group });
      }
    }
  });
