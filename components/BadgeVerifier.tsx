'use client';
import { useState } from 'react';

export default function BadgeVerifier() {
  const [selectedBadge, setSelectedBadge] = useState<string>('');
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');

  const badges = [
    {
      id: 'coach-verified',
      name: 'Coach Verified',
      description: 'Verified by an official rugby coach',
      issuer: 'Coaching Board'
    },
    {
      id: 'kru-gold',
      name: 'KRU Gold Tick',
      description: 'Verified by Kenya Rugby Union',
      issuer: 'KRU'
    },
    {
      id: 'payment-verified',
      name: 'Payment Verified',
      description: 'No payment delays in last 12 months',
      issuer: 'RugbyCV'
    },
    {
      id: 'performance-star',
      name: 'Performance Star',
      description: 'Top performer in Kenya Cup',
      issuer: 'Kenya Cup Admin'
    }
  ];

  const handleVerify = async () => {
    if (!selectedBadge) return;
    
    setVerificationStatus('verifying');
    try {
      // Simulate badge verification
      await new Promise(resolve => setTimeout(resolve, 2000));
      setVerificationStatus('success');
      setTimeout(() => {
        setVerificationStatus('idle');
        setSelectedBadge('');
      }, 2000);
    } catch (error) {
      setVerificationStatus('error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-700 p-8 rounded-lg border border-gray-600">
        <h2 className="text-3xl font-bold text-white mb-6">Badge Verification System</h2>

        {/* Status Messages */}
        {verificationStatus === 'success' && (
          <div className="bg-green-600 text-white p-4 rounded-lg mb-6">
            ✓ Badge verified successfully and added to profile!
          </div>
        )}
        {verificationStatus === 'error' && (
          <div className="bg-red-600 text-white p-4 rounded-lg mb-6">
            ✗ Verification failed. Please try again.
          </div>
        )}

        {/* Badge Selection */}
        <div className="mb-8">
          <label className="block text-white font-semibold mb-4">Select Badge to Verify</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.id}
                onClick={() => setSelectedBadge(badge.id)}
                className={`p-4 rounded-lg cursor-pointer transition border-2 ${
                  selectedBadge === badge.id
                    ? 'border-green-500 bg-green-500 bg-opacity-10'
                    : 'border-gray-600 bg-gray-600 hover:bg-gray-500'
                }`}
              >
                <h3 className="text-white font-bold">{badge.name}</h3>
                <p className="text-gray-400 text-sm">{badge.description}</p>
                <p className="text-gray-500 text-xs mt-2">Issuer: {badge.issuer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Details */}
        {selectedBadge && (
          <div className="bg-gray-600 p-6 rounded-lg mb-8">
            <h3 className="text-white font-bold mb-4">Verification Details</h3>
            <div className="space-y-3 text-gray-300 text-sm">
              <p>
                <span className="font-semibold">Badge:</span> {badges.find(b => b.id === selectedBadge)?.name}
              </p>
              <p>
                <span className="font-semibold">Issuer:</span> {badges.find(b => b.id === selectedBadge)?.issuer}
              </p>
              <p>
                <span className="font-semibold">Blockchain:</span> Moonbase Alpha
              </p>
              <p>
                <span className="font-semibold">Status:</span> <span className="text-yellow-500">Pending Signature</span>
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleVerify}
            disabled={!selectedBadge || verificationStatus === 'verifying'}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition ${
              selectedBadge && verificationStatus !== 'verifying'
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            {verificationStatus === 'verifying' ? 'Verifying...' : 'Verify & Sign'}
          </button>
          <button
            onClick={() => setSelectedBadge('')}
            className="px-6 py-3 rounded-lg font-semibold bg-gray-600 hover:bg-gray-500 text-white transition"
          >
            Cancel
          </button>
        </div>

        {/* Info Box */}
        <div className="mt-8 p-4 bg-blue-500 bg-opacity-10 border border-blue-500 rounded-lg">
          <p className="text-blue-300 text-sm">
            <span className="font-semibold">ℹ️ How it works:</span> Badge verification requires your digital signature to confirm you own this profile. No transaction fees on testnet.
          </p>
        </div>
      </div>
    </div>
  );
}