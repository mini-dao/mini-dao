import type { Chain } from "viem";

export const getRouter = (chain: Chain) => {
  switch (chain.name) {
    case "mantle":
      return {
        address: "0x600E54Bc329169eA6ba44B98D5d50fF20800825c",
        contract: "minidao_mantle_router",
        label: "minidao_mantle_router5",
      } as const;
  }

  throw new Error("router not found.");
};
