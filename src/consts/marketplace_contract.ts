import type { Chain } from "thirdweb";
import { polygonAmoy } from "./chains";

type MarketplaceContract = {
  address: string;
  chain: Chain;
};

/**
 * You need a marketplace contract on each of the chain you want to support
 * Only list one marketplace contract address for each chain
 */
export const MARKETPLACE_CONTRACTS: MarketplaceContract[] = [
  {
    address: "0x352530ED51a1a461b17E65229718337eEAF1F628",
    chain: polygonAmoy,
  }
];
