import type { Address, Chain } from "viem";
import { mantleSepoliaTestnet, sepolia } from "viem/chains";

export const getPair = (chain: Chain, token: Address) => {
  switch (chain.id) {
    case mantleSepoliaTestnet.id: {
      switch (token) {
        // pepe
        case "0xAEAFBA08a4B79f08FAeccAE67804cF93FCD08AC1":
          return "0xE36e1E9796C7408C7a9a3BD35e6f32f42a3ca56d";
      }

      break;
    }
    case sepolia.id: {
      switch (token) {
        // pepe
        case "0x05Ad344b2fdE2596EDBA577E21DAfbB55D617c81":
          return "0xe0958213e1AAE9DDCa831edeF52698e19e5F161a";
      }

      break;
    }
  }

  throw new Error("pair not found.");
};
