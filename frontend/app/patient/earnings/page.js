'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { usePaymentProcessor } from '@/hooks/usePaymentProcessor';
import StatsCard from '@/components/StatsCard';
import { ArrowLeft, Coins, Download, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function EarningsPage() {
  const { signer, address, isConnected } = useWallet();
  const { getPatientEarnings, withdrawEarnings, isLoading } = usePaymentProcessor(signer);
  const [earnings, setEarnings] = useState('0');
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (isConnected && address) {
      loadEarnings();
    }
  }, [isConnected, address]);

  const loadEarnings = async () => {
    setLoading(true);
    const data = await getPatientEarnings(address);
    setEarnings(data);
    setLoading(false);
  };

  const handleWithdraw = async () => {
    setResult(null);
    const res = await withdrawEarnings();
    setResult(res);
    if (res.success) {
      await loadEarnings();
    }
  };

  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Connect your wallet to view earnings
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link
        href="/patient"
        className="inline-flex items-center space-x-2 text-primary-500 hover:text-primary-600 mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Dashboard</span>
      </Link>

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Earnings</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your earnings from data queries
        </p>
      </div>

      {loading ? (
        <LoadingSpinner size="lg" />
      ) : (
        <>
          {result && (
            <div className={`mb-6 p-4 rounded-lg border ${
              result.success
                ? 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400'
                : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
            }`}>
              <div className="flex items-center space-x-2">
                {result.success ? (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    <span>Withdrawal successful!</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-5 w-5" />
                    <span>Error: {result.error}</span>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="mb-8">
            <StatsCard
              title="Available Earnings"
              value={`${parseFloat(earnings).toFixed(6)} ETH`}
              icon={Coins}
              gradient
            />
          </div>

          <div className="glass-morphism rounded-xl p-8 border border-primary-500/20">
            <h2 className="text-2xl font-bold mb-4">Withdraw Earnings</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You earn 70% of query fees when researchers use your encrypted data.
              Platform takes 30% fee.
            </p>

            <button
              onClick={handleWithdraw}
              disabled={isLoading || parseFloat(earnings) === 0}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Download className="h-5 w-5" />
              <span>{isLoading ? 'Processing...' : 'Withdraw to Wallet'}</span>
            </button>

            {parseFloat(earnings) === 0 && (
              <p className="text-sm text-gray-500 text-center mt-4">
                No earnings available to withdraw
              </p>
            )}
          </div>

          <div className="mt-8 p-6 glass-morphism rounded-xl border border-primary-500/20">
            <h3 className="font-semibold mb-3">How Earnings Work:</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start space-x-2">
                <span className="text-primary-500 mt-1">•</span>
                <span>Researchers pay 0.01 ETH (default) per query</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-500 mt-1">•</span>
                <span>70% distributed equally among patients whose data matched the query</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-500 mt-1">•</span>
                <span>30% goes to platform for maintenance and development</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-500 mt-1">•</span>
                <span>Withdraw anytime - no minimum threshold</span>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}