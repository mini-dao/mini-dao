import type { Account, Chain } from "viem";
import { getPair } from "../lib/get-pair";
import { getRouter } from "../lib/get-router";
import { writeContract } from "../lib/write-contract";

export const buy = async ({
  account,
  chain,
  token,
  amount,
}: {
  account: Account;
  chain: Chain;
  token: string;
  amount: string;
}) => {
  const { contract, label } = getRouter(chain);

  return await writeContract(chain, account, {
    contract,
    label,
    fn: "buy",
    value: amount,
    args: [getPair(token)],
  });
};
