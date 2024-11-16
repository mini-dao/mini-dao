import type { Account, Address, Chain } from "viem";
import { writeContract } from "../../curvegrid/write-contract";
import { maxAllowance } from "../../max-allowance";
import { getPair } from "./get-pair";
import { getRouter } from "./get-router";

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

  await writeContract(chain, account, {
    contract,
    label,
    fn: "sell",
    args: [getPair(chain, token), amount],
  });

  console.log("[nanaplaza]", "sell");
};
