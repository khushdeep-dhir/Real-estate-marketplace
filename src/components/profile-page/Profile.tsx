import {
  Box,
  Flex,
  Heading,
  Img,
  SimpleGrid,
  Tab,
  TabList,
  Tabs,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { blo } from "blo";
import { shortenAddress } from "thirdweb/utils";
import { ProfileMenu } from "./Menu";
import { useState } from "react";
import { NFT_CONTRACTS, type NftContract } from "@/consts/nft_contracts";
import {
  MediaRenderer,
  useActiveAccount,
  useReadContract,
} from "thirdweb/react";
import { getContract, toEther } from "thirdweb";
import { client } from "@/consts/client";
import { getOwnedERC721s } from "@/extensions/getOwnedERC721s";
import { OwnedItem } from "./OwnedItem";
import { getAllValidListings } from "thirdweb/extensions/marketplace";
import { MARKETPLACE_CONTRACTS } from "@/consts/marketplace_contract";
import { Link } from "@chakra-ui/next-js";
import { getOwnedERC1155s } from "@/extensions/getOwnedERC1155s";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { useGetENSAvatar } from "@/hooks/useGetENSAvatar";
import { useGetENSName } from "@/hooks/useGetENSName";

type Props = {
  address: string;
};

export function ProfileSection(props: Props) {
  const { address } = props;
  const account = useActiveAccount();
  const isCurrentUser = address.toLowerCase() === account?.address.toLowerCase();
  const { data: ensName } = useGetENSName({ address });
  const { data: ensAvatar } = useGetENSAvatar({ ensName });
  
  // Collection state and tab navigation
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
  const [selectedCollection, setSelectedCollection] = useState<NftContract>(
    NFT_CONTRACTS[0]
  );
  
  // Initialize contract reference
  const contract = getContract({
    address: selectedCollection.address,
    chain: selectedCollection.chain,
    client,
  });

  // Fetch owned NFTs for the selected collection
  const {
    data: ownedNFTs,
    error,
    isLoading: isLoadingOwnedNFTs,
  } = useReadContract(
    selectedCollection.type === "ERC1155" ? getOwnedERC1155s : getOwnedERC721s,
    {
      contract,
      owner: address,
      requestPerSec: 50,
      queryOptions: {
        enabled: !!address,
      },
    }
  );

  // Set up marketplace contract for the current chain
  const chain = contract.chain;
  const marketplaceContractAddress = MARKETPLACE_CONTRACTS.find(
    (o) => o.chain.id === chain.id
  )?.address;
  
  if (!marketplaceContractAddress) throw Error("No marketplace contract found");
  
  const marketplaceContract = getContract({
    address: marketplaceContractAddress,
    chain,
    client,
  });
  
  // Fetch valid listings from the marketplace
  const { data: allValidListings, isLoading: isLoadingValidListings } =
    useReadContract(getAllValidListings, {
      contract: marketplaceContract,
      queryOptions: { enabled: ownedNFTs && ownedNFTs.length > 0 },
    });
  
  // Filter listings by current contract and owner address
  const userListings = allValidListings?.length
    ? allValidListings.filter(
        (listing) =>
          listing.assetContractAddress.toLowerCase() === contract.address.toLowerCase() &&
          listing.creatorAddress.toLowerCase() === address.toLowerCase()
      )
    : [];
  
  // Responsive grid layout
  const columns = useBreakpointValue({ base: 1, sm: 2, md: 2, lg: 2, xl: 4 });
  
  return (
    <Box px={{ lg: "50px", base: "20px" }} py={6}>
      {/* Profile header section */}
      <Flex 
        direction={{ lg: "row", md: "column", sm: "column" }} 
        gap={5}
        alignItems={{ base: "center", lg: "flex-start" }}
        mb={8}
      >
        <Img
          src={ensAvatar ?? blo(address as `0x${string}`)}
          w={{ lg: 150, base: 100 }}
          h={{ lg: 150, base: 100 }}
          objectFit="cover"
          rounded="12px"
          boxShadow="sm"
        />
        
        <Box my="auto">
          <Heading fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}>
            {ensName ?? address}
          </Heading>
        </Box>
      </Flex>

      {/* Main content section */}
      <Flex 
        direction={{ lg: "row", base: "column" }} 
        gap="10" 
        mt="20px"
        align="flex-start"
      >
        {/* Left sidebar with collection menu */}
        <ProfileMenu
          selectedCollection={selectedCollection}
          setSelectedCollection={setSelectedCollection}
        />
        
        {/* Right content area with tabs and NFT grid */}
        {isLoadingOwnedNFTs ? (
          <Box p={8} textAlign="center" width="100%">
            <Text fontSize="lg">Loading collection items...</Text>
          </Box>
        ) : (
          <Box width="100%">
            <Flex 
              direction="row" 
              justifyContent="space-between" 
              alignItems="center"
              px="12px"
              mb={4}
            >
              <Tabs
                variant="soft-rounded"
                onChange={(index) => setActiveTabIndex(index)}
                isLazy
                defaultIndex={0}
                colorScheme="blue"
              >
                <TabList>
                  <Tab fontWeight="medium">Owned ({ownedNFTs?.length || 0})</Tab>
                  <Tab fontWeight="medium">Listings ({userListings.length || 0})</Tab>
                </TabList>
              </Tabs>
              
              <Link
                href={`/collection/${selectedCollection.chain.id}/${selectedCollection.address}`}
                color="blue.500"
                fontSize="sm"
                fontWeight="medium"
              >
                View collection <ExternalLinkIcon mx="2px" />
              </Link>
            </Flex>
            
            <SimpleGrid 
              columns={columns} 
              spacing={6} 
              p={4}
              width="100%"
            >
              {activeTabIndex === 0 ? (
                // Owned NFTs tab content
                <>
                  {ownedNFTs && ownedNFTs.length > 0 ? (
                    ownedNFTs.map((nft) => (
                      <OwnedItem
                        key={nft.id.toString()}
                        nftCollection={contract}
                        nft={nft}
                      />
                    ))
                  ) : (
                    <Box p={4} borderRadius="md" bg="gray.50" width="100%">
                      <Text>
                        {isCurrentUser
                          ? "You"
                          : ensName
                          ? ensName
                          : shortenAddress(address)}{" "}
                        {isCurrentUser ? "do" : "does"} not own any NFTs in this
                        collection
                      </Text>
                    </Box>
                  )}
                </>
              ) : (
                // Listings tab content
                <>
                  {userListings && userListings.length > 0 ? (
                    userListings.map((listing) => (
                      <Box
                        key={listing.id}
                        rounded="12px"
                        as={Link}
                        href={`/collection/${contract.chain.id}/${
                          contract.address
                        }/token/${listing.asset.id.toString()}`}
                        _hover={{ 
                          textDecoration: "none",
                          transform: "translateY(-4px)",
                          transition: "transform 0.2s",
                          boxShadow: "md"
                        }}
                        overflow="hidden"
                        borderWidth="1px"
                        borderColor="gray.200"
                      >
                        <Flex direction="column">
                          <Box position="relative">
                            <MediaRenderer
                              client={client}
                              src={listing.asset.metadata.image}
                              style={{
                                aspectRatio: "1/1",
                                objectFit: "cover"
                              }}
                            />
                          </Box>
                          
                          <Box p={3}>
                            <Text fontWeight="medium" mb={2} noOfLines={1}>
                              {listing.asset?.metadata?.name ?? "Unknown item"}
                            </Text>
                            
                            <Text fontSize="sm" color="gray.500">
                              Price
                            </Text>
                            
                            <Text fontWeight="bold">
                              {toEther(listing.pricePerToken)}{" "}
                              {listing.currencyValuePerToken.symbol}
                            </Text>
                          </Box>
                        </Flex>
                      </Box>
                    ))
                  ) : (
                    <Box p={4} borderRadius="md" bg="gray.50" width="100%">
                      <Text>
                        {isCurrentUser
                          ? "You do"
                          : `${ensName || shortenAddress(address)} does`} not have any listings in this collection
                      </Text>
                    </Box>
                  )}
                </>
              )}
            </SimpleGrid>
          </Box>
        )}
      </Flex>
    </Box>
  );
}