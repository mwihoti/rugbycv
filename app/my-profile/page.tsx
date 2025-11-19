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

export default function MyProfilePage() {
  const { isConnected, address } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
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

  const fetchProfile = async (walletAddress: string) => {
    setLoading(true);
    setError('');
    try {
      // Fetch transactions to find profile creation
      const response = await fetch(
        `https://api-moonbase.moonscan.io/api?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&sort=desc&apikey=abc`
      );
      const data = await response.json();

      if (data.result && Array.isArray(data.result)) {
        // Look for createProfile transactions
        const profileSelector = getCreateProfileSelector();
        const profileTxs = data.result.filter((tx: any) => 
          tx.to?.toLowerCase() === PROFILE_ADDRESS.toLowerCase() &&
          tx.isError === '0' &&
          tx.input?.toLowerCase().startsWith(profileSelector.toLowerCase())
        );

        if (profileTxs.length > 0) {
          const latestTx = profileTxs[0];
          
          // Decode the transaction input
          if (latestTx.input && latestTx.input.startsWith('0x')) {
            try {
              const decodedProfile = decodeCreateProfileInput(latestTx.input as `0x${string}`);
              
              if (decodedProfile) {
                setProfile({
                  ...decodedProfile,
                  transactionHash: latestTx.hash,
                  createdAt: new Date(Number(latestTx.timeStamp) * 1000).toLocaleDateString(),
                });
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
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Navigation */}
      <nav className="bg-gray-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <div className="text-2xl font-bold text-green-500 cursor-pointer">RugbyCV Kenya</div>
          </Link>
          <div className="space-x-4 flex items-center">
            <Link href="/" className="text-white hover:text-green-500 transition">Home</Link>
            <Link href="/jobs" className="text-white hover:text-green-500 transition">Jobs</Link>
            <Link href="/create-profile" className="text-white hover:text-green-500 transition">Create Profile</Link>
            <ConnectWallet />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        {!isConnected ? (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gray-700 p-12 rounded-lg border border-gray-600">
              <h2 className="text-3xl font-bold text-white mb-6">View Your Profile</h2>
              <p className="text-gray-300 mb-8">
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
            <div className="bg-gray-700 p-8 rounded-lg border border-gray-600">
              <div className="bg-yellow-900 border-l-4 border-yellow-500 p-4 rounded">
                <p className="text-yellow-200 font-semibold">Profile Not Found</p>
                <p className="text-yellow-300 text-sm mt-2">
                  {error || 'No profile has been created for this wallet yet.'}
                </p>
              </div>
              <div className="mt-6 text-center">
                <Link href="/create-profile">
                  <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-bold transition">
                    Create Your Profile
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            {/* Profile Card */}
            <div className="bg-gray-700 p-8 rounded-lg border border-gray-600">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div>
                  <h2 className="text-4xl font-bold text-white mb-2">{profile.name}</h2>
                  <p className="text-green-400 text-lg mb-6">{profile.position}</p>

                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-400 text-sm">Height</p>
                      <p className="text-white font-semibold">{profile.height} cm</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Weight</p>
                      <p className="text-white font-semibold">{profile.weight} kg</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Current Job</p>
                      <p className="text-white font-semibold">{profile.secondJob}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Injury Status</p>
                      <p className="text-white font-semibold">{profile.injuryStatus}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Available for Transfer</p>
                      <p className="text-white font-semibold">
                        {profile.availableForTransfer ? '✓ Yes' : '✗ No'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div>
                  <div className="bg-green-900 p-6 rounded-lg border border-green-500 mb-6">
                    <h3 className="text-green-200 font-semibold mb-4">Blockchain Verified</h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-green-300">Wallet Address</p>
                        <p className="text-white font-mono text-xs break-all">{address}</p>
                      </div>
                      {profile.transactionHash && (
                        <div>
                          <p className="text-green-300">Transaction Hash</p>
                          <a
                            href={`https://moonbase.moonscan.io/tx/${profile.transactionHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-400 hover:text-green-300 font-mono text-xs break-all underline"
                          >
                            {profile.transactionHash.slice(0, 20)}...
                          </a>
                        </div>
                      )}
                      {profile.createdAt && (
                        <div>
                          <p className="text-green-300">Created</p>
                          <p className="text-white">{profile.createdAt}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <a
                      href="/jobs"
                      className="block bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-bold transition text-center"
                    >
                      Browse Job Board
                    </a>
                    {address && (
                      <a
                        href={`https://moonbase.moonscan.io/address/${address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-bold transition text-center"
                      >
                        View on Moonscan
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-600">
                <h3 className="text-white font-bold mb-4">Verification Badges</h3>
                <div className="flex gap-3">
                  <span className="px-4 py-2 bg-blue-900 text-blue-200 rounded-lg text-sm">Blockchain Verified ✓</span>
                  <span className="px-4 py-2 bg-gray-600 text-gray-300 rounded-lg text-sm">Awaiting Coach Badge</span>
                  <span className="px-4 py-2 bg-gray-600 text-gray-300 rounded-lg text-sm">Awaiting KRU Badge</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
