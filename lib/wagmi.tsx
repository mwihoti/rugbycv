'use client';

import { createConfig, http, WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { moonbaseAlpha } from './chains';
import { metaMask, injected } from 'wagmi/connectors';
import React from 'react';

const queryClient = new QueryClient();

export const config = createConfig({
  chains: [moonbaseAlpha],
  connectors: [
    metaMask(),
    injected(),
  ],
  transports: {
    [moonbaseAlpha.id]: http('https://rpc.api.moonbase.moonbeam.network'),
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        {children}
      </WagmiProvider>
    </QueryClientProvider>
  );
}