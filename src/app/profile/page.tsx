"use client";

import { ProfileSection } from "@/components/profile-page/Profile";
import { client } from "@/consts/client";
import { Box, Flex, Heading } from "@chakra-ui/react";
import { useEffect } from "react";
import { useActiveAccount, useConnectModal } from "thirdweb/react";

export default function DashboardUserProfile() {
  const walletConnection = useActiveAccount();
  const { connect: openWalletConnectionModal } = useConnectModal();
  
  useEffect(() => {
    // Prompt wallet connection if user isn't authenticated
    if (!walletConnection) {
      openWalletConnectionModal({ client });
    }
  }, [walletConnection, openWalletConnectionModal]);
  
  // Display login message when no wallet is connected
  if (!walletConnection) {
    return (
      <Box p={4} minHeight="60vh">
        <Flex height="100%" alignItems="center" justifyContent="center">
          <Heading size="lg" fontWeight="medium">Please connect to continue</Heading>
        </Flex>
      </Box>
    );
  }
  
  // Render the profile when wallet is connected
  return <ProfileSection address={walletConnection.address} />;
}