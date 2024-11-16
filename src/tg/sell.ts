import type { Account, Address, Chain } from "viem";
import { mantle, sepolia } from "viem/chains";
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

  const { fn, args } = (() => {
    switch (chain.name) {
      case mantle.name:
        return {
          fn: "sell",
          args: [getPair(chain, token), amount],
        };
      case sepolia.name:
        return {
          fn: "",
          args: [],
        };
    }

    throw new Error("dex not found.");
  })();

  return await writeContract(chain, account, {
    contract,
    label,
    fn,
    args,
  });
};
