import { contractsApi } from "../multibaas";

export const readContract = async ({
  contract,
  label,
  fn,
}: {
  contract: string;
  label: string;
  fn: string;
}) => {
  const {
    data: { result },
  } = await contractsApi
    .callContractFunction("ethereum", label, contract, fn, {})
    .catch((error) => Promise.reject(error));

  if (result.kind !== "MethodCallResponse") {
    throw new Error("not a view transaction.");
  }

  return result.output;
};
