import type { Account, Chain } from "viem";
import { getPair } from "../lib/get-pair";
import { getRouter } from "../lib/get-router";
import { writeContract } from "../lib/write-contract";

export const sell = async ({
  chain,
  account,
  token,
  amount,
}: {
  chain: Chain;
  account: Account;
  token: string;
  amount: string;
}) => {
  const { contract, label } = getRouter(chain);

  return await writeContract(chain, account, {
    contract,
    label,
    fn: "sell",
    args: [getPair(token), amount],
  });
};
