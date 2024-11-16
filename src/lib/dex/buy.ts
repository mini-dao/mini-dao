import type { Account, Address, Chain } from "viem";
import { mantleSepoliaTestnet, sepolia } from "viem/chains";
// import * as cowswap from "./cowswap";
import * as nanaplaza from "./nanaplaza";

export const buy = (params: {
  account: Account;
  chain: Chain;
  token: Address;
  amount: string;
}) => {
  switch (params.chain.id) {
    case mantleSepoliaTestnet.id:
      return nanaplaza.buy(params);
    case sepolia.id:
      return nanaplaza.buy(params);
  }
};
