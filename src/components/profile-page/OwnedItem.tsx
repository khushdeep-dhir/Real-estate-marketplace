import { client } from "@/consts/client";
import { 
  Box, 
  Flex, 
  Link, 
  Text,
  Badge,
  useColorModeValue,
  VStack,
  HStack,
  Icon,
  Tooltip,
  Divider
} from "@chakra-ui/react";
import type { NFT, ThirdwebContract } from "thirdweb";
import { MediaRenderer } from "thirdweb/react";
import { FaLayerGroup, FaFingerprint, FaTag } from "react-icons/fa";

export function OwnedItem(props: {
  nft: NFT;
  nftCollection: ThirdwebContract;
}) {
  const { nft, nftCollection } = props;
  
  // Futuristic styling
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverBorderColor = useColorModeValue("blue.300", "blue.500");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const mutedTextColor = useColorModeValue("gray.500", "gray.500");
  const glowColor = useColorModeValue("blue.100", "blue.800");
  const accentColor = useColorModeValue("blue.500", "blue.300");
  
  return (
    <Box
      borderRadius="xl"
      as={Link}
      href={`/collection/${nftCollection.chain.id}/${
        nftCollection.address
      }/token/${nft.id.toString()}`}
      _hover={{ 
        textDecoration: "none",
        transform: "translateY(-5px)",
        boxShadow: "lg",
        borderColor: hoverBorderColor,
        _before: {
          opacity: 0.7
        }
      }}
      overflow="hidden"
      borderWidth="1px"
      borderColor={borderColor}
      bg={cardBg}
      transition="all 0.3s"
      position="relative"
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
      w="100%"
    >
      {/* Image Container with Badge */}
      <Box position="relative" h="220px">
        <MediaRenderer 
          client={client} 
          src={nft.metadata.image}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover"
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
          #{nft.id.toString()}
        </Badge>
      </Box>
      
      {/* Content Section */}
      <VStack align="stretch" p={4} spacing={2}>
        <Tooltip label={nft.metadata?.name ?? "Unknown item"}>
          <Text 
            fontWeight="semibold" 
            fontSize="md" 
            color={textColor}
            noOfLines={1}
          >
            {nft.metadata?.name ?? "Unknown item"}
          </Text>
        </Tooltip>
        
        <Divider borderColor={borderColor} my={1} />
        
        <HStack spacing={2}>
          <Icon as={FaFingerprint} fontSize="xs" color={accentColor} />
          <Text fontSize="xs" color={mutedTextColor}>
            Token ID: {nft.id.toString()}
          </Text>
        </HStack>
        
        {/* Optional attributes preview */}
        {nft.metadata?.attributes && Array.isArray(nft.metadata.attributes) && nft.metadata.attributes.length > 0 && (
          <HStack mt={2} flexWrap="wrap" spacing={1} gap={1}>
            {/* Display up to 3 attributes */}
            {nft.metadata.attributes.slice(0, 3).map((attr: any, index) => (
              <Badge 
                key={index} 
                colorScheme="purple"
                variant="subtle"
                px={2}
                py={0.5}
                borderRadius="full"
                fontSize="xs"
                display="flex"
                alignItems="center"
              >
                <Icon as={FaTag} boxSize={2} mr={1} />
                {attr.trait_type ? `${attr.trait_type}: ${attr.value}` : attr.value}
              </Badge>
            ))}
            
            {/* Show indicator if there are more attributes */}
            {nft.metadata.attributes.length > 3 && (
              <Badge 
                colorScheme="gray"
                px={2}
                py={0.5}
                borderRadius="full"
                fontSize="xs"
              >
                +{nft.metadata.attributes.length - 3} more
              </Badge>
            )}
          </HStack>
        )}
      </VStack>
      
      {/* Hover effect overlay */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="blackAlpha.600"
        opacity={0}
        transition="opacity 0.3s"
        _groupHover={{ opacity: 1 }}
        display="flex"
        alignItems="center"
        justifyContent="center"
        pointerEvents="none"
      >
        <Text
          color="white"
          fontWeight="bold"
          fontSize="lg"
        >
          View Details
        </Text>
      </Box>
    </Box>
  );
}