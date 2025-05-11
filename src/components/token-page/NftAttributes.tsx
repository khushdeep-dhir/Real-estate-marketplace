import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Card,
  Flex,
  Text,
  Grid,
  useColorModeValue,
  Badge,
  Icon
} from "@chakra-ui/react";
import { FaTag } from "react-icons/fa";

export function NftAttributes({
  attributes,
}: {
  attributes: Record<string, unknown>;
}) {
  /**
   * Assume the NFT attributes follow the conventional format
   */
  // @ts-ignore TODO Fix later
  const items = attributes.filter(
    (item: Record<string, unknown>) => item.trait_type
  );

  // Futuristic styling
  const cardBg = useColorModeValue("gray.50", "gray.800");
  const cardHoverBg = useColorModeValue("blue.50", "blue.900");
  const cardBorder = useColorModeValue("blue.200", "blue.700");
  const cardHoverBorder = useColorModeValue("blue.400", "blue.500");
  const labelColor = useColorModeValue("gray.500", "gray.400");
  const valueColor = useColorModeValue("blue.600", "blue.300");
  const glowColor = useColorModeValue("blue.200", "blue.700");
  const accordionBg = useColorModeValue("gray.50", "gray.800");
  const iconColor = useColorModeValue("blue.400", "blue.300");

  return (
    <AccordionItem borderColor={cardBorder} mb={2}>
      <AccordionButton 
        bg={accordionBg}
        borderRadius="md"
        _hover={{ bg: cardHoverBg }}
        py={3}
      >
        <Icon as={FaTag} color={iconColor} mr={2} />
        <Box as="span" flex="1" textAlign="left" fontWeight="medium">
          Traits
        </Box>
        <Badge colorScheme="blue" mr={2} fontSize="sm">
          {items.length}
        </Badge>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel pb={6} pt={4}>
        <Grid 
          templateColumns={{
            base: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)"
          }}
          gap={3}
        >
          {/* @ts-ignore TODO Fix later */}
          {items.map((item) => (
            <Card
              key={item.trait_type}
              bg={cardBg}
              borderWidth="1px"
              borderColor={cardBorder}
              borderRadius="lg"
              overflow="hidden"
              position="relative"
              transition="all 0.3s"
              _hover={{
                borderColor: cardHoverBorder,
                transform: "translateY(-3px)",
                boxShadow: "md",
                _before: {
                  opacity: 0.7
                }
              }}
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
            >
              <Box p={3}>
                {item.trait_type && (
                  <Text 
                    fontSize="sm" 
                    color={labelColor} 
                    textAlign="center" 
                    mb={1}
                    textTransform="uppercase"
                    letterSpacing="wide"
                  >
                    {item.trait_type}
                  </Text>
                )}
                <Text 
                  fontSize="md" 
                  color={valueColor} 
                  textAlign="center" 
                  fontWeight="bold"
                  letterSpacing="tight"
                >
                  {typeof item.value === "object"
                    ? JSON.stringify(item.value || {})
                    : item.value}
                </Text>
              </Box>
            </Card>
          ))}
        </Grid>
      </AccordionPanel>
    </AccordionItem>
  );
}