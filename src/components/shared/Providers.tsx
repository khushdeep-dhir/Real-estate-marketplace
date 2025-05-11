"use client";
import { ChakraProvider} from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { ThirdwebProvider } from "thirdweb/react";

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <ThirdwebProvider>{children}</ThirdwebProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
}
