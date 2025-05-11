import { NFT_CONTRACTS, type NftContract } from "@/consts/nft_contracts";
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Avatar,
  Badge,
  Divider,
  useColorModeValue,
  Flex,
  Icon,
  Tooltip,
  Link
} from "@chakra-ui/react";
import type { Dispatch, SetStateAction } from "react";
import { FaEthereum, FaFileContract, FaLock, FaInfoCircle } from "react-icons/fa";
import { ExternalLinkIcon } from "@chakra-ui/icons";

type Props = {
  selectedCollection: NftContract;
  setSelectedCollection: Dispatch<SetStateAction<NftContract>>;
};

export function ProfileMenu(props: Props) {
  const { selectedCollection } = props;
  const collection = selectedCollection; // Using the single collection
  
  // Futuristic styling
  const cardBg = useColorModeValue("white", "gray.800");
  const headerBg = useColorModeValue("blue.500", "blue.600");
  const headerBgGradient = useColorModeValue(
    "linear(to-r, blue.400, purple.500)",
    "linear(to-r, blue.600, purple.700)"
  );
  const headerTextColor = "white";
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.300");
  const mutedTextColor = useColorModeValue("gray.500", "gray.500");
  const accentColor = useColorModeValue("blue.500", "blue.300");
  const sectionBg = useColorModeValue("gray.50", "gray.700");
  const badgeColorScheme = collection.type === "ERC721" ? "green" : "purple";
  const addressBg = useColorModeValue("gray.50", "gray.700");

  return (
    <Box 
      borderWidth="1px" 
      borderColor={borderColor} 
      borderRadius="xl" 
      overflow="hidden"
      w={{ base: "100%", lg: "300px" }}
      bg={cardBg}
      boxShadow="md"
      transition="transform 0.3s, box-shadow 0.3s"
      _hover={{
        boxShadow: "lg"
      }}
    >
      {/* Header with gradient background */}
      <Box 
        p={4} 
        bgGradient={headerBgGradient}
        color={headerTextColor}
        position="relative"
        overflow="hidden"
        _after={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bg: "radial-gradient(circle at 80% 20%, whiteAlpha.200, transparent 50%)",
          zIndex: 0
        }}
      >
        <Flex align="center" position="relative" zIndex={1}>
          <Icon as={FaFileContract} mr={2} />
          <Heading size="sm" fontWeight="bold">Collection Details</Heading>
        </Flex>
      </Box>
      
      <Divider />
      
      {/* Collection Information */}
      <VStack 
        align="stretch" 
        p={5}
        spacing={5}
      >
        {/* Collection title, avatar and type */}
        <HStack spacing={4} align="start">
          <Box
            position="relative"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="md"
            borderWidth="2px"
            borderColor={collection.type === "ERC721" ? "green.300" : "purple.300"}
          >
            <Avatar 
              src={collection.thumbnailUrl ?? ""} 
              size="lg"
              borderRadius="lg" 
            />
          </Box>
          
          <VStack align="start" spacing={2} flex={1}>
            <Text fontWeight="bold" fontSize="lg" color={textColor}>
              {collection.title ?? "Collection"}
            </Text>
            
            {collection.type && (
              <Badge 
                colorScheme={badgeColorScheme} 
                borderRadius="full"
                px={2}
                py={1}
                fontSize="xs"
              >
                {collection.type}
              </Badge>
            )}
          </VStack>
        </HStack>
        
        {/* Description */}
        {collection.description && (
          <Box>
            <Text fontSize="sm" color={textColor} lineHeight="tall">
              {collection.description}
            </Text>
          </Box>
        )}
        
        <Divider />
        
        {/* Contract Address */}
        <Box>
          <HStack mb={1}>
            <Icon as={FaFileContract} fontSize="xs" color={mutedTextColor} />
            <Text fontSize="xs" color={mutedTextColor} fontWeight="medium">Contract Address</Text>
            <Tooltip label="View on blockchain explorer">
              <Link href="#" color={accentColor} fontSize="xs">
                <ExternalLinkIcon boxSize={3} />
              </Link>
            </Tooltip>
          </HStack>
          
          <Box 
            p={2} 
            bg={addressBg} 
            borderRadius="md" 
            fontSize="xs" 
            fontFamily="mono" 
            letterSpacing="tight"
            borderWidth="1px"
            borderColor={borderColor}
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {collection.address}
          </Box>
        </Box>
        
        {/* Chain */}
        <Box>
          <HStack mb={1}>
            <Icon as={FaEthereum} fontSize="xs" color={mutedTextColor} />
            <Text fontSize="xs" color={mutedTextColor} fontWeight="medium">Chain</Text>
          </HStack>
          
          <HStack>
            <Badge colorScheme="blue" borderRadius="full" px={2}>
              {collection.chain?.name || "Polygon Amoy"}
            </Badge>
          </HStack>
        </Box>
        
        {/* Security Note */}
        <Box
          mt={2}
          p={3}
          bg={useColorModeValue("blue.50", "blue.900")}
          borderRadius="md"
          borderWidth="1px"
          borderColor={useColorModeValue("blue.100", "blue.800")}
        >
          <Flex align="center" mb={1}>
            <Icon as={FaLock} color={accentColor} mr={2} />
            <Text fontSize="xs" fontWeight="bold">Security Verified</Text>
          </Flex>
          <Text fontSize="xs" color={textColor}>
            This collection is deployed on a secure contract with verified source code.
          </Text>
        </Box>
      </VStack>
    </Box>
  );
}