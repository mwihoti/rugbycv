'use client';
import { useAccount, useReadContract } from 'wagmi';
import { ConnectWallet } from '@/components/ConnectWallet';
import { profileAbi, JOB_BOARD_ADDRESS } from '@/lib/contracts';
import { moonbaseAlpha } from '@/lib/chains';

export default function Home() {
  const { address } = useAccount();
  const { data: profile } = useReadContract({
    address: PROFILE_ADDRESS,
    abi: profileAbi,
    functionName: 'getProfile',
    args: [1n], // Example tokenId
    chainId: moonbaseAlpha.id,
  });

  return (
    <div>
      <ConnectWallet />
      {address ? <p>Connected: {address}</p> : <p>Connect wallet</p>}
      {profile && <div>Player: {profile[0].name} - Available: {profile[0].availableForTransfer ? 'Yes' : 'No'}</div>}
      {/* List more via loop over tokenIds */}
    </div>
  );
}