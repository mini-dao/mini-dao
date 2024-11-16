import type { Account, Address, Chain, Hex } from "viem";
import { contractsApi } from "../multibaas";
import { getPublicClient } from "./get-public-client";
import { getWalletClient } from "./get-wallet-client";

export const writeContract = async (
  chain: Chain,
  account: Account,
  { contract, fn, args }: { contract: string; fn: string; args?: any[] }
) => {
  const walletClient = getWalletClient(chain, account);

  const publicClient = getPublicClient(chain);

  const {
    data: { result },
  } = await contractsApi
    .callContractFunction("ethereum", contract, contract, fn, {
      args,
      from: walletClient.account.address,
    })
    .catch((error) => Promise.reject(error));

  if (result.kind !== "TransactionToSignResponse") {
    throw new Error("not a transaction to sign.");
  }

  const hash = await walletClient.sendTransaction({
    to: result.tx.to as Address | null | undefined,
    value: BigInt(result.tx.value),
    gas: BigInt(result.tx.gas),
    maxFeePerGas: result.tx.gasFeeCap ? BigInt(result.tx.gasFeeCap) : undefined,
    data: result.tx.data as Hex,
  });

  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  if (receipt.status !== "success") {
    throw new Error('transaction status not "success".');
  }

  return receipt;
};
