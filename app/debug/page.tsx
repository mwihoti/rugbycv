'use client';

import { keccak256, toHex } from 'viem';

export default function DebugPage() {
  const functionSig = 'createProfile(string,string,uint256,uint256,string,string,bool,string)';
  const hash = keccak256(toHex(functionSig));
  const selector = hash.slice(0, 10);

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto bg-gray-800 p-6 rounded-lg text-white">
        <h1 className="text-3xl font-bold mb-6">Debug Info</h1>
        
        <div className="space-y-4">
          <div>
            <p className="text-gray-400 text-sm">Function Signature</p>
            <p className="font-mono text-lg break-all">{functionSig}</p>
          </div>
          
          <div>
            <p className="text-gray-400 text-sm">Keccak256 Hash</p>
            <p className="font-mono text-sm break-all">{hash}</p>
          </div>
          
          <div>
            <p className="text-gray-400 text-sm">Function Selector (first 10 chars)</p>
            <p className="font-mono text-xl font-bold text-green-400">{selector}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
