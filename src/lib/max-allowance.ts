import {
  erc20Abi,
  maxUint256,
  type Account,
  type Address,
  type Chain,
} from "viem";
import { getRouter } from "./dex/nanaplaza/get-router";
import { getPublicClient } from "./get-public-client";
import { getWalletClient } from "./get-wallet-client";

export const maxAllowance = async ({
  account,
  chain,
  token,
}: {
  account: Account;
  chain: Chain;
  token: Address;
}) => {
  const publicClient = getPublicClient(chain);

  const router = getRouter(chain);

  const allowance = await publicClient.readContract({
    abi: erc20Abi,
    address: token,
    functionName: "allowance",
    args: [account.address, router.address],
  });
  console.log("🚀 ~ allowance:", allowance);

  if (!allowance) {
    const walletClient = getWalletClient(chain, account);

    const hash = await walletClient.writeContract({
      abi: erc20Abi,
      address: token,
      functionName: "approve",
      args: [router.address, maxUint256],
    });

    await publicClient.waitForTransactionReceipt({ hash });
  }
};
