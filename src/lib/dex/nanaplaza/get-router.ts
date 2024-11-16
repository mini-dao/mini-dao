import type { Chain } from "viem";
import { mantleSepoliaTestnet, sepolia } from "viem/chains";

export const getRouter = (chain: Chain) => {
  switch (chain.id) {
    case mantleSepoliaTestnet.id:
      return {
        address: "0x7260Fa6a6F79a155C3930E9CBb64fB4ce343B88c",
        contract: "minidao_mantle_sepolia_router",
        label: "minidao_mantle_sepolia_router12",
      } as const;
    case sepolia.id:
      return {
        address: "0xfD1C7DA458FfEd7497d1212d221b885Df4A57248",
        contract: "minidao_sepolia_router",
        label: "minidao_sepolia_router2",
      } as const;
  }

  throw new Error("router not found.");
};
