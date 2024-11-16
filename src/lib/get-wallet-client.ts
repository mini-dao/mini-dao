import { createWalletClient, http, type Account, type Chain } from "viem";

export const getWalletClient = (chain: Chain, account: Account) =>
  createWalletClient({
    chain,
    account,
    transport: http(),
  });
