"use client";

import { NFT_CONTRACTS } from "../consts/nft_contracts";
import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Flex,
  Heading,
  Button,
  Text,
  Badge,
  Container,
  VStack,
  useColorModeValue,
  Icon,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  HStack,
  Card,
  CardBody,
  Stack
} from "@chakra-ui/react";
import { FaHome, FaBuilding, FaInfoCircle } from "react-icons/fa";

export default function Home() {
  const bgGradient = useColorModeValue(
    "linear(to-r, purple.400, blue.500)",
    "linear(to-r, purple.600, blue.700)"
  );
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const accentColor = useColorModeValue("blue.500", "blue.300");

  return (
    <Container maxW="container.xl" py={8}>
      {/* Unified Hero Section with Integrated Collections */}
      <Box 
        bgGradient={bgGradient}
        borderRadius="xl"
        p={8}
        mb={10}
        color="white"
        boxShadow="xl"
      >
        {/* Hero Content */}
        <Flex direction={{ base: "column", md: "row" }} align="center" mb={10}>
          <Box flex={1} pr={{ md: 8 }}>
            <Heading 
              as="h1" 
              size="2xl" 
              fontWeight="bold"
              bgGradient="linear(to-r, cyan.300, purple.300, blue.300)"
              bgClip="text"
              mb={4}
            >
              Future of Real Estate
            </Heading>
            <Text fontSize="xl" mb={6}>
              Secure, transparent, and legally recognized property transactions on the blockchain
            </Text>
          </Box>
          <Box 
            flex={1} 
            mt={{ base: 8, md: 0 }}
            borderRadius="lg"
            overflow="hidden"
            boxShadow="dark-lg"
          >
            {/* Use the Polygon Amoy image */}
            <Box 
              h="250px" 
              w="100%" 
              position="relative" 
              overflow="hidden"
              borderRadius="lg"
            >
              <img 
                src="https://cdn.prod.website-files.com/636e894daa9e99940a604aef/6718d191aedc6f3a48c69ba4_Add%20Polygon%20Amoy%20to%20MetaMask.webp"
                alt="Polygon Amoy"
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover'
                }}
              />
            </Box>
          </Box>
        </Flex>
        
        {/* Trending Collections Integrated Directly */}
        <Heading 
          mt={4}
          size="xl" 
          fontWeight="bold"
          textAlign="center"
          position="relative"
          color="white"
          _after={{
            content: '""',
            position: "absolute",
            bottom: "-10px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "100px",
            height: "4px",
            bg: "whiteAlpha.800",
            borderRadius: "full"
          }}
        >
          Trending Collections
        </Heading>
        
        <Flex
          direction={{ base: "column", md: "row" }}
          wrap="wrap"
          gap={6}
          justifyContent="center"
          mt={16}
        >
          {NFT_CONTRACTS.map((item) => (
            <Link
              _hover={{ textDecoration: "none" }}
              key={item.address}
              href={`/collection/${item.chain.id.toString()}/${item.address}`}
            >
              <Card 
                maxW="300px"
                bg={cardBg}
                color={textColor}
                borderRadius="lg"
                boxShadow="xl"
                _hover={{ 
                  transform: "translateY(-8px)",
                  boxShadow: "2xl",
                  borderColor: "cyan.400",
                  borderWidth: "2px"
                }}
                transition="all 0.3s"
                borderWidth="1px"
                overflow="hidden"
              >
                {/* Removed the Box that was creating white space */}
                <CardBody>
                  <Stack spacing={4}>
                    <Flex justify="space-between" align="center">
                      <Badge 
                        colorScheme="purple" 
                        fontSize="0.8em" 
                        p="1" 
                        borderRadius="full"
                      >
                        {item.chain.name}
                      </Badge>
                      <Icon as={FaInfoCircle} color="gray.400" />
                    </Flex>
                    <Heading size="md">{item.title}</Heading>
                    <Text fontSize="sm" color="gray.500">
                      ID: {item.address.slice(0, 6)}...{item.address.slice(-4)}
                    </Text>
                    <Button 
                      colorScheme="blue" 
                      size="md"
                      w="full"
                      _hover={{
                        bg: "transparent",
                        color: "blue.500",
                        borderColor: "blue.500",
                        borderWidth: "1px"
                      }}
                    >
                      View Collection
                    </Button>
                  </Stack>
                </CardBody>
              </Card>
            </Link>
          ))}
        </Flex>
      </Box>

      {/* Legal Notice Alert */}
      <Alert
        status="info"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        borderRadius="lg"
        mb={10}
        p={6}
        boxShadow="md"
      >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={2} fontSize="lg">
          Legal Recognition Notice
        </AlertTitle>
        <AlertDescription maxW="4xl">
          <Text mb={4}>
            Property transactions on this marketplace require registration as ERC721 NFTs on the Polygon Amoy testnet chain.
          </Text>
          <Text mb={4}>
            <strong>EU Legal Recognition:</strong> NFT-based property transactions are legally recognized under EU regulations. 
            The EU's Markets in Crypto-Assets (MiCA) framework recognizes non-fungible tokens as unique digital assets that can
            represent physical assets such as real estate. English courts have also recognized NFTs as a valid form of property.
          </Text>
          <Text fontStyle="italic" fontSize="sm">
            For more information on the legal framework governing these transactions, please consult our legal resources section.
          </Text>
        </AlertDescription>
      </Alert>
    </Container>
  );
}