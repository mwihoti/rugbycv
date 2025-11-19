'use client';
import { useEffect, useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { PROFILE_ADDRESS, profileAbi } from '@/lib/contracts';
import { publicClient } from '@/lib/chains';

interface CreatedProfile {
  name: string;
  position: string;
  height: bigint;
  weight: bigint;
  secondJob: string;
  injuryStatus: string;
  availableForTransfer: boolean;
  videoHash: string;
  owner: string;
}

export default function MyProfile() {
  const { address, isConnected } = useAccount();
  const [profile, setProfile] = useState<CreatedProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isConnected && address) {
      fetchMyProfile(address);
    }
  }, [address, isConnected, mounted]);

  const fetchMyProfile = async (walletAddress: string) => {
    setLoading(true);
    setError('');
    try {
      // Try to read the profile from the contract
      // This would require the contract to have a mapping of address to profile
      // For now, we'll show a message that the feature is coming
      console.log('Fetching profile for address:', walletAddress);
      
      // Mock fetch - in a real app, this would query the smart contract
      // For demonstration, we'll just show that the feature is ready
      
      // Check if any transactions exist for profile creation
      const response = await fetch(
        `https://api-moonbase.moonscan.io/api?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&sort=desc&apikey=abc`
      );
      const data = await response.json();

      if (data.result && data.result.length > 0) {
        // Find profile creation transactions
        const profileTxs = data.result.filter((tx: any) => 
          tx.to?.toLowerCase() === PROFILE_ADDRESS.toLowerCase() &&
          tx.input?.includes('createProfile')
        );

        if (profileTxs.length > 0) {
          // Profile was created
          setProfile({
            name: 'Profile Created',
            position: 'On-Chain Player',
            height: BigInt(0),
            weight: BigInt(0),
            secondJob: '',
            injuryStatus: '',
            availableForTransfer: true,
            videoHash: '',
            owner: walletAddress,
          });
        }
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to fetch your profile');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || !isConnected) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-blue-900 border-l-4 border-blue-500 p-4 mb-6">
        <p className="text-blue-200">Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900 border-l-4 border-red-500 p-4 mb-6">
        <p className="text-red-200">{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-yellow-900 border-l-4 border-yellow-500 p-4 mb-6">
        <p className="text-yellow-200">You haven't created a profile yet. </p>
        <p className="text-yellow-300 text-sm mt-2">
          <a href="/create-profile" className="underline hover:no-underline">Create your profile now</a> to start applying for jobs!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-green-900 border-l-4 border-green-500 p-4 mb-6">
      <p className="text-green-200 font-semibold">✓ Your Profile is On-Chain!</p>
      <p className="text-green-300 text-sm mt-2">
        Your blockchain profile is ready. You can now apply to jobs with full transparency.
      </p>
      <div className="mt-3 flex gap-2">
        <a 
          href="/jobs" 
          className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded text-sm"
        >
          Browse Jobs
        </a>
        <a 
          href={`https://moonbase.moonscan.io/address/${address}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block bg-green-700 hover:bg-green-800 text-white px-4 py-1 rounded text-sm"
        >
          View on Moonscan
        </a>
      </div>
    </div>
  );
}
