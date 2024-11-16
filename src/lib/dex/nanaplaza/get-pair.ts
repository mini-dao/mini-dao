import type { Address, Chain } from "viem";
import { mantleSepoliaTestnet } from "viem/chains";

export const getPair = (chain: Chain, token: Address) => {
  switch (chain.name) {
    case mantleSepoliaTestnet.name: {
      switch (token) {
        // pepe
        case "0xAEAFBA08a4B79f08FAeccAE67804cF93FCD08AC1":
          return "0xE36e1E9796C7408C7a9a3BD35e6f32f42a3ca56d";
      }

      break;
    }
  }

  throw new Error("pair not found.");
};
