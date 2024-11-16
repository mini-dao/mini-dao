import type { Chain } from "viem";
import { mantleSepoliaTestnet, sepolia } from "viem/chains";

export const getRouter = (chain: Chain) => {
  switch (chain.name) {
    case mantleSepoliaTestnet.name:
      // nanaplaza
      return {
        address: "0x8FF1CB6116f67f3C8277BA4fe4E879f5bd4Fa55B",
        contract: "minidao_mantle_sepolia_router",
        label: "minidao_mantle_sepolia_router11",
      } as const;
    // cowswap
    case sepolia.name:
      return {
        address: "0x9008D19f58AAbD9eD0D60971565AA8510560ab41",
        contract: "minidao_sepolia_router",
        label: "minidao_sepolia_router3",
      } as const;
  }

  throw new Error("dex not found.");
};
