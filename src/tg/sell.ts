import type { Account, Address, Chain } from "viem";
import { getPair } from "../lib/get-pair";
import { getRouter } from "../lib/get-router";
import { maxAllowance } from "../lib/max-allowance";
import { writeContract } from "../lib/write-contract";

export const sell = async ({
  account,
  chain,
  token,
  amount,
}: {
  account: Account;
  chain: Chain;
  token: Address;
  amount: string;
}) => {
  const { contract, label } = getRouter(chain);

  await maxAllowance({ account, chain, token });

  return await writeContract(chain, account, {
    contract,
    label,
    fn: "sell",
    args: [getPair(token), amount],
  });
};
