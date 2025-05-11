"use client";

import { ProfileSection } from "@/components/profile-page/Profile";
import { useResolveENSAddress } from "@/hooks/useResolveENSAddress";
import { Box, Text } from "@chakra-ui/react";
import { notFound } from "next/navigation";
import { isAddress } from "thirdweb/utils";

export default function PublicProfilePage({
  params,
}: {
  params: { addressOrENS: string };
}) {
  const { addressOrENS } = params;
  const hasValidWalletFormat = isAddress(addressOrENS);
  
  const { 
    data: resolvedWalletAddress, 
    isLoading: isResolvingENS 
  } = useResolveENSAddress({
    text: addressOrENS,
    enabled: !hasValidWalletFormat,
  });

  if (isResolvingENS) {
    return (
      <Box className="loading-container">
        <Text fontSize="md">Fetching wallet information...</Text>
      </Box>
    );
  }

  // Redirect to 404 if neither a valid address nor resolvable ENS
  if (!hasValidWalletFormat && !resolvedWalletAddress) {
    return notFound();
  }
  
  // Use the direct address or the one resolved from ENS
  const walletAddress = hasValidWalletFormat ? addressOrENS : resolvedWalletAddress!;
  
  return <ProfileSection address={walletAddress} />;
}