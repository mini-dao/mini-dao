import { createPublicClient, http, type Chain } from "viem";

export const getPublicClient = (chain: Chain) =>
  createPublicClient({
    chain,
    transport: http(),
  });
