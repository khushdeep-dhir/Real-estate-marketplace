import { client } from "@/consts/client";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Heading,
  Link,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Badge,
  Icon,
  HStack,
  VStack,
  Divider,
  Container,
  Tooltip,
  Skeleton,
  SkeletonText
} from "@chakra-ui/react";
import { FaExternalLinkAlt, FaEthereum, FaClock, FaUser, FaTag, FaLayerGroup } from "react-icons/fa";
import { balanceOf, getNFT as getERC1155 } from "thirdweb/extensions/erc1155";
import { getNFT as getERC721 } from "thirdweb/extensions/erc721";
import {
  MediaRenderer,
  useActiveAccount,
  useReadContract,
} from "thirdweb/react";
import { shortenAddress } from "thirdweb/utils";
import { NftAttributes } from "./NftAttributes";
import { CreateListing } from "./CreateListing";
import { useMarketplaceContext } from "@/hooks/useMarketplaceContext";
import dynamic from "next/dynamic";
import { NftDetails } from "./NftDetails";
import RelatedListings from "./RelatedListings";

const CancelListingButton = dynamic(() => import("./CancelListingButton"), {
  ssr: false,
});
const BuyFromListingButton = dynamic(() => import("./BuyFromListingButton"), {
  ssr: false,
});

type Props = {
  tokenId: bigint;
};

