import { Configuration, ContractsApi } from "@curvegrid/multibaas-sdk";
import { config } from "./config";

const configuration = new Configuration({
  basePath: config.multibaasBasePath,
  accessToken: config.multibaasKey,
});

export const contractsApi = new ContractsApi(configuration);
