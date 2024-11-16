import type { Chain } from "viem";
import { sepolia } from "viem/chains";

export const getWethToken = (chain: Chain) => {
  switch (chain.id) {
    case sepolia.id:
      return "0x9008D19f58AAbD9eD0D60971565AA8510560ab41";
  }

  throw new Error("weth token not found.");
};
