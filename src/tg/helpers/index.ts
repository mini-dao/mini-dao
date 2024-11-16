import { and, eq } from "drizzle-orm";
import type { Context } from "telegraf";
import { generatePrivateKey, privateKeyToAddress } from "viem/accounts";
import { db, schema } from "../../db";

export const getUserWallet = async (ctx: Context) => {
  const [group] = await db
    .select()
    .from(schema.groups)
    .where(eq(schema.groups.telegramId, ctx.chat!.id.toString()));

  if (!group) {
    throw new Error("group not found.");
  }

  return await (async () => {
    const [join] = await db
      .select()
      .from(schema.groupUsers)
      .innerJoin(schema.groups, eq(schema.groups.id, schema.groupUsers.groupId))
      .innerJoin(
        schema.wallets,
        eq(schema.wallets.id, schema.groupUsers.walletId)
      )
      .where(
        and(
          eq(schema.groups.telegramId, ctx.chat!.id.toString()),
          eq(schema.groupUsers.telegramId, ctx.from!.id.toString())
        )
      );

    if (!join) {
      return await db.transaction(async (tx) => {
        const privateKey = generatePrivateKey();

        const [wallet] = await tx
          .insert(schema.wallets)
          .values({
            address: privateKeyToAddress(privateKey),
            privateKey,
          })
          .returning();

        const [groupUser] = await tx
          .insert(schema.groupUsers)
          .values({
            groupId: group.id,
            telegramId: ctx.from!.id.toString(),
            walletId: wallet.id,
          })
          .returning();

        return { groupUser, wallet };
      });
    }

    return {
      group,
      groupUser: join.group_users,
      wallet: join.wallets,
    };
  })();
};

export const getGroupWallet = async (chatId: number) => {
  console.log("🚀 ~ getGroupWallet ~ chatId:", chatId);

  const [group] = await db
    .select()
    .from(schema.groups)
    .where(eq(schema.groups.telegramId, chatId.toString()));
  console.log("🚀 ~ getGroupWal ~ group:", group);

  if (!group) {
    throw new Error("group not found.");
  }

  return await (async () => {
    // Try to get existing group wallet
    const [join] = await db
      .select()
      .from(schema.groups)
      .innerJoin(schema.wallets, eq(schema.wallets.id, schema.groups.walletId))
      .where(eq(schema.groups.telegramId, chatId.toString()));

    // if (!join) {
    //   return await db.transaction(async (tx) => {
    //     const privateKey = generatePrivateKey();

    //     const [wallet] = await tx
    //       .insert(schema.wallets)
    //       .values({
    //         address: privateKeyToAddress(privateKey),
    //         privateKey,
    //       })
    //       .returning();

    //     // Update group with new wallet
    //     const [updatedGroup] = await tx
    //       .update(schema.groups)
    //       .set({
    //         walletId: wallet.id,
    //       })
    //       .where(eq(schema.groups.id, group.id))
    //       .returning();

    //     return { group: updatedGroup, wallet };
    //   });
    // }

    return {
      group: join.groups,
      wallet: join.wallets,
    };
  })();
};

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
