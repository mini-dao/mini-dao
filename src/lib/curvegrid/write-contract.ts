import type { Account, Address, Chain, Hex } from "viem";
import { createContractsApi } from "../../multibaas";
import { getPublicClient } from "../get-public-client";
import { getWalletClient } from "../get-wallet-client";

export const writeContract = async (
  chain: Chain,
  account: Account,
  {
    contract,
    label,
    fn,
    value,
    args,
  }: {
    contract: string;
    label: string;
    fn: string;
    value?: string;
    args?: any[];
  }
) => {
  const walletClient = getWalletClient(chain, account);

  const publicClient = getPublicClient(chain);

  const {
    data: { result },
  } = await createContractsApi(chain)
    .callContractFunction("ethereum", label, contract, fn, {
      from: walletClient.account.address,
      value,
      args,
    })
    .catch((error) => Promise.reject(new Error("error writing contract.")));

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
