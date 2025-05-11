import type { Chain } from "thirdweb";
import { polygonAmoy } from "./chains";

export type NftContract = {
  address: string;
  chain: Chain;
  type: "ERC1155" | "ERC721";

  title?: string;
  description?: string;
  thumbnailUrl?: string;
  slug?: string;
};

export const NFT_CONTRACTS: NftContract[] = [
  {
    address: "0x41cB65f892404F9EA5E173394299d285FA7F6005",
    chain: polygonAmoy,
    title: "ERC721 Listings",
    thumbnailUrl:
      "https://258c828e8cc853bf5e0efd001055fb39.ipfscdn.io/ipfs/bafybeidec7x6bptqmrxgptaedd7wfwxbsccqfogzwfsd4a7duxn4sdmnxy/0.png",
    type: "ERC721",
  }
];


