'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { useDataRegistry } from '@/hooks/useDataRegistry';
import { usePaymentProcessor } from '@/hooks/usePaymentProcessor';
import Link from 'next/link';
import StatsCard from '@/components/StatsCard';
import { FileText, Coins, Database, ArrowRight } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function PatientDashboard() {
  const { signer, address, isConnected } = useWallet();
  const { getPatientRecords } = useDataRegistry(signer);
  const { getPatientEarnings } = usePaymentProcessor(signer);
  
  const [records, setRecords] = useState([]);
  const [earnings, setEarnings] = useState('0');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isConnected && address) {
      loadData();
    }
  }, [isConnected, address]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [recordsData, earningsData] = await Promise.all([
        getPatientRecords(address),
        getPatientEarnings(address)
      ]);
      setRecords(recordsData);
      setEarnings(earningsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Database className="h-20 w-20 text-primary-500 mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-4">Patient Portal</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Connect your wallet to access your dashboard
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const activeRecords = records.filter(r => r.isActive).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Patient Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your encrypted health records and earnings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatsCard
          title="Total Records"
          value={records.length}
          icon={FileText}
        />
        <StatsCard
          title="Active Records"
          value={activeRecords}
          icon={Database}
          gradient
        />
        <StatsCard
          title="Total Earnings"
          value={`${parseFloat(earnings).toFixed(4)} ETH`}
          icon={Coins}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/patient/submit"
          className="group card-3d p-8 glass-morphism rounded-xl border border-primary-500/20 hover:border-primary-500/40 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Submit Data</h2>
            <ArrowRight className="h-6 w-6 text-primary-500 group-hover:translate-x-2 transition-transform" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Submit new encrypted health data to the marketplace
          </p>
        </Link>

        <Link
          href="/patient/records"
          className="group card-3d p-8 glass-morphism rounded-xl border border-primary-500/20 hover:border-primary-500/40 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">My Records</h2>
            <ArrowRight className="h-6 w-6 text-primary-500 group-hover:translate-x-2 transition-transform" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage your submitted health records
          </p>
        </Link>

        <Link
          href="/patient/earnings"
          className="group card-3d p-8 glass-morphism rounded-xl border border-primary-500/20 hover:border-primary-500/40 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Earnings</h2>
            <ArrowRight className="h-6 w-6 text-primary-500 group-hover:translate-x-2 transition-transform" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            View your earnings and withdraw funds
          </p>
        </Link>
      </div>
    </div>
  );
}