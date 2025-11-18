'use client';
import { useWriteContract } from 'wagmi';
import { profileAbi } from '@/lib/contracts';
import { parseUnits } from 'viem';

export default function ProfileForm() {
  const { writeContract } = useWriteContract();

  const handleCreate = (formData: any) => {
    writeContract({
      address: PROFILE_ADDRESS,
      abi: profileAbi,
      functionName: 'createProfile',
      args: [
        formData.name,
        formData.position,
        BigInt(formData.height),
        BigInt(formData.weight),
        formData.secondJob,
        formData.injuryStatus,
        formData.availableForTransfer,
        formData.videoHash, // IPFS
      ],
    });
  };

  // Form JSX here (use react-hook-form)
  return <form onSubmit={handleCreate}>...</form>;
}