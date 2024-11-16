import type { Chain } from "viem";
import { mantle, sepolia } from "viem/chains";

export const getRouter = (chain: Chain) => {
  switch (chain.name) {
    case mantle.name:
      // nanaplaza
      return {
        address: "0x600E54Bc329169eA6ba44B98D5d50fF20800825c",
        contract: "minidao_mantle_router",
        label: "minidao_mantle_router5",
      } as const;
    // cowswap
    case sepolia.name:
      return {
        address: "0x9008D19f58AAbD9eD0D60971565AA8510560ab41",
        contract: "minidao_sepolia_router",
        label: "minidao_sepolia_router1",
      } as const;
  }

  throw new Error("dex not found.");
};
