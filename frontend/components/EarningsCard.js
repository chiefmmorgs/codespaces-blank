'use client';

import { formatTimestamp, formatAddress } from '@/lib/utils';
import { FileText, Calendar, User, XCircle, CheckCircle } from 'lucide-react';

export default function RecordCard({ record, onRevoke, isRevoking }) {
  return (
    <div className="card-3d p-6 glass-morphism rounded-xl border border-primary-500/20 hover:border-primary-500/40 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-primary-500" />
          <h3 className="text-lg font-semibold">Record #{record.id}</h3>
        </div>
        {record.isActive ? (
          <span className="flex items-center space-x-1 px-3 py-1 bg-green-500/20 text-green-600 dark:text-green-400 rounded-full text-sm">
            <CheckCircle className="h-4 w-4" />
            <span>Active</span>
          </span>
        ) : (
          <span className="flex items-center space-x-1 px-3 py-1 bg-red-500/20 text-red-600 dark:text-red-400 rounded-full text-sm">
            <XCircle className="h-4 w-4" />
            <span>Revoked</span>
          </span>
        )}
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
          <Calendar className="h-4 w-4" />
          <span>Submitted: {formatTimestamp(record.timestamp)}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
          <User className="h-4 w-4" />
          <span>Patient: {formatAddress(record.patient)}</span>
        </div>
      </div>

      {record.isActive && (
        <button
          onClick={() => onRevoke(record.id)}
          disabled={isRevoking}
          className="mt-4 w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg transition-all disabled:opacity-50"
        >
          {isRevoking ? 'Revoking...' : 'Revoke Access'}
        </button>
      )}
    </div>
  );
}