import type { Chain } from "viem";

export const getRouter = (chain: Chain) => {
  switch (chain.name) {
    case "mantle":
      return {
        contract: "minidao_mantle_router",
        label: "minidao_mantle_router5",
      };
  }

  throw new Error("router not found.");
};
