'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useRouter } from 'next/navigation';
import { PROFILE_ADDRESS, profileAbi } from '@/lib/contracts';

interface ProfileFormData {
  name: string;
  position: string;
  height: number;
  weight: number;
  secondJob: string;
  injuryStatus: string;
  availableForTransfer: boolean;
  videoHash: string;
}

export default function ProfileForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>();
  const { isConnected } = useAccount();
  const { writeContract, isPending, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (isSuccess) {
      // Redirect to my profile page after 3 seconds
      const timer = setTimeout(() => {
        router.push('/my-profile');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, router]);

  const onSubmit = async (data: ProfileFormData) => {
    setErrorMessage('');

    if (!isConnected) {
      setErrorMessage('Please connect your wallet first');
      return;
    }

    try {
      writeContract({
        address: PROFILE_ADDRESS as `0x${string}`,
        abi: profileAbi,
        functionName: 'createProfile',
        args: [
          data.name,
          data.position,
          BigInt(data.height),
          BigInt(data.weight),
          data.secondJob || '',
          data.injuryStatus || '',
          data.availableForTransfer,
          data.videoHash || '',
        ],
      });
    } catch (error) {
      console.error('Error creating profile:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to create profile');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {isSuccess && (
        <div className="bg-gradient-to-br from-green-900 to-green-800 p-12 rounded-lg border-2 border-green-500 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-4">
              <span className="text-4xl">✓</span>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-white mb-2">Profile Created Successfully!</h2>
          <p className="text-green-200 text-lg mb-8">
            Your rugby profile has been minted as an NFT on Moonbase Alpha
          </p>

          <div className="bg-green-800 p-6 rounded-lg mb-8 text-left">
            <h3 className="text-lg font-semibold text-white mb-4">Transaction Details</h3>
            {hash && (
              <div className="space-y-3">
                <div>
                  <p className="text-green-300 text-sm">Transaction Hash</p>
                  <p className="text-white font-mono text-xs break-all">{hash}</p>
                </div>
                <div>
                  <p className="text-green-300 text-sm mb-2">View on Block Explorer</p>
                  <a
                    href={`https://moonbase.moonscan.io/tx/${hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition"
                  >
                    View on Moonscan →
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="bg-green-800 p-6 rounded-lg mb-8 text-left">
            <h3 className="text-lg font-semibold text-white mb-4">What's Next?</h3>
            <ul className="space-y-3 text-green-200">
              <li className="flex items-start">
                <span className="text-green-400 mr-3 font-bold">✓</span>
                <span>Your profile is now live on the blockchain</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-3 font-bold">✓</span>
                <span>You can now apply to job opportunities with your wallet</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-3 font-bold">✓</span>
                <span>Earn verification badges from coaches and KRU</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-3 font-bold">✓</span>
                <span>Track all applications on-chain with full transparency</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-3 font-bold">✓</span>
                <span>Your profile is owned by you, forever</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => router.push('/my-profile')}
              className="block w-full bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-bold transition text-center"
            >
              View Your Profile →
            </button>
            <a
              href="/jobs"
              className="inline-block w-full bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-lg font-bold transition text-center"
            >
              Explore Job Board
            </a>
            <a
              href="/"
              className="inline-block w-full bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-bold transition text-center"
            >
              Back to Home
            </a>
          </div>

          <p className="text-gray-300 text-xs mt-6">
            Redirecting to your profile in 3 seconds...
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Your profile has been permanently stored on the blockchain
          </p>
        </div>
      )}

      {!isSuccess && (
        <div className="bg-gray-700 p-8 rounded-lg border border-gray-600">
          <h2 className="text-3xl font-bold text-white mb-6">Create Your Rugby Profile</h2>
          
          {errorMessage && (
            <div className="bg-red-600 text-white p-4 rounded-lg mb-6">
              <p className="text-sm">Error: {errorMessage}</p>
            </div>
          )}

          {hash && !isSuccess && (
            <div className="bg-blue-600 text-white p-4 rounded-lg mb-6">
              <p className="text-sm font-semibold mb-1">Transaction Submitted</p>
              <p className="text-xs">
                Hash: <a href={`https://moonbase.moonscan.io/tx/${hash}`} target="_blank" rel="noopener noreferrer" className="underline">
                  {hash.slice(0, 10)}...{hash.slice(-8)}
                </a>
              </p>
              <p className="text-xs mt-2">{isConfirming ? 'Confirming transaction on blockchain...' : 'Waiting for blockchain confirmation...'}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-semibold mb-2">Full Name *</label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Sam Kipchoge"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Position *</label>
                <select
                  {...register('position', { required: 'Position is required' })}
                  className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Position</option>
                  <option value="Hooker">Hooker</option>
                  <option value="Prop">Prop</option>
                  <option value="Lock">Lock</option>
                  <option value="Flanker">Flanker</option>
                  <option value="Number 8">Number 8</option>
                  <option value="Scrum Half">Scrum Half</option>
                  <option value="Fly Half">Fly Half</option>
                  <option value="Winger">Winger</option>
                  <option value="Centre">Centre</option>
                  <option value="Full Back">Full Back</option>
                </select>
                {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-semibold mb-2">Height (cm) *</label>
                <input
                  type="number"
                  {...register('height', { required: 'Height is required', valueAsNumber: true })}
                  className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., 185"
                />
                {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height.message}</p>}
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Weight (kg) *</label>
                <input
                  type="number"
                  {...register('weight', { required: 'Weight is required', valueAsNumber: true })}
                  className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., 95"
                />
                {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Current Job / Course</label>
              <input
                {...register('secondJob')}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., Data Analyst @ Tech Firm"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Injury Status</label>
              <input
                {...register('injuryStatus')}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., Fit, Minor hamstring issue"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Video Hash (IPFS)</label>
              <input
                {...register('videoHash')}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., Qm..."
              />
              <p className="text-gray-400 text-sm mt-2">Upload your 15-second highlight video to IPFS</p>
            </div>

            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                {...register('availableForTransfer')}
                className="w-5 h-5 accent-green-500 cursor-pointer"
              />
              <label className="text-white font-semibold cursor-pointer">
                I'm available for transfer / new opportunities
              </label>
            </div>

            <button
              type="submit"
              disabled={isPending || isConfirming || !isConnected}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition"
            >
              {isPending ? 'Confirming in MetaMask...' : isConfirming ? 'Creating Profile...' : 'Create Profile (Free on Testnet)'}
            </button>

            <p className="text-gray-400 text-sm text-center">
              Your profile will be minted as an ERC-721 NFT on Moonbase Alpha
            </p>
          </form>
        </div>
      )}
    </div>
  );
}
