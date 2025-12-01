'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { useDataRegistry } from '@/hooks/useDataRegistry';
import RecordCard from '@/components/RecordCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ArrowLeft, FileText } from 'lucide-react';
import Link from 'next/link';

export default function RecordsPage() {
  const { signer, address, isConnected } = useWallet();
  const { getPatientRecords, revokeRecord, isLoading } = useDataRegistry(signer);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revokingId, setRevokingId] = useState(null);

  useEffect(() => {
    if (isConnected && address) {
      loadRecords();
    }
  }, [isConnected, address]);

  const loadRecords = async () => {
    setLoading(true);
    const data = await getPatientRecords(address);
    setRecords(data);
    setLoading(false);
  };

  const handleRevoke = async (recordId) => {
    setRevokingId(recordId);
    await revokeRecord(recordId);
    await loadRecords();
    setRevokingId(null);
  };

  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Connect your wallet to view records
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Link
        href="/patient"
        className="inline-flex items-center space-x-2 text-primary-500 hover:text-primary-600 mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Dashboard</span>
      </Link>

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">My Health Records</h1>
        <p className="text-gray-600 dark:text-gray-400">
          View and manage your submitted encrypted health data
        </p>
      </div>

      {loading ? (
        <LoadingSpinner size="lg" />
      ) : records.length === 0 ? (
        <div className="text-center py-20">
          <FileText className="h-20 w-20 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">No records found</p>
          <Link
            href="/patient/submit"
            className="inline-block px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all"
          >
            Submit Your First Record
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {records.map((record) => (
            <RecordCard
              key={record.id}
              record={record}
              onRevoke={handleRevoke}
              isRevoking={revokingId === record.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}