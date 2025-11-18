import { createConfig, http, WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { moonbaseAlpha } from './chains';
import { walletConnect, injected, metaMask } from 'wagmi/connectors';

const projectId = 'YOUR_WALLETCONNECT_PROJECT_ID'; // Get from https://cloud.walletconnect.com

export const config = createConfig({
  chains: [moonbaseAlpha],
  connectors: [
    injected(),
    walletConnect({ projectId }),
    metaMask(),
  ],
  transports: {
    [moonbaseAlpha.id]: http(),
  },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}