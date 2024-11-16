import type { Address, Chain } from "viem";
import { mantle, sepolia } from "viem/chains";

export const getPair = (chain: Chain, token: Address) => {
  switch (chain.name) {
    case mantle.name: {
      switch (token) {
        case "0x968B3aF609C392ff02a97CCb868AE334F10D4C77":
          return "0x89B10fe88a4bb6D4727cfE18ad6356A89BD2FE23";
      }

      break;
    }
    case sepolia.name: {
      switch (token) {
        case "0x":
          return "";
      }

      break;
    }
  }

  throw new Error("pair not found.");
};
