'use client';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import ConnectWallet from '@/components/ConnectWallet';
import { PROFILE_ADDRESS } from '@/lib/contracts';
import { decodeCreateProfileInput, getCreateProfileSelector } from '@/lib/profileUtils';

interface ProfileData {
  name: string;
  position: string;
  height: number;
  weight: number;
  secondJob: string;
  injuryStatus: string;
  availableForTransfer: boolean;
  videoHash: string;
  transactionHash?: string;
  createdAt?: string;
}

interface BlockData {
  blockNumber: number;
  blockHash: string;
  timestamp: string;
  gasUsed: number;
  gasLimit: number;
  miner: string;
  transactionCount: number;
}

export default function MyProfilePage() {
  const { isConnected, address } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [blockData, setBlockData] = useState<BlockData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isConnected && address) {
      fetchProfile(address);
    }
  }, [isConnected, address, mounted]);

  const fetchBlockData = async (blockNumber: number) => {
    try {
      const response = await fetch(
        `https://api-moonbase.moonscan.io/api?module=proxy&action=eth_getBlockByNumber&tag=0x${blockNumber.toString(16)}&boolean=true&apikey=abc`
      );
      
      if (!response.ok) throw new Error('Failed to fetch block data');
      
      const data = await response.json();
      
      if (data.result) {
        const block = data.result;
        setBlockData({
          blockNumber: parseInt(block.number, 16),
          blockHash: block.hash,
          timestamp: new Date(parseInt(block.timestamp, 16) * 1000).toLocaleString(),
          gasUsed: parseInt(block.gasUsed, 16),
          gasLimit: parseInt(block.gasLimit, 16),
          miner: block.miner,
          transactionCount: block.transactions.length,
        });
        console.log('Block data fetched:', {
          blockNumber: parseInt(block.number, 16),
          gasUsed: parseInt(block.gasUsed, 16),
        });
      }
    } catch (err) {
      console.error('Error fetching block data:', err);
    }
  };

  const fetchProfile = async (walletAddress: string) => {
    setLoading(true);
    setError('');
    try {
      // First, check localStorage for recently created profile
      const cachedProfile = localStorage.getItem(`profile_${walletAddress}`);
      if (cachedProfile) {
        try {
          const profileData = JSON.parse(cachedProfile);
          console.log('Profile found in localStorage:', profileData);
          setProfile(profileData);
          setLoading(false);
          return;
        } catch (e) {
          console.log('Could not parse cached profile');
        }
      }
      
      // Fetch transactions to find profile creation
      const response = await fetch(
        `https://api-moonbase.moonscan.io/api?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&sort=desc&apikey=abc`
      );
      const data = await response.json();

      if (data.result && Array.isArray(data.result)) {
        console.log('Total transactions:', data.result.length);
        console.log('Profile address:', PROFILE_ADDRESS);
        
        // Look for createProfile transactions
        const profileSelector = getCreateProfileSelector();
        console.log('Function selector:', profileSelector);
        
        const profileTxs = data.result.filter((tx: any) => {
          const isToProfile = tx.to?.toLowerCase() === PROFILE_ADDRESS.toLowerCase();
          const isSuccess = tx.isError === '0';
          const hasInput = !!tx.input;
          const isCreateProfile = tx.input?.toLowerCase().startsWith(profileSelector.toLowerCase());
          
          if (isToProfile && hasInput) {
            console.log('TX to profile contract:', {
              hash: tx.hash,
              inputStart: tx.input?.slice(0, 10),
              isSuccess,
              isCreateProfile
            });
          }
          
          return isToProfile && isSuccess && isCreateProfile;
        });

        console.log('Profile transactions found:', profileTxs.length);

        if (profileTxs.length > 0) {
          const latestTx = profileTxs[0];
          console.log('Latest profile TX:', latestTx.hash);
          
          // Decode the transaction input
          if (latestTx.input && latestTx.input.startsWith('0x')) {
            try {
              const decodedProfile = decodeCreateProfileInput(latestTx.input as `0x${string}`);
              console.log('Decoded profile:', decodedProfile);
              
              if (decodedProfile) {
                const fullProfile = {
                  ...decodedProfile,
                  transactionHash: latestTx.hash,
                  createdAt: new Date(Number(latestTx.timeStamp) * 1000).toLocaleDateString(),
                };
                setProfile(fullProfile);
                // Cache it
                localStorage.setItem(`profile_${walletAddress}`, JSON.stringify(fullProfile));
                // Fetch block data
                if (latestTx.blockNumber) {
                  fetchBlockData(Number(latestTx.blockNumber));
                }
              } else {
                setError('Profile found but could not decode data.');
              }
            } catch (decodeErr) {
              console.error('Error decoding transaction:', decodeErr);
              setError('Failed to decode profile data from transaction.');
            }
          }
        } else {
          setError('No profile found. Create one to get started!');
        }
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to fetch your profile. Make sure you have created one.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <div className="text-2xl font-bold text-green-600 cursor-pointer">RugbyCV Kenya</div>
          </Link>
          <div className="space-x-4 flex items-center">
            <Link href="/" className="text-gray-900 hover:text-green-600 transition">Home</Link>
            <Link href="/jobs" className="text-gray-900 hover:text-green-600 transition">Jobs</Link>
            <Link href="/create-profile" className="text-gray-900 hover:text-green-600 transition">Create Profile</Link>
            <ConnectWallet />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        {!isConnected ? (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white p-12 rounded-lg border border-gray-300">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">View Your Profile</h2>
              <p className="text-gray-600 mb-8">
                Connect your wallet to see your on-chain rugby profile
              </p>
              <div className="flex justify-center mb-6">
                <ConnectWallet />
              </div>
            </div>
          </div>
        ) : loading ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-700 p-8 rounded-lg border border-gray-600">
              <p className="text-gray-300 text-center">Loading your profile...</p>
            </div>
          </div>
        ) : error || !profile ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-lg border border-gray-300">
              <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded">
                <p className="text-yellow-900 font-semibold">Profile Not Found</p>
                <p className="text-yellow-800 text-sm mt-2">
                  {error || 'No profile has been created for this wallet yet.'}
                </p>
              </div>
              <div className="mt-6 text-center">
                <Link href="/create-profile">
                  <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold transition">
                    Create Your Profile
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            {/* Profile Card */}
            <div className="bg-white p-8 rounded-lg border border-gray-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-2">{profile.name}</h2>
                  <p className="text-green-600 text-lg mb-6">{profile.position}</p>

                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-600 text-sm">Height</p>
                      <p className="text-gray-900 font-semibold">{profile.height} cm</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Weight</p>
                      <p className="text-gray-900 font-semibold">{profile.weight} kg</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Current Job</p>
                      <p className="text-gray-900 font-semibold">{profile.secondJob}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Injury Status</p>
                      <p className="text-gray-900 font-semibold">{profile.injuryStatus}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Available for Transfer</p>
                      <p className="text-gray-900 font-semibold">
                        {profile.availableForTransfer ? '✓ Yes' : '✗ No'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div>
                  <div className="bg-green-50 p-6 rounded-lg border border-green-200 mb-6">
                    <h3 className="text-green-900 font-semibold mb-4">Blockchain Verified</h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-green-700">Wallet Address</p>
                        <p className="text-gray-900 font-mono text-xs break-all">{address}</p>
                      </div>
                      {profile.transactionHash && (
                        <div>
                          <p className="text-green-700">Transaction Hash</p>
                          <a
                            href={`https://moonbase.moonscan.io/tx/${profile.transactionHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-700 font-mono text-xs break-all underline"
                          >
                            {profile.transactionHash.slice(0, 20)}...
                          </a>
                        </div>
                      )}
                      {profile.createdAt && (
                        <div>
                          <p className="text-green-700">Created</p>
                          <p className="text-gray-900">{profile.createdAt}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {blockData && (
                    <div className="bg-gray-100 p-6 rounded-lg border border-gray-300 mb-6">
                      <h3 className="text-gray-900 font-semibold mb-4">Block Information</h3>
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="text-gray-600">Block Height</p>
                          <p className="text-gray-900 font-mono">#{blockData.blockNumber}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Block Hash</p>
                          <p className="text-gray-900 font-mono text-xs break-all">{blockData.blockHash.slice(0, 20)}...</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Timestamp</p>
                          <p className="text-gray-900">{blockData.timestamp}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Gas Used</p>
                          <p className="text-gray-900 font-mono">{blockData.gasUsed.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Gas Limit</p>
                          <p className="text-gray-900 font-mono">{blockData.gasLimit.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Miner / Collator</p>
                          <p className="text-gray-900 font-mono text-xs break-all">{blockData.miner.slice(0, 20)}...</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Transactions</p>
                          <p className="text-gray-900">{blockData.transactionCount}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <a
                      href="/jobs"
                      className="block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold transition text-center"
                    >
                      Browse Job Board
                    </a>
                    {address && (
                      <a
                        href={`https://moonbase.moonscan.io/address/${address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-gray-300 hover:bg-gray-400 text-gray-900 px-6 py-3 rounded-lg font-bold transition text-center"
                      >
                        View on Moonscan
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-300">
                <h3 className="text-gray-900 font-bold mb-4">Verification Badges</h3>
                <div className="flex gap-3">
                  <span className="px-4 py-2 bg-blue-100 text-blue-900 rounded-lg text-sm">Blockchain Verified ✓</span>
                  <span className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg text-sm">Awaiting Coach Badge</span>
                  <span className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg text-sm">Awaiting KRU Badge</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
