import type { Address, Chain } from "viem";
import { mantleSepoliaTestnet, sepolia } from "viem/chains";

export const getPair = (chain: Chain, token: Address) => {
  switch (chain.id) {
    case mantleSepoliaTestnet.id: {
      switch (token) {
        // pepe
        case "0x7D0057299cc88ec1533eF43598769068e522DE29":
          return "0x14592Ea7110F66e3307746e91f6283DD6A08d3D7";
      }

      break;
    }
    case sepolia.id: {
      switch (token) {
        // pepe
        case "0x335F41Fd42Fc007c5259466b7632bF98725cD54e":
          return "0x656af7B2e976019e8f3aD7ec743132710252E24c";
      }

      break;
    }
  }

  throw new Error("pair not found.");
};
