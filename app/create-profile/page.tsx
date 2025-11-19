'use client';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import ConnectWallet from '@/components/ConnectWallet';
import ProfileForm from '@/components/ProfileForm';
import TransactionHistory from '@/components/TransactionHistory';

export default function CreateProfilePage() {
  const { isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-gray-900">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <div className="text-2xl font-bold text-green-600 cursor-pointer">RugbyCV Kenya</div>
          </Link>
          <div className="space-x-4 flex items-center">
            <Link href="/" className="text-gray-900 hover:text-green-600 transition">Home</Link>
            <Link href="/jobs" className="text-gray-900 hover:text-green-600 transition">Jobs</Link>
            <Link href="/my-profile" className="text-gray-900 hover:text-green-600 transition">My Profile</Link>
            <ConnectWallet />
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-4 py-16">
        {!isConnected ? (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white p-12 rounded-lg border border-gray-300">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Connect Your Wallet</h2>
              <p className="text-gray-600 mb-8">
                To create your RugbyCV profile, you need to connect your MetaMask wallet first. 
                This ensures your profile is owned and verified on the blockchain.
              </p>
              <div className="flex justify-center mb-6">
                <ConnectWallet />
              </div>
              <p className="text-gray-400 text-sm">
                Don't have MetaMask? <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-400">Download it here</a>
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Create Your Profile</h1>
                <p className="text-gray-300">
                  Your profile will be minted as an NFT on the Moonbase Alpha testnet. After submission, you can apply to jobs and earn badges.
                </p>
              </div>
              <ProfileForm />
            </div>
            
            <div>
              <TransactionHistory />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
