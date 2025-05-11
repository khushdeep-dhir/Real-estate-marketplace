import { useMarketplaceContext } from "@/hooks/useMarketplaceContext";
import { 
  Button, 
  useToast, 
  Box, 
  useColorModeValue,
  Tooltip
} from "@chakra-ui/react";
import { sendAndConfirmTransaction } from "thirdweb";
import { cancelListing } from "thirdweb/extensions/marketplace";
import {
  useActiveWalletChain,
  useSwitchActiveWalletChain,
} from "thirdweb/react";
import type { Account } from "thirdweb/wallets";
import { FaTimes } from "react-icons/fa";

type Props = {
  account: Account;
  listingId: bigint;
};

export default function CancelListingButton(props: Props) {
  const { marketplaceContract, refetchAllListings, nftContract } =
    useMarketplaceContext();
  const switchChain = useSwitchActiveWalletChain();
  const activeChain = useActiveWalletChain();
  const { account, listingId } = props;
  const toast = useToast();

  // Futuristic styling
  const buttonBg = useColorModeValue("red.400", "red.500");
  const buttonHoverBg = useColorModeValue("red.500", "red.600");
  const buttonActiveBg = useColorModeValue("red.600", "red.700");
  const glowColor = useColorModeValue("red.300", "red.400");

  return (
    <Tooltip label="Cancel this listing" placement="top">
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
          opacity: "0.4",
          borderRadius: "lg",
          filter: "blur(8px)",
          zIndex: -1,
          transition: "opacity 0.2s ease",
        }}
        _hover={{
          _before: {
            opacity: "0.7",
          }
        }}
      >
        <Button
          onClick={async () => {
            if (activeChain?.id !== nftContract.chain.id) {
              await switchChain(nftContract.chain);
            }
            const transaction = cancelListing({
              contract: marketplaceContract,
              listingId,
            });
            await sendAndConfirmTransaction({
              transaction,
              account,
            });
            toast({
              title: "Listing cancelled successfully",
              status: "success",
              duration: 3000,
              isClosable: true,
              position: "top",
              variant: "subtle",
            });
            refetchAllListings();
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
          leftIcon={<FaTimes />}
          backdropFilter="blur(8px)"
        >
          Cancel
        </Button>
      </Box>
    </Tooltip>
  );
}