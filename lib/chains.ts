import { defineChain } from 'viem';
import { createPublicClient, http } from 'viem';

export const moonbaseAlpha = defineChain({
  id: 1287,
  name: 'Moonbase Alpha',
  nativeCurrency: { name: 'DEV', symbol: 'DEV', decimals: 18 },
  rpcUrls: { default: { http: ['https://rpc.api.moonbase.moonbeam.network'] } },
  blockExplorers: { default: { name: 'Moonscan', url: 'https://moonbase.moonscan.io' } },
});

export const publicClient = createPublicClient({
  chain: moonbaseAlpha,
  transport: http(),
});