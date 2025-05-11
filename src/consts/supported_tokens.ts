import type { Chain } from "thirdweb";
import { polygonAmoy } from "./chains";

export type Token = {
  tokenAddress: string;
  symbol: string;
  icon: string;
};

export type SupportedTokens = {
  chain: Chain;
  tokens: Token[];
};

/**
 * By default you create listings with the payment currency in the native token of the network (eth, avax, matic etc.)
 *
 * If you want to allow users to transact using different ERC20 tokens, you can add them to the config below
 * Keep in mind this is for front-end usage. Make sure your marketplace v3 contracts accept the ERC20s
 * check that in https://thirdweb.com/<chain-id>/<marketplace-v3-address>/permissions -> Asset
 * By default the Marketplace V3 contract supports any asset (token)
 */
export const SUPPORTED_TOKENS: SupportedTokens[] = [
  {
    chain: polygonAmoy,
    tokens: [
      {
        tokenAddress: "0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582",
        symbol: "USDC",
        icon: "/erc20-icons/usdc.png",
      },
      {
        tokenAddress: "0xbcf39d8616d15fd146dd5db4a86b4f244a9bc772",
        symbol: "USDT",
        icon: "/erc20-icons/usdt.png",
      },
    ],
  }
];

export const NATIVE_TOKEN_ICON_MAP: { [key in Chain["id"]]: string } = {
  1: "/native-token-icons/eth.png",
  [polygonAmoy.id]: "/native-token-icons/matic.png",
};
