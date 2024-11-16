import { eq } from "drizzle-orm";
import { db, schema } from "../db";

export const getGroup = async (telegramId: string) => {
  const group = await db.query.groups.findFirst({
    where: eq(schema.groups.telegramId, telegramId),
    with: {
      wallet: {
        with: {
          holdings: true,
        },
      },
      users: {
        with: {
          wallet: {
            with: {
              holdings: true,
            },
          },
        },
      },
    },
  });

  if (!group) {
    throw new Error("group not found.");
  }

  return group;
};