export function Token(props: Props) {
  const {
    type,
    nftContract,
    allAuctions,
    isLoading,
    contractMetadata,
    isRefetchingAllListings,
    listingsInSelectedCollection,
  } = useMarketplaceContext();
  const { tokenId } = props;
  const account = useActiveAccount();

  const { data: nft, isLoading: isLoadingNFT } = useReadContract(
    type === "ERC1155" ? getERC1155 : getERC721,
    {
      tokenId: BigInt(tokenId),
      contract: nftContract,
      includeOwner: true,
    }
  );

  const { data: ownedQuantity1155 } = useReadContract(balanceOf, {
    contract: nftContract,
    owner: account?.address!,
    tokenId: tokenId,
    queryOptions: {
      enabled: !!account?.address && type === "ERC1155",
    },
  });

  const listings = (listingsInSelectedCollection || []).filter(
    (item) =>
      item.assetContractAddress.toLowerCase() ===
        nftContract.address.toLowerCase() && item.asset.id === BigInt(tokenId)
  );

  const auctions = (allAuctions || []).filter(
    (item) =>
      item.assetContractAddress.toLowerCase() ===
        nftContract.address.toLowerCase() && item.asset.id === BigInt(tokenId)
  );

  const allLoaded = !isLoadingNFT && !isLoading && !isRefetchingAllListings;
  const ownedByYou = nft?.owner?.toLowerCase() === account?.address.toLowerCase();
  
  // Futuristic styling
  const bgGradient = useColorModeValue(
    "linear(to-br, purple.50, blue.50, cyan.50)",
    "linear(to-br, gray.900, blue.900, gray.900)"
  );
  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.200", "gray.700");
  const cardHoverBorder = useColorModeValue("blue.300", "blue.500");
  const headingColor = useColorModeValue("gray.800", "white");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const accentColor = useColorModeValue("blue.500", "blue.300");
  const tableBg = useColorModeValue("white", "gray.800");
  const tableHeaderBg = useColorModeValue("gray.50", "gray.700");
  const tableRowHoverBg = useColorModeValue("blue.50", "blue.900");

  return (
    <Box
      bgGradient={bgGradient}
      minH="100vh"
      py={8}
      px={{base: 4, md: 0}}
    >
      <Container maxW="container.xl">
        <Box 
          mt={8} 
          borderRadius="xl" 
          overflow="hidden"
          boxShadow="xl"
          bg={cardBg}
          borderWidth="1px"
          borderColor={cardBorder}
          p={{base: 4, md: 6}}
        >
          <Flex
            direction={{ lg: "row", base: "column" }}
            justifyContent={{ lg: "space-between", base: "space-between" }}
            gap={{ lg: 12, base: 8 }}
          >
            {/* Left Column - NFT Image & Accordion */}
            <Flex 
              direction="column" 
              w={{ lg: "50%", base: "100%" }} 
              gap={6}
            >
              {/* NFT Image with Glow Effect */}
              <Box 
                position="relative" 
                borderRadius="xl" 
                overflow="hidden"
                boxShadow="xl"
                _after={{
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  bg: "linear-gradient(to bottom right, whiteAlpha.300, transparent)",
                  pointerEvents: "none",
                  zIndex: 1
                }}
              >
                {isLoadingNFT ? (
                  <Skeleton height="400px" width="100%" />
                ) : (
                  <MediaRenderer
                    client={client}
                    src={nft?.metadata.image}
                    style={{ 
                      width: "100%", 
                      height: "auto", 
                      aspectRatio: "1",
                      objectFit: "cover", 
                    }}
                  />
                )}
              </Box>
              
              {/* NFT Information Accordion */}
              <Accordion 
                allowMultiple 
                defaultIndex={[0, 1, 2]}
                borderWidth="1px"
                borderColor={cardBorder}
                borderRadius="lg"
                boxShadow="sm"
              >
                {nft?.metadata.description && (
                  <AccordionItem borderTopWidth="0px" borderBottomWidth="1px" borderColor={cardBorder}>
                    <AccordionButton py={4}>
                      <Box as="span" flex="1" textAlign="left" fontWeight="medium" display="flex" alignItems="center">
                        <Icon as={FaTag} color={accentColor} mr={2} />
                        Description
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={6} pt={2}>
                      <Text color={textColor} fontSize="md" lineHeight="tall">
                        {nft.metadata.description}
                      </Text>
                    </AccordionPanel>
                  </AccordionItem>
                )}

                {nft?.metadata?.attributes &&
                  // @ts-ignore TODO Fix later
                  nft?.metadata?.attributes.length > 0 && (
                    <NftAttributes attributes={nft.metadata.attributes} />
                  )}

                {nft && <NftDetails nft={nft} />}
              </Accordion>
            </Flex>
            
            {/* Right Column - Collection Info, Owner, Listings */}
            <Flex 
              direction="column" 
              w={{ lg: "50%", base: "100%" }}
              gap={6}
            >
              {/* Collection Information */}
              <Box>
                <Flex align="center" mb={2}>
                  <Text color={textColor} fontSize="sm" fontWeight="medium">
                    Collection
                  </Text>
                  <Badge 
                    ml={2} 
                    colorScheme="purple" 
                    borderRadius="full" 
                    px={2}
                    fontSize="xs"
                  >
                    {type}
                  </Badge>
                </Flex>
                
                <Flex 
                  direction="row" 
                  align="center" 
                  justify="space-between"
                  mb={4}
                >
                  <Heading 
                    color={headingColor} 
                    size="lg"
                    bgGradient="linear(to-r, purple.400, blue.500)"
                    bgClip="text"
                    fontWeight="bold"
                  >
                    {contractMetadata?.name || "Loading..."}
                  </Heading>
                  <Tooltip label="View collection">
                    <Link
                      color={accentColor}
                      href={`/collection/${nftContract.chain.id}/${nftContract.address}`}
                      _hover={{
                        color: useColorModeValue("blue.600", "blue.200"),
                        transform: "scale(1.1)"
                      }}
                      transition="all 0.2s"
                    >
                      <Icon as={FaExternalLinkAlt} boxSize={5} />
                    </Link>
                  </Tooltip>
                </Flex>
                
                <Divider mb={4} borderColor={cardBorder} />
                
                {/* Token ID and Name */}
                <Flex align="center" mb={1}>
                  <Badge 
                    colorScheme="blue" 
                    fontSize="md" 
                    px={3} 
                    py={1} 
                    borderRadius="full"
                  >
                    #{nft?.id.toString() || "Loading..."}
                  </Badge>
                </Flex>
                
                <Heading 
                  size="xl" 
                  mb={6}
                  color={headingColor}
                >
                  {nft?.metadata.name || "Loading..."}
                </Heading>
                
                {/* Ownership Information */}
                <Box 
                  p={4} 
                  bg={useColorModeValue("gray.50", "gray.700")} 
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor={cardBorder}
                  mb={6}
                >
                  {type === "ERC1155" ? (
                    <>
                      {account && ownedQuantity1155 && (
                        <VStack align="start" spacing={1}>
                          <Text color={textColor} fontSize="sm">
                            Your Balance
                          </Text>
                          <Flex align="center">
                            <Icon as={FaLayerGroup} color={accentColor} mr={2} />
                            <Heading size="md" color={headingColor}>
                              {ownedQuantity1155.toString()} units
                            </Heading>
                          </Flex>
                        </VStack>
                      )}
                    </>
                  ) : (
                    <>
                      <VStack align="start" spacing={1}>
                        <Text color={textColor} fontSize="sm">
                          Current Owner
                        </Text>
                        <Flex align="center">
                          <Icon as={FaUser} color={accentColor} mr={2} />
                          <Heading size="md" color={headingColor}>
                            {nft?.owner ? shortenAddress(nft.owner) : "N/A"}{" "}
                          </Heading>
                          {ownedByYou && (
                            <Badge ml={2} colorScheme="green">
                              You
                            </Badge>
                          )}
                        </Flex>
                      </VStack>
                    </>
                  )}
                </Box>
                
                {/* Create Listing Button Section */}
                {account &&
                  nft &&
                  (ownedByYou || (ownedQuantity1155 && ownedQuantity1155 > 0n)) && (
                    <Box 
                      mb={6}
                      p={4}
                      borderWidth="1px"
                      borderStyle="dashed"
                      borderColor={cardHoverBorder}
                      borderRadius="lg"
                      bg={useColorModeValue("blue.50", "blue.900")}
                    >
                      <CreateListing tokenId={nft?.id} account={account} />
                    </Box>
                )}
                
                {/* Listings and Related Items */}
                <Accordion
                  mt={4}
                  defaultIndex={[0, 1]}
                  allowMultiple
                >
                  <AccordionItem 
                    borderWidth="1px" 
                    borderColor={cardBorder} 
                    borderRadius="lg"
                    mb={4}
                    overflow="hidden"
                  >
                    <AccordionButton 
                      py={4}
                      bg={tableHeaderBg}
                    >
                      <Flex align="center" flex="1" textAlign="left">
                        <Icon as={FaTag} color={accentColor} mr={2} />
                        <Text fontWeight="medium">Listings</Text>
                        <Badge 
                          ml={2} 
                          colorScheme="blue" 
                          borderRadius="full"
                        >
                          {listings.length}
                        </Badge>
                      </Flex>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel p={0}>
                      {listings.length > 0 ? (
                        <TableContainer>
                          <Table variant="simple">
                            <Thead bg={tableHeaderBg}>
                              <Tr>
                                <Th borderBottomColor={cardBorder}>Price</Th>
                                {type === "ERC1155" && <Th borderBottomColor={cardBorder} px={1}>Qty</Th>}
                                <Th borderBottomColor={cardBorder}>Expiration</Th>
                                <Th borderBottomColor={cardBorder} px={1}>From</Th>
                                <Th borderBottomColor={cardBorder}>{""}</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {listings.map((item) => {
                                const listedByYou =
                                  item.creatorAddress.toLowerCase() ===
                                  account?.address.toLowerCase();
                                return (
                                  <Tr 
                                    key={item.id.toString()}
                                    _hover={{ bg: tableRowHoverBg }}
                                    transition="background 0.2s"
                                  >
                                    <Td borderBottomColor={cardBorder}>
                                      <HStack spacing={1}>
                                        <Icon as={FaEthereum} color={accentColor} />
                                        <Text fontWeight="bold">
                                          {item.currencyValuePerToken.displayValue}{" "}
                                          <Text as="span" fontSize="xs" color={textColor}>
                                            {item.currencyValuePerToken.symbol}
                                          </Text>
                                        </Text>
                                      </HStack>
                                    </Td>
                                    {type === "ERC1155" && (
                                      <Td borderBottomColor={cardBorder} px={1}>
                                        <Badge colorScheme="purple">
                                          {item.quantity.toString()}
                                        </Badge>
                                      </Td>
                                    )}
                                    <Td borderBottomColor={cardBorder}>
                                      <Flex align="center">
                                        <Icon as={FaClock} color="orange.400" mr={1} />
                                        <Text fontSize="sm">
                                          {getExpiration(item.endTimeInSeconds)}
                                        </Text>
                                      </Flex>
                                    </Td>
                                    <Td borderBottomColor={cardBorder} px={1}>
                                      <Text fontWeight="medium">
                                        {item.creatorAddress.toLowerCase() ===
                                        account?.address.toLowerCase()
                                          ? "You"
                                          : shortenAddress(item.creatorAddress)}
                                      </Text>
                                    </Td>
                                    {account && (
                                      <Td borderBottomColor={cardBorder}>
                                        {!listedByYou ? (
                                          <BuyFromListingButton
                                            account={account}
                                            listing={item}
                                          />
                                        ) : (
                                          <CancelListingButton
                                            account={account}
                                            listingId={item.id}
                                          />
                                        )}
                                      </Td>
                                    )}
                                  </Tr>
                                );
                              })}
                            </Tbody>
                          </Table>
                        </TableContainer>
                      ) : (
                        <Box p={6} textAlign="center">
                          <Text color={textColor}>This item is not listed for sale</Text>
                        </Box>
                      )}
                    </AccordionPanel>
                  </AccordionItem>

                  {/* Related Listings Section */}
                  <RelatedListings excludedListingId={listings[0]?.id ?? -1n} />
                </Accordion>
              </Box>
            </Flex>
          </Flex>
        </Box>
      </Container>
    </Box>
  );
}

function getExpiration(endTimeInSeconds: bigint) {
  // Get the current date and time
  const currentDate = new Date();

  // Convert seconds to milliseconds (bigint)
  const milliseconds: bigint = endTimeInSeconds * 1000n;

  // Calculate the future date by adding milliseconds to the current date
  const futureDate = new Date(currentDate.getTime() + Number(milliseconds));

  // Format the future date
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    timeZoneName: "short",
  };
  const formattedDate = futureDate.toLocaleDateString("en-US", options);
  return formattedDate;
}