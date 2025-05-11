import { client } from "@/consts/client";
import { useMarketplaceContext } from "@/hooks/useMarketplaceContext";
import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Flex,
  SimpleGrid,
  useBreakpointValue,
  Text,
} from "@chakra-ui/react";
import { MediaRenderer } from "thirdweb/react";

export function ListingGrid() {
  const { listingsInSelectedCollection, nftContract } = useMarketplaceContext();
  const totalListings = listingsInSelectedCollection.length;
  
  // Determine responsive column count based on available listings
  const columns = useBreakpointValue({
    base: 1,
    sm: Math.min(totalListings, 2),
    md: Math.min(totalListings, 4),
    lg: Math.min(totalListings, 4),
    xl: Math.min(totalListings, 5),
  });
  
  // Return empty fragment if no listings are available
  if (!listingsInSelectedCollection || !totalListings) return <></>;
  
  return (
    <SimpleGrid 
      columns={columns} 
      spacing={4} 
      p={4} 
      mx="auto" 
      mt="20px"
      width="100%"
    >
      {listingsInSelectedCollection.map((listing) => (
        <Box
          key={listing.id}
          rounded="12px"
          as={Link}
          href={`/collection/${nftContract.chain.id}/${
            nftContract.address
          }/token/${listing.asset.id.toString()}`}
          _hover={{ 
            textDecoration: "none",
            transform: "translateY(-4px)",
            transition: "transform 0.2s ease-in-out",
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
                style={{ aspectRatio: "1/1", objectFit: "cover" }}
              />
            </Box>
            
            <Flex direction="column" p={3}>
              <Text fontWeight="medium" noOfLines={1}>
                {listing.asset?.metadata?.name ?? "Unknown item"}
              </Text>
              
              <Text fontSize="sm" color="gray.500" mt={1}>
                Price
              </Text>
              
              <Text fontWeight="bold">
                {listing.currencyValuePerToken.displayValue}{" "}
                {listing.currencyValuePerToken.symbol}
              </Text>
            </Flex>
          </Flex>
        </Box>
      ))}
    </SimpleGrid>
  );
}