import type { Account, Address, Chain } from "viem";
import { mantle, sepolia } from "viem/chains";
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
  token: Address;
  amount: string;
}) => {
  const { contract, label } = getRouter(chain);

  const { fn, args } = (() => {
    switch (chain.name) {
      case mantle.name:
        return {
          fn: "buy",
          args: [getPair(chain, token)],
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
    value: amount,
    args,
  });
};
