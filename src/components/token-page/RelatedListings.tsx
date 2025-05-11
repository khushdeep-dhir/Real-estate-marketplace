import { client } from "@/consts/client";
import { useMarketplaceContext } from "@/hooks/useMarketplaceContext";
import { Link } from "@chakra-ui/next-js";
import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Text,
  useColorModeValue,
  Badge,
  Icon,
  VStack,
  HStack,
  Tooltip
} from "@chakra-ui/react";
import { toEther } from "thirdweb";
import { MediaRenderer } from "thirdweb/react";
import { FaCompass, FaEthereum, FaTag } from "react-icons/fa";

export default function RelatedListings({
  excludedListingId,
}: {
  excludedListingId: bigint;
}) {
  const { nftContract, allValidListings } = useMarketplaceContext();
  const listings = allValidListings?.filter(
    (o) =>
      o.id !== excludedListingId &&
      o.assetContractAddress.toLowerCase() ===
        nftContract.address.toLowerCase(),
  );
  
  if (!listings || !listings.length) return <></>;
  
  // Futuristic styling
  const accordionBg = useColorModeValue("gray.50", "gray.800");
  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("blue.200", "blue.700");
  const cardHoverBg = useColorModeValue("blue.50", "blue.900");
  const iconColor = useColorModeValue("blue.500", "blue.300");
  const priceColor = useColorModeValue("blue.600", "blue.300");
  const labelColor = useColorModeValue("gray.600", "gray.400");
  const glowColor = useColorModeValue("blue.100", "blue.800");
  
  return (
    <AccordionItem borderColor={cardBorder} mb={2}>
      <AccordionButton 
        bg={accordionBg}
        borderRadius="md"
        _hover={{ bg: cardHoverBg }}
        py={3}
      >
        <Icon as={FaCompass} color={iconColor} mr={2} />
        <Box as="span" flex="1" textAlign="left" fontWeight="medium">
          More from this collection
        </Box>
        <Badge colorScheme="blue" mr={2} fontSize="sm">
          {listings.length}
        </Badge>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel pb={6} pt={4}>
        <Box
          display="flex"
          overflowX="auto"
          whiteSpace="nowrap"
          paddingY={4}
          paddingX={2}
          width="100%"
          gap={4}
          css={{
            '&::-webkit-scrollbar': {
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: useColorModeValue('rgba(0,0,0,0.05)', 'rgba(255,255,255,0.05)'),
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: useColorModeValue('rgba(0,0,0,0.2)', 'rgba(255,255,255,0.2)'),
              borderRadius: '10px',
              '&:hover': {
                background: useColorModeValue('rgba(0,0,0,0.3)', 'rgba(255,255,255,0.3)'),
              },
            },
          }}
        >
          {listings?.map((item) => (
            <Box
              key={item.id.toString()}
              rounded="xl"
              as={Link}
              href={`/collection/${nftContract.chain.id}/${
                nftContract.address
              }/token/${item.asset.id.toString()}`}
              _hover={{ 
                textDecoration: "none",
                transform: "translateY(-5px)",
                _before: {
                  opacity: 0.7
                }
              }}
              minW="250px"
              maxW="250px"
              overflow="hidden"
              borderWidth="1px"
              borderColor={cardBorder}
              borderRadius="xl"
              position="relative"
              bg={cardBg}
              transition="all 0.3s"
              _before={{
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bg: glowColor,
                opacity: 0,
                filter: "blur(12px)",
                zIndex: -1,
                transition: "opacity 0.3s"
              }}
              boxShadow="sm"
            >
              <Box position="relative" h="180px">
                <MediaRenderer
                  client={client}
                  src={item.asset.metadata.image}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <Badge 
                  position="absolute" 
                  top={2} 
                  left={2}
                  colorScheme="blue"
                  borderRadius="full"
                  px={2}
                  py={1}
                  fontSize="xs"
                  opacity={0.9}
                >
                  #{item.asset.id.toString()}
                </Badge>
              </Box>
              
              <VStack align="stretch" p={4} spacing={2}>
                <Text 
                  fontWeight="semibold" 
                  fontSize="md" 
                  noOfLines={1}
                  mb={1}
                >
                  {item.asset.metadata?.name ?? "Unknown item"}
                </Text>
                
                <Flex align="center" justify="space-between">
                  <Text 
                    fontSize="xs" 
                    color={labelColor}
                    display="flex"
                    alignItems="center"
                  >
                    <Icon as={FaTag} mr={1} fontSize="xs" />
                    Price
                  </Text>
                  
                  <HStack spacing={1}>
                    <Icon as={FaEthereum} color={priceColor} />
                    <Text 
                      fontWeight="bold" 
                      color={priceColor}
                    >
                      {item.currencyValuePerToken.displayValue}{" "}
                      <Text as="span" fontSize="xs">
                        {item.currencyValuePerToken.symbol}
                      </Text>
                    </Text>
                  </HStack>
                </Flex>
              </VStack>
            </Box>
          ))}
        </Box>
      </AccordionPanel>
    </AccordionItem>
  );
}