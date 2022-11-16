import { Goerli } from "@usedapp/core";

export const ROUTER_ADDRESS = "0x13AECfE4c72736DB0d1DbcA3c76A1B2c2C1f64BC"; 

export const DAPP_CONFIG = {
  readOnlyChainId: Goerli.chainId,
  readOnlyUrls: {
    [Goerli.chainId]: "https://eth-goerli.g.alchemy.com/v2/kMvyOtr1-n6LlLIBZnLtasxo-cUxJIyd",
  },
};