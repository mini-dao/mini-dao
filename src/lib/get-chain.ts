import { chains } from "./chains";

export const getChain = (chainId: number) => {
  const chain = chains.find((chain) => chain.id === chainId);

  if (!chain) {
    throw new Error("chain not found.");
  }

  return chain;
};
