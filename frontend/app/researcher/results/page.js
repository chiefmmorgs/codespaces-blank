'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { useResearchOracle } from '@/hooks/useResearchOracle';
import { ArrowLeft, Search, Lock } from 'lucide-react';
import { formatTimestamp, formatAddress } from '@/lib/utils';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ResultsPage() {
  const { signer, address, isConnected } = useWallet();
  const { getQueryResult } = useResearchOracle(signer);
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(false);

  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Connect your wallet to view query results
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Link
        href="/researcher"
        className="inline-flex items-center space-x-2 text-primary-500 hover:text-primary-600 mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Dashboard</span>
      </Link>

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Query Results</h1>
        <p className="text-gray-600 dark:text-gray-400">
          View your executed queries and encrypted results
        </p>
      </div>

      {loading ? (
        <LoadingSpinner size="lg" />
      ) : queries.length === 0 ? (
        <div className="text-center py-20">
          <Search className="h-20 w-20 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">No queries executed yet</p>
          <Link
            href="/researcher/query"
            className="inline-block px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all"
          >
            Execute Your First Query
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {queries.map((query, index) => (
            <div
              key={index}
              className="card-3d p-6 glass-morphism rounded-xl border border-primary-500/20"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Query #{query.id}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Executed: {formatTimestamp(query.timestamp)}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  query.isComplete
                    ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                    : 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
                }`}>
                  {query.isComplete ? 'Complete' : 'Processing'}
                </span>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Lock className="h-4 w-4" />
                <span>Encrypted result available</span>
              </div>

              {query.isComplete && (
                <button className="mt-4 px-4 py-2 bg-primary-500/10 hover:bg-primary-500/20 text-primary-500 rounded-lg transition-all text-sm">
                  Decrypt Result
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 p-6 glass-morphism rounded-xl border border-primary-500/20">
        <h3 className="font-semibold mb-3 flex items-center space-x-2">
          <Lock className="h-5 w-5 text-primary-500" />
          <span>About Encrypted Results</span>
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Query results are encrypted and only you can decrypt them. The blockchain stores the encrypted output, 
          ensuring data privacy while maintaining result integrity. To decrypt, you'll need to request decryption 
          via the Zama Gateway service.
        </p>
      </div>
    </div>
  );
}