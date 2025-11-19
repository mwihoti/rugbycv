'use client';
import { useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { moonbaseAlpha } from '@/lib/chains';

export default function ConnectWallet() {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isConnected && chainId !== moonbaseAlpha.id) {
      setIsWrongNetwork(true);
    } else {
      setIsWrongNetwork(false);
    }
  }, [isConnected, chainId, mounted]);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const metaMaskConnector = connectors.find(
        (connector) => connector.name === 'MetaMask'
      );
      if (metaMaskConnector) {
        connect({ connector: metaMaskConnector });
      }
    } catch (error) {
      console.error('Connection error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchNetwork = async () => {
    setIsLoading(true);
    try {
      // First try to switch to the chain
      switchChain(
        { chainId: moonbaseAlpha.id },
        {
          onSuccess: () => setIsLoading(false),
          onError: async (error: any) => {
            // If chain is not added, add it first
            if (error.code === 4902) {
              try {
                await (window as any).ethereum?.request({
                  method: 'wallet_addEthereumChain',
                  params: [
                    {
                      chainId: `0x${moonbaseAlpha.id.toString(16)}`,
                      chainName: 'Moonbase Alpha',
                      nativeCurrency: {
                        name: 'DEV',
                        symbol: 'DEV',
                        decimals: 18,
                      },
                      rpcUrls: ['https://rpc.api.moonbase.moonbeam.network'],
                      blockExplorerUrls: ['https://moonbase.moonscan.io'],
                    },
                  ],
                });
                // After adding, try switching again
                setTimeout(() => {
                  switchChain({ chainId: moonbaseAlpha.id });
                }, 1000);
              } catch (addError) {
                console.error('Failed to add chain:', addError);
              }
            }
            setIsLoading(false);
          },
        }
      );
    } catch (error) {
      console.error('Error switching network:', error);
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return (
      <button
        disabled
        className="bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold opacity-50"
      >
        Loading...
      </button>
    );
  }

  if (isConnected && !isWrongNetwork) {
    return (
      <div className="flex items-center gap-4">
        <div className="bg-gray-700 px-4 py-2 rounded-lg">
          <p className="text-gray-400 text-sm">Connected Wallet</p>
          <p className="text-white font-mono text-sm">{address?.slice(0, 6)}...{address?.slice(-4)}</p>
        </div>
        <button
          onClick={() => disconnect()}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
        >
          Disconnect
        </button>
      </div>
    );
  }

  if (isConnected && isWrongNetwork) {
    return (
      <div className="flex items-center gap-4">
        <div className="bg-red-900 px-4 py-2 rounded-lg">
          <p className="text-red-300 text-sm">Wrong Network</p>
          <p className="text-white text-xs">Switch to Moonbase Alpha</p>
        </div>
        <button
          onClick={handleSwitchNetwork}
          disabled={isLoading}
          className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition"
        >
          {isLoading ? 'Switching...' : 'Switch Network'}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isLoading}
      className="bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-semibold transition"
    >
      {isLoading ? 'Connecting...' : 'Connect MetaMask'}
    </button>
  );
}