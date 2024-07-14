"use client";

import { createWeb3Modal } from "@web3modal/wagmi/react";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import {
  baseSepolia,
  lineaTestnet,
  morphHolesky,
  scrollSepolia,
  zircuitTestnet,
} from "viem/chains";
import { cookieStorage, createStorage } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { env } from "~/env";

import { State, WagmiProvider } from "wagmi";

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

// 2. Set chains
const chains = [
  baseSepolia,
  morphHolesky,
  scrollSepolia,
  lineaTestnet,
  zircuitTestnet,
] as const;

// 3. Create a metadata object
const metadata = {
  name: "Cushion",
  description: "Cushion",
  url: "https://mywebsite.com", // origin must match your domain & subdomain
  icons: ["https://avatars.mywebsite.com/"],
};

// 4. Create Ethers config
export const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});

// 5. Create a Web3Modal instance
createWeb3Modal({
  wagmiConfig,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true, // Optional - false as default
});

// Setup queryClient
const queryClient = new QueryClient();

export function Web3Modal({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
