'use client';

import { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { useDataRegistry } from '@/hooks/useDataRegistry';
import PatientForm from '@/components/PatientForm';
import { CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SubmitDataPage() {
  const { signer, isConnected } = useWallet();
  const { submitHealthData, isLoading } = useDataRegistry(signer);
  const [result, setResult] = useState(null);

  const handleSubmit = async (data) => {
    setResult(null);
    const res = await submitHealthData(data);
    setResult(res);
  };

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <AlertCircle className="h-20 w-20 text-yellow-500 mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-4">Connect Wallet</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Please connect your wallet to submit health data
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
        <h1 className="text-4xl font-bold mb-2">Submit Health Data</h1>
        <p className="text-gray-600 dark:text-gray-400">
          All data is encrypted client-side before submission using FHE
        </p>
      </div>

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
                <span>Data submitted successfully! Record ID: {result.recordId}</span>
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

      <div className="glass-morphism rounded-xl p-8 border border-primary-500/20">
        <PatientForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>

      <div className="mt-8 p-6 glass-morphism rounded-xl border border-primary-500/20">
        <h3 className="font-semibold mb-4">Common Diagnosis Codes:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Diabetes Mellitus:</span>
            <span className="font-mono">250</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Hypertension:</span>
            <span className="font-mono">401</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Coronary Artery Disease:</span>
            <span className="font-mono">414</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Asthma:</span>
            <span className="font-mono">493</span>
          </div>
        </div>
      </div>
    </div>
  );
}