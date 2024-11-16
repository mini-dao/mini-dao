import { and, eq } from "drizzle-orm";
import { generatePrivateKey, privateKeyToAddress } from "viem/accounts";
import { db, schema } from "../db";

export const getGroupUser = async (groupId: string, telegramId: string) => {
  if (
    !(await db.$count(
      schema.groupUsers,
      and(
        eq(schema.groupUsers.telegramId, telegramId),
        eq(schema.groupUsers.groupId, groupId)
      )
    ))
  ) {
    await db.transaction(async (tx) => {
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
          groupId,
          telegramId: telegramId,
          walletId: wallet.id,
        })
        .returning();

      return { groupUser, wallet };
    });
  }

  const groupUser = await db.query.groupUsers.findFirst({
    where: and(
      eq(schema.groupUsers.telegramId, telegramId),
      eq(schema.groupUsers.groupId, groupId)
    ),
    with: {
      wallet: {
        with: {
          holdings: true,
        },
      },
    },
  });

  if (!groupUser) {
    throw new Error("group user not found.");
  }

  return groupUser;
};
