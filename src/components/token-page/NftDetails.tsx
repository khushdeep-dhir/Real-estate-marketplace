import { useMarketplaceContext } from "@/hooks/useMarketplaceContext";
import { Link } from "@chakra-ui/next-js";
import {
  AccordionButton,
  Text,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  useColorModeValue,
  Divider,
  Icon,
  Badge,
  Tooltip
} from "@chakra-ui/react";
import type { NFT } from "thirdweb";
import { shortenAddress } from "thirdweb/utils";
import { 
  FaInfoCircle, 
  FaExternalLinkAlt, 
  FaEthereum, 
  FaCheckCircle,
  FaCubes
} from "react-icons/fa";

type Props = {
  nft: NFT;
};

export function NftDetails(props: Props) {
  const { type, nftContract } = useMarketplaceContext();
  const { nft } = props;
  const contractUrl = `${
    nftContract.chain.blockExplorers
      ? nftContract.chain.blockExplorers[0]?.url
      : ""
  }/address/${nftContract.address}`;
  const tokenUrl = `${
    nftContract.chain.blockExplorers
      ? nftContract.chain.blockExplorers[0]?.url
      : ""
  }/nft/${nftContract.address}/${nft.id.toString()}`;

  // Futuristic styling
  const accordionBg = useColorModeValue("gray.50", "gray.800");
  const cardBorder = useColorModeValue("blue.200", "blue.700");
  const cardHoverBg = useColorModeValue("blue.50", "blue.900");
  const linkColor = useColorModeValue("blue.500", "blue.300");
  const labelColor = useColorModeValue("gray.600", "gray.400");
  const valueColor = useColorModeValue("gray.800", "white");
  const dividerColor = useColorModeValue("gray.200", "gray.700");
  const iconColor = useColorModeValue("blue.500", "blue.300");
  
  // Badge colors based on token type
  const isERC721 = type === "ERC721";
  const badgeColorScheme = isERC721 ? "purple" : "teal";
  const TokenIcon = isERC721 ? FaCheckCircle : FaCubes;

  return (
    <AccordionItem borderColor={cardBorder} mb={2}>
      <AccordionButton 
        bg={accordionBg}
        borderRadius="md"
        _hover={{ bg: cardHoverBg }}
        py={3}
      >
        <Icon as={FaInfoCircle} color={iconColor} mr={2} />
        <Box as="span" flex="1" textAlign="left" fontWeight="medium">
          Details
        </Box>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel pb={6} pt={4}>
        <Flex 
          direction="column" 
          gap={3}
          bg={useColorModeValue("white", "gray.900")}
          borderRadius="md"
          p={4}
          boxShadow="sm"
        >
          <Flex direction="row" justifyContent="space-between" alignItems="center">
            <Text color={labelColor} fontWeight="medium">Contract address</Text>
            <Tooltip label="View on blockchain explorer">
              <Link 
                color={linkColor} 
                href={contractUrl} 
                target="_blank"
                display="flex"
                alignItems="center"
                _hover={{
                  textDecoration: "none",
                  color: useColorModeValue("blue.600", "blue.200")
                }}
              >
                <Text mr={1}>{shortenAddress(nftContract.address)}</Text>
                <Icon as={FaExternalLinkAlt} boxSize={3} ml={1} />
              </Link>
            </Tooltip>
          </Flex>
          
          <Divider borderColor={dividerColor} />
          
          <Flex direction="row" justifyContent="space-between" alignItems="center">
            <Text color={labelColor} fontWeight="medium">Token ID</Text>
            <Tooltip label="View token on blockchain explorer">
              <Link 
                color={linkColor} 
                href={tokenUrl} 
                target="_blank"
                display="flex"
                alignItems="center"
                _hover={{
                  textDecoration: "none",
                  color: useColorModeValue("blue.600", "blue.200")
                }}
              >
                <Text mr={1}>{nft?.id.toString()}</Text>
                <Icon as={FaExternalLinkAlt} boxSize={3} ml={1} />
              </Link>
            </Tooltip>
          </Flex>
          
          <Divider borderColor={dividerColor} />
          
          <Flex direction="row" justifyContent="space-between" alignItems="center">
            <Text color={labelColor} fontWeight="medium">Token Standard</Text>
            <Badge 
              colorScheme={badgeColorScheme} 
              display="flex" 
              alignItems="center" 
              px={2} 
              py={1}
              borderRadius="full"
            >
              <Icon as={TokenIcon} mr={1} boxSize={3} />
              <Text>{type}</Text>
            </Badge>
          </Flex>
          
          <Divider borderColor={dividerColor} />
          
          <Flex direction="row" justifyContent="space-between" alignItems="center">
            <Text color={labelColor} fontWeight="medium">Chain</Text>
            <Flex alignItems="center">
              <Icon as={FaEthereum} mr={2} color={iconColor} />
              <Text color={valueColor} fontWeight="medium">
                {nftContract.chain.name ?? "Unnamed chain"}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </AccordionPanel>
    </AccordionItem>
  );
}