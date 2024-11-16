import type { Account, Address, Chain } from "viem";
import { writeContract } from "../../curvegrid/write-contract";
import { getPair } from "./get-pair";
import { getRouter } from "./get-router";

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

  console.log("writeContract");

  await writeContract(chain, account, {
    contract,
    label,
    fn: "buy",
    value: amount,
    args: [getPair(chain, token)],
  });

  console.log("[nanaplaza]", "buy");
};
