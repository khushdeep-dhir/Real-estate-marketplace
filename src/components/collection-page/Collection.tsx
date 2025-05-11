import { MediaRenderer, useReadContract } from "thirdweb/react";
import { getNFT as getNFT721 } from "thirdweb/extensions/erc721";
import { getNFT as getNFT1155 } from "thirdweb/extensions/erc1155";
import { client } from "@/consts/client";
import { 
  Box, 
  Flex, 
  Heading, 
  Tab, 
  TabList, 
  TabPanel, 
  TabPanels, 
  Tabs, 
  Text,
  Container,
  useColorModeValue,
  Badge,
  Icon,
  HStack,
  Divider
} from "@chakra-ui/react";
import { useState } from "react";
import { useMarketplaceContext } from "@/hooks/useMarketplaceContext";
import { ListingGrid } from "./ListingGrid";
import { AllNftsGrid } from "./AllNftsGrid";
import { FaInfoCircle, FaEthereum } from "react-icons/fa";

export function Collection() {
  // State for tracking active tab (0=Listings, 1=All Items)
  const [tabIndex, setTabIndex] = useState<number>(0);
  
  // Extract data from marketplace context
  const {
    type,
    nftContract,
    isLoading,
    contractMetadata,
    listingsInSelectedCollection,
    supplyInfo,
  } = useMarketplaceContext();

  // Fetch first NFT in collection for fallback thumbnail
  const { 
    data: firstNFT, 
    isLoading: isLoadingFirstNFT 
  } = useReadContract(
    type === "ERC1155" ? getNFT1155 : getNFT721,
    {
      contract: nftContract,
      tokenId: 0n,
      queryOptions: {
        // Only fetch if we need a fallback image
        enabled: isLoading || !!contractMetadata?.image,
      },
    }
  );

  // Determine which image to use as the collection thumbnail
  const thumbnailImage = contractMetadata?.image || firstNFT?.metadata.image || "";
  
  // Calculate total supply if available
  const totalSupply = supplyInfo 
    ? (supplyInfo.endTokenId - supplyInfo.startTokenId + 1n).toString()
    : "";
    
  // Colors for futuristic theme
  const bgGradient = useColorModeValue(
    "linear(to-br, purple.400, blue.500, cyan.400)",
    "linear(to-br, purple.600, blue.700, cyan.600)"
  );
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const accentColor = useColorModeValue("blue.500", "blue.300");
  const tabBg = useColorModeValue("whiteAlpha.800", "blackAlpha.600");
  const dividerColor = useColorModeValue("gray.200", "gray.700");
  
  // Custom tab styles
  const customTabStyles = {
    _selected: {
      color: "white",
      bg: accentColor,
      fontWeight: "semibold",
      transform: "translateY(-2px)",
      boxShadow: "md",
    },
    borderRadius: "full",
    fontWeight: "medium",
    transition: "all 0.2s",
    px: 6,
    py: 2,
  };

  return (
    <Container maxW="container.xl" py={8}>
      {/* Header with Gradient Background */}
      <Box 
        bgGradient={bgGradient}
        borderRadius="xl"
        p={8}
        mb={10}
        color="white"
        boxShadow="xl"
        position="relative"
        overflow="hidden"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bg: "radial-gradient(circle at 20% 150%, whiteAlpha.100 0%, transparent 40%)",
          zIndex: 0
        }}
      >
        <Flex 
          direction="column" 
          gap={6}
          position="relative"
          zIndex={1}
          align="center"
        >
          {/* Collection thumbnail with enhanced styling */}
          <Box
            position="relative"
            borderRadius="full"
            overflow="hidden"
            boxShadow="2xl"
            border="4px solid"
            borderColor="whiteAlpha.300"
            w="220px"
            h="220px"
            _after={{
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bg: "linear-gradient(to bottom right, whiteAlpha.200, transparent)",
              zIndex: 1,
              pointerEvents: "none"
            }}
          >
            <MediaRenderer
              client={client}
              src={thumbnailImage}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>
          
          {/* Collection metadata */}
          <Flex direction="column" align="center" spacing={3}>
            <Badge 
              colorScheme="purple" 
              fontSize="md" 
              p={2} 
              borderRadius="full"
              mb={2}
              px={4}
              textTransform="uppercase"
              letterSpacing="wider"
              boxShadow="0 0 15px rgba(128, 90, 213, 0.6)"
            >
              {type === "ERC1155" ? "ERC-1155" : "ERC-721"}
            </Badge>
            
            {/* Collection name */}
            <Heading 
              fontSize={{ base: "3xl", md: "4xl" }}
              bgGradient="linear(to-r, cyan.300, purple.100, blue.300)"
              bgClip="text"
              textAlign="center"
              mb={3}
              fontWeight="extrabold"
            >
              {contractMetadata?.name || "Unknown Collection"}
            </Heading>
            
            {/* Collection info */}
            <HStack spacing={4} mb={3}>
              <Flex align="center" gap={1}>
                <Icon as={FaEthereum} />
                <Text fontWeight="medium">Chain: {nftContract.chain.name}</Text>
              </Flex>
              
              <Text fontWeight="medium" color="whiteAlpha.900">
                Items: {totalSupply || "Loading..."}
              </Text>
            </HStack>
            
            {/* Collection description if available */}
            {contractMetadata?.description && (
              <Text
                maxW={{ lg: "700px", base: "100%" }}
                mx="auto"
                textAlign="center"
                color="whiteAlpha.900"
                fontSize="md"
                lineHeight="1.6"
                bg="blackAlpha.300"
                p={4}
                borderRadius="lg"
                backdropFilter="blur(8px)"
              >
                {contractMetadata.description}
              </Text>
            )}
          </Flex>
          
          {/* Enhanced Tab Navigation */}
          <Box 
            mt={6} 
            bg={tabBg} 
            borderRadius="full" 
            p={1.5}
            boxShadow="lg"
            backdropFilter="blur(10px)"
            width="fit-content"
          >
            <Tabs
              variant="unstyled"
              onChange={(index) => setTabIndex(index)}
              isLazy
              defaultIndex={0}
              width="100%"
            >
              <TabList gap={2}>
                <Tab {...customTabStyles}>
                  Listings ({listingsInSelectedCollection.length || 0})
                </Tab>
                <Tab {...customTabStyles}>
                  All Items{totalSupply ? ` (${totalSupply})` : ""}
                </Tab>
              </TabList>
            </Tabs>
          </Box>
        </Flex>
      </Box>
      
      {/* Floating card for content */}
      <Box
        bg={cardBg}
        borderRadius="xl"
        boxShadow="xl"
        p={6}
        mt={-16}
        borderWidth="1px"
        borderColor={dividerColor}
        position="relative"
        zIndex={1}
        overflow="hidden"
        _before={{
          content: '""',
          position: "absolute",
          top: "-50%",
          left: "-10%",
          width: "120%",
          height: "200%",
          bg: "radial-gradient(ellipse at top, rgba(66, 153, 225, 0.1) 0%, transparent 70%)",
          zIndex: 0,
          pointerEvents: "none"
        }}
      >
        {/* Content based on selected tab */}
        <Box mt={6} position="relative" zIndex={1}>
          {tabIndex === 0 && <ListingGrid />}
          {tabIndex === 1 && <AllNftsGrid />}
        </Box>
      </Box>
    </Container>
  );
}