import type { Chain } from "viem";
import { mantleSepoliaTestnet } from "viem/chains";

export const getRouter = (chain: Chain) => {
  switch (chain.id) {
    case mantleSepoliaTestnet.id:
      return {
        address: "0x8FF1CB6116f67f3C8277BA4fe4E879f5bd4Fa55B",
        contract: "minidao_mantle_sepolia_router",
        label: "minidao_mantle_sepolia_router11",
      } as const;
  }

  throw new Error("router not found.");
};
