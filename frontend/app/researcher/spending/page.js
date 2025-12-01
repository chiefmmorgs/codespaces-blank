'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import StatsCard from '@/components/StatsCard';
import { ArrowLeft, TrendingUp, CreditCard, Activity } from 'lucide-react';
import Link from 'next/link';
import { formatTimestamp } from '@/lib/utils';

export default function SpendingPage() {
  const { isConnected } = useWallet();
  const [stats, setStats] = useState({
    totalSpent: '0.00',
    queryCount: 0,
    avgCost: '0.00'
  });
  const [transactions, setTransactions] = useState([]);

  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Connect your wallet to view spending
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
        <h1 className="text-4xl font-bold mb-2">Spending Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your query spending and payment history
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatsCard
          title="Total Spent"
          value={`${stats.totalSpent} ETH`}
          icon={TrendingUp}
          gradient
        />
        <StatsCard
          title="Total Queries"
          value={stats.queryCount}
          icon={Activity}
        />
        <StatsCard
          title="Avg Cost/Query"
          value={`${stats.avgCost} ETH`}
          icon={CreditCard}
        />
      </div>

      <div className="glass-morphism rounded-xl p-8 border border-primary-500/20">
        <h2 className="text-2xl font-bold mb-6">Payment History</h2>
        
        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-4 bg-white/5 dark:bg-black/20 rounded-lg"
              >
                <div>
                  <p className="font-semibold">Query #{tx.queryId}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatTimestamp(tx.timestamp)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary-500">{tx.amount} ETH</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{tx.type}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 glass-morphism rounded-xl border border-primary-500/20">
          <h3 className="font-semibold mb-3">Fee Breakdown</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Query Fee:</span>
              <span className="font-semibold">0.01 ETH</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Patient Share (70%):</span>
              <span className="font-semibold">0.007 ETH</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Platform Fee (30%):</span>
              <span className="font-semibold">0.003 ETH</span>
            </div>
          </div>
        </div>

        <div className="p-6 glass-morphism rounded-xl border border-primary-500/20">
          <h3 className="font-semibold mb-3">Value Proposition</h3>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-start space-x-2">
              <span className="text-primary-500 mt-1">•</span>
              <span>Access to encrypted clinical trial data</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary-500 mt-1">•</span>
              <span>Complete privacy preservation via FHE</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary-500 mt-1">•</span>
              <span>Fair compensation to data contributors</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}