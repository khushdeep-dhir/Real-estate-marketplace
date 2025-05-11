import { client } from "@/consts/client";
import { useMarketplaceContext } from "@/hooks/useMarketplaceContext";
import { 
  Button, 
  useToast, 
  Box, 
  useColorModeValue,
  Tooltip
} from "@chakra-ui/react";
import {
  type Hex,
  NATIVE_TOKEN_ADDRESS,
  getContract,
  sendAndConfirmTransaction,
  sendTransaction,
  toTokens,
  waitForReceipt,
} from "thirdweb";
import { allowance, approve, decimals } from "thirdweb/extensions/erc20";
import {
  type DirectListing,
  buyFromListing,
} from "thirdweb/extensions/marketplace";
import {
  useActiveWalletChain,
  useSwitchActiveWalletChain,
} from "thirdweb/react";
import type { Account } from "thirdweb/wallets";
import { FaShoppingCart } from "react-icons/fa";

type Props = {
  listing: DirectListing;
  account: Account;
};

export default function BuyFromListingButton(props: Props) {
  const { account, listing } = props;
  const { marketplaceContract, refetchAllListings, nftContract } =
    useMarketplaceContext();
  const switchChain = useSwitchActiveWalletChain();
  const activeChain = useActiveWalletChain();
  const toast = useToast();
  
  // Futuristic styling
  const buttonBg = useColorModeValue("blue.400", "blue.500");
  const buttonHoverBg = useColorModeValue("blue.500", "blue.600");
  const buttonActiveBg = useColorModeValue("blue.600", "blue.700");
  const glowColor = useColorModeValue("blue.300", "blue.400");

  return (
    <Tooltip label={`Buy for ${listing.currencyValuePerToken.displayValue} ${listing.currencyValuePerToken.symbol}`} placement="top">
      <Box
        position="relative"
        _before={{
          content: '""',
          position: "absolute",
          top: "-2px",
          left: "-2px",
          right: "-2px",
          bottom: "-2px",
          bg: glowColor,
          opacity: "0.5",
          borderRadius: "lg",
          filter: "blur(8px)",
          zIndex: -1,
          transition: "opacity 0.2s ease",
        }}
        _hover={{
          _before: {
            opacity: "0.8",
          }
        }}
      >
        <Button
          onClick={async () => {
            if (activeChain?.id !== nftContract.chain.id) {
              await switchChain(nftContract.chain);
            }
            try {
              if (
                listing.currencyContractAddress.toLowerCase() !==
                NATIVE_TOKEN_ADDRESS.toLowerCase()
              ) {
                const customTokenContract = getContract({
                  address: listing.currencyContractAddress as Hex,
                  client,
                  chain: nftContract.chain,
                });
                const result = await allowance({
                  contract: customTokenContract,
                  owner: account.address,
                  spender: marketplaceContract.address as Hex,
                });

                if (result < listing?.pricePerToken) {
                  const _decimals = await decimals({
                    contract: customTokenContract,
                  });
                  const transaction = approve({
                    contract: customTokenContract,
                    spender: marketplaceContract.address as Hex,
                    amount: toTokens(listing?.pricePerToken, _decimals),
                  });
                  await sendAndConfirmTransaction({ transaction, account });
                }
              }

              const transaction = buyFromListing({
                contract: marketplaceContract,
                listingId: listing.id,
                quantity: listing.quantity,
                recipient: account.address,
              });
              console.log(transaction);
              const receipt = await sendTransaction({
                transaction,
                account,
              });
              await waitForReceipt({
                transactionHash: receipt.transactionHash,
                client,
                chain: nftContract.chain,
              });
              toast({
                title:
                  "Purchase completed! The asset(s) should arrive in your account shortly",
                status: "success",
                duration: 4000,
                isClosable: true,
                position: "top",
                variant: "subtle",
              });
              refetchAllListings();
            } catch (err) {
              console.error(err);
              if ((err as Error).message.startsWith("insufficient funds for gas")) {
                toast({
                  title: "You don't have enough funds for this purchase.",
                  description: `Make sure you have enough gas for the transaction + ${listing.currencyValuePerToken.displayValue} ${listing.currencyValuePerToken.symbol}`,
                  status: "error",
                  isClosable: true,
                  duration: 7000,
                  position: "top",
                  variant: "subtle",
                });
              }
            }
          }}
          bg={buttonBg}
          color="white"
          _hover={{
            bg: buttonHoverBg,
            transform: "translateY(-2px)",
            boxShadow: "lg"
          }}
          _active={{
            bg: buttonActiveBg,
            transform: "translateY(0)",
          }}
          borderRadius="lg"
          px={6}
          py={2}
          fontWeight="medium"
          letterSpacing="wide"
          transition="all 0.2s"
          leftIcon={<FaShoppingCart />}
          backdropFilter="blur(8px)"
        >
          Buy
        </Button>
      </Box>
    </Tooltip>
  );
}