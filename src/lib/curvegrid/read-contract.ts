import type { Chain } from "viem";
import { createContractsApi } from "../../multibaas";

export const readContract = async (
  chain: Chain,
  {
    contract,
    label,
    fn,
  }: {
    contract: string;
    label: string;
    fn: string;
  }
) => {
  const {
    data: { result },
  } = await createContractsApi(chain)
    .callContractFunction("ethereum", label, contract, fn, {})
    .catch((error) => Promise.reject(new Error("error reading contract.")));

  if (result.kind !== "MethodCallResponse") {
    throw new Error("not a view transaction.");
  }

  return result.output;
};
