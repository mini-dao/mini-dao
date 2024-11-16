import { Configuration, ContractsApi } from "@curvegrid/multibaas-sdk";
import type { Chain } from "viem";
import { mantleSepoliaTestnet, sepolia } from "viem/chains";
import { config } from "./config";

const createConfiguration = (chain: Chain) => {
  switch (chain.name) {
    case mantleSepoliaTestnet.name:
      return new Configuration({
        basePath: config.multibaas.mantleSepolia.basePath,
        accessToken: config.multibaas.mantleSepolia.key,
      });
    case sepolia.name:
      return new Configuration({
        basePath: config.multibaas.sepolia.basePath,
        accessToken: config.multibaas.sepolia.key,
      });
  }
};

export const createContractsApi = (chain: Chain) =>
  new ContractsApi(createConfiguration(chain));
