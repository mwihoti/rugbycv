'use client';
import Link from 'next/link';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import ConnectWallet from '@/components/ConnectWallet';
import TransactionHistory from '@/components/TransactionHistory';
import { JOB_BOARD_ADDRESS, jobBoardAbi } from '@/lib/contracts';
import { useState, useEffect } from 'react';

interface Job {
  id: number;
  club: string;
  position: string;
  salary: string;
  description: string;
  deadline: string;
  applications: number;
}

const mockJobs: Job[] = [
  {
    id: 1,
    club: 'Kabras Sugar',
    position: 'Flanker',
    salary: '500,000 KES/month',
    description: 'Seeking experienced flanker for 2026 season',
    deadline: '2025-12-15',
    applications: 12,
  },
  {
    id: 2,
    club: 'KCB Rugby',
    position: 'Prop',
    salary: '450,000 KES/month',
    description: 'Tighthead prop needed for elite division',
    deadline: '2025-12-20',
    applications: 8,
  },
  {
    id: 3,
    club: 'Menengai Oilers',
    position: 'Scrum Half',
    salary: '400,000 KES/month',
    description: 'Dynamic scrum half to lead our attack',
    deadline: '2025-12-10',
    applications: 15,
  },
  {
    id: 4,
    club: 'Strathmore Leos',
    position: 'Lock',
    salary: '380,000 KES/month',
    description: 'Second row specialist for lineout excellence',
    deadline: '2026-01-05',
    applications: 6,
  },
];

export default function JobsPage() {
  const { isConnected, address } = useAccount();
  const { writeContract, isPending, data: hash } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash });
  const [appliedJobs, setAppliedJobs] = useState<number[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterPosition, setFilterPosition] = useState('');

  const handleApply = (job: Job) => {
    setErrorMessage('');
    
    if (!isConnected || !address) {
      setErrorMessage('Please connect your wallet to apply for jobs');
      return;
    }

    if (appliedJobs.includes(job.id)) {
      setErrorMessage('You have already applied to this job');
      return;
    }

    try {
      writeContract(
        {
          address: JOB_BOARD_ADDRESS as `0x${string}`,
          abi: jobBoardAbi,
          functionName: 'applyToJob',
          args: [BigInt(job.id)],
        },
        {
          onSuccess: () => {
            setAppliedJobs([...appliedJobs, job.id]);
            setSelectedJob(null);
          },
          onError: (error: any) => {
            console.error('Error applying to job:', error);
            setErrorMessage(error?.message || 'Failed to apply to job');
          },
        }
      );
    } catch (error) {
      console.error('Error applying to job:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to apply to job');
    }
  };

  const filteredJobs = filterPosition
    ? mockJobs.filter(job => job.position.toLowerCase().includes(filterPosition.toLowerCase()))
    : mockJobs;

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
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Rugby Job Board</h1>
          <p className="text-gray-300 text-lg">
            Discover opportunities from top Kenyan rugby clubs. Apply instantly, track your applications on-chain.
          </p>
        </div>

        {!isConnected && (
          <div className="bg-blue-900 border border-blue-700 p-6 rounded-lg mb-8">
            <p className="text-blue-100 mb-4">
              Connect your wallet to apply for jobs and track applications on the blockchain.
            </p>
            <ConnectWallet />
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-600 text-white p-4 rounded-lg mb-6">
            <p className="text-sm">{errorMessage}</p>
          </div>
        )}

        {hash && !isSuccess && (
          <div className="bg-blue-600 text-white p-4 rounded-lg mb-6">
            <p className="text-sm font-semibold mb-1">Application Submitted</p>
            <p className="text-xs">
              Transaction: <a href={`https://moonbase.moonscan.io/tx/${hash}`} target="_blank" rel="noopener noreferrer" className="underline">
                {hash.slice(0, 10)}...{hash.slice(-8)}
              </a>
            </p>
          </div>
        )}

        {isSuccess && (
          <div className="bg-green-600 text-white p-4 rounded-lg mb-6">
            <p className="text-sm font-semibold">✓ Job application confirmed on blockchain!</p>
          </div>
        )}

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-gray-700 p-6 rounded-lg">
            <p className="text-gray-400 text-sm">Open Positions</p>
            <p className="text-3xl font-bold text-white">{mockJobs.length}</p>
          </div>
          <div className="bg-gray-700 p-6 rounded-lg">
            <p className="text-gray-400 text-sm">Total Applications</p>
            <p className="text-3xl font-bold text-white">{mockJobs.reduce((acc, job) => acc + job.applications, 0)}</p>
          </div>
          <div className="bg-gray-700 p-6 rounded-lg">
            <p className="text-gray-400 text-sm">Clubs Hiring</p>
            <p className="text-3xl font-bold text-white">{new Set(mockJobs.map(j => j.club)).size}</p>
          </div>
          <div className="bg-gray-700 p-6 rounded-lg">
            <p className="text-gray-400 text-sm">Salary Range</p>
            <p className="text-2xl font-bold text-green-500">380K - 500K KES</p>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Filter by position (e.g., Flanker, Prop)..."
            value={filterPosition}
            onChange={(e) => setFilterPosition(e.target.value)}
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-gray-700 rounded-lg overflow-hidden hover:bg-gray-600 transition border border-gray-600">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-green-500 font-semibold text-sm">{job.club}</p>
                    <h3 className="text-2xl font-bold text-white">{job.position}</h3>
                  </div>
                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {job.salary}
                  </span>
                </div>

                <p className="text-gray-300 mb-4">{job.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div>
                    <p className="text-gray-400">Deadline</p>
                    <p className="text-white font-semibold">{new Date(job.deadline).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Applications</p>
                    <p className="text-white font-semibold">{job.applications}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedJob(job)}
                  disabled={!isConnected || appliedJobs.includes(job.id) || isPending}
                  className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition"
                >
                  {appliedJobs.includes(job.id) ? '✓ Applied' : isPending ? 'Applying...' : 'Apply Now'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No jobs found for "{filterPosition}"</p>
          </div>
        )}
      </section>

      {/* Application Confirmation Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-700 rounded-lg p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-white mb-4">Confirm Application</h3>
            <div className="bg-gray-600 p-4 rounded-lg mb-6">
              <p className="text-gray-400 text-sm">Position</p>
              <p className="text-white font-semibold text-lg">{selectedJob.position}</p>
              <p className="text-gray-400 text-sm mt-3">Club</p>
              <p className="text-white font-semibold text-lg">{selectedJob.club}</p>
              <p className="text-gray-400 text-sm mt-3">Salary</p>
              <p className="text-green-500 font-semibold text-lg">{selectedJob.salary}</p>
            </div>

            <p className="text-gray-300 text-sm mb-6">
              Your application will be recorded on the Moonbase Alpha blockchain. The club will be able to view your profile and respond.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => handleApply(selectedJob)}
                disabled={isPending}
                className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                {isPending ? 'Confirming in MetaMask...' : 'Confirm Application'}
              </button>
              <button
                onClick={() => setSelectedJob(null)}
                disabled={isPending}
                className="w-full bg-gray-600 hover:bg-gray-500 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                Cancel
              </button>
            </div>

            <TransactionHistory />
          </div>
        </div>
      )}
    </div>
  );
}
