'use client';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

interface Transaction {
  hash: string;
  from: string;
  to: string | null;
  value: string;
  gasPrice: string;
  blockNumber: number;
  timeStamp: string;
  contractAddress: string;
  input: string;
  methodId: string;
  functionName: string;
  type: 'sent' | 'received' | 'contract';
}

export default function TransactionHistory() {
  const { address, isConnected } = useAccount();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isConnected && address) {
      fetchTransactions(address);
    }
  }, [address, isConnected, mounted]);

  const fetchTransactions = async (walletAddress: string) => {
    setLoading(true);
    setError('');
    try {
      // Try Moonscan API first
      const moonscanUrl = `https://api-moonbase.moonscan.io/api?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&sort=desc&apikey=abc`;
      
      console.log('Fetching transactions for:', walletAddress);
      
      const response = await fetch(moonscanUrl);
      const data = await response.json();

      console.log('API Response:', {
        status: data.status,
        message: data.message,
        resultCount: Array.isArray(data.result) ? data.result.length : 'not an array'
      });

      // Check if we have valid results
      if (data.result && Array.isArray(data.result) && data.result.length > 0) {
        const txs: Transaction[] = data.result
          .slice(0, 20) // Limit to 20 most recent
          .map((tx: any) => ({
            hash: tx.hash,
            from: tx.from,
            to: tx.to || null,
            value: tx.value ? (Number(tx.value) / 1e18).toFixed(4) : '0',
            gasPrice: tx.gasPrice ? (Number(tx.gasPrice) / 1e9).toFixed(2) : '0',
            blockNumber: Number(tx.blockNumber),
            timeStamp: new Date(Number(tx.timeStamp) * 1000).toLocaleDateString(),
            contractAddress: tx.contractAddress || '',
            input: tx.input,
            methodId: tx.input?.slice(0, 10) || '',
            functionName: getFunctionName(tx.input?.slice(0, 10) || ''),
            type: determineTxType(tx.from, tx.to, walletAddress),
          }));
        console.log('Successfully loaded', txs.length, 'transactions');
        setTransactions(txs);
      } else {
        console.log('No transaction data in response');
        setTransactions([]);
        // Only set error if API explicitly errored
        if (data.status !== '1' && data.message) {
          setError(`API: ${data.message}`);
        }
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to fetch transactions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const determineTxType = (from: string, to: string | null, wallet: string): 'sent' | 'received' | 'contract' => {
    const fromLower = from.toLowerCase();
    const toLower = to?.toLowerCase() || '';
    const walletLower = wallet.toLowerCase();

    if (to === null || to === '0x0000000000000000000000000000000000000000') {
      return 'contract';
    }
    if (fromLower === walletLower) {
      return 'sent';
    }
    return 'received';
  };

  const getFunctionName = (methodId: string): string => {
    const commonMethods: Record<string, string> = {
      '0xa9059cbb': 'Transfer',
      '0x095ea7b3': 'Approve',
      '0x23b872dd': 'TransferFrom',
      '0x6a627842': 'Mint',
      '0x4e71d92d': 'Burn',
      '0x': 'Transfer DEV',
    };
    return commonMethods[methodId] || 'Contract Interaction';
  };

  if (!mounted) {
    return <div className="text-gray-400">Loading transaction history...</div>;
  }

  if (!isConnected) {
    return <div className="text-gray-400">Connect wallet to see transactions</div>;
  }

  return (
    <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white">Transaction History</h3>
        <button
          onClick={() => address && fetchTransactions(address)}
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="bg-red-600 text-white p-4 rounded-lg mb-4">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {loading && transactions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">Loading transactions...</p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400 text-sm">No transactions found</p>
          <p className="text-gray-500 text-xs mt-2">Transactions may take a moment to appear on Moonscan</p>
          <button
            onClick={() => address && fetchTransactions(address)}
            className="mt-4 text-green-500 hover:text-green-400 text-xs underline"
          >
            Try refreshing again
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-left py-3 px-4 text-gray-300 font-semibold">Type</th>
                <th className="text-left py-3 px-4 text-gray-300 font-semibold">Function</th>
                <th className="text-left py-3 px-4 text-gray-300 font-semibold">Amount (DEV)</th>
                <th className="text-left py-3 px-4 text-gray-300 font-semibold">Gas Price (Gwei)</th>
                <th className="text-left py-3 px-4 text-gray-300 font-semibold">Date</th>
                <th className="text-left py-3 px-4 text-gray-300 font-semibold">Block</th>
                <th className="text-left py-3 px-4 text-gray-300 font-semibold">Link</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.hash} className="border-b border-gray-600 hover:bg-gray-600 transition">
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      tx.type === 'sent' ? 'bg-red-900 text-red-200' :
                      tx.type === 'received' ? 'bg-green-900 text-green-200' :
                      'bg-blue-900 text-blue-200'
                    }`}>
                      {tx.type === 'sent' ? '↗️ Sent' : tx.type === 'received' ? '↙️ Received' : '📄 Contract'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-300">{tx.functionName}</td>
                  <td className="py-3 px-4 text-gray-300 font-mono">{tx.value}</td>
                  <td className="py-3 px-4 text-gray-300 font-mono">{tx.gasPrice}</td>
                  <td className="py-3 px-4 text-gray-400 text-xs">{tx.timeStamp}</td>
                  <td className="py-3 px-4 text-gray-400 font-mono text-xs">{tx.blockNumber}</td>
                  <td className="py-3 px-4">
                    <a
                      href={`https://moonbase.moonscan.io/tx/${tx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-400 hover:text-green-300 text-xs underline"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-gray-500 text-xs mt-4">
        Data from Moonbase Alpha (testnet). Last 20 transactions shown.
      </p>
    </div>
  );
}
