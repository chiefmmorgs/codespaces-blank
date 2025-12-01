'use client';

import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

export default function QueryBuilder({ onSubmit, isLoading, queryFee }) {
  const [queryType, setQueryType] = useState('average');
  const [params, setParams] = useState({
    minAge: '',
    maxAge: '',
    diagnosisCode: '',
    minOutcome: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(queryType, params);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Query Type</label>
        <select
          value={queryType}
          onChange={(e) => setQueryType(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-primary-500/20 focus:border-primary-500 outline-none"
          disabled={isLoading}
        >
          <option value="average">Average Biomarker</option>
          <option value="count">Count Patients</option>
        </select>
      </div>

      {queryType === 'average' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Min Age</label>
              <input
                type="number"
                value={params.minAge}
                onChange={(e) => setParams({ ...params, minAge: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-primary-500/20 focus:border-primary-500 outline-none"
                placeholder="e.g., 30"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Max Age</label>
              <input
                type="number"
                value={params.maxAge}
                onChange={(e) => setParams({ ...params, maxAge: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-primary-500/20 focus:border-primary-500 outline-none"
                placeholder="e.g., 60"
                required
                disabled={isLoading}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Diagnosis Code</label>
            <input
              type="number"
              value={params.diagnosisCode}
              onChange={(e) => setParams({ ...params, diagnosisCode: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-primary-500/20 focus:border-primary-500 outline-none"
              placeholder="e.g., 250 for diabetes"
              required
              disabled={isLoading}
            />
          </div>
        </>
      ) : (
        <>
          <div>
            <label className="block text-sm font-medium mb-2">Diagnosis Code</label>
            <input
              type="number"
              value={params.diagnosisCode}
              onChange={(e) => setParams({ ...params, diagnosisCode: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-primary-500/20 focus:border-primary-500 outline-none"
              placeholder="e.g., 250"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Min Outcome</label>
            <input
              type="number"
              value={params.minOutcome}
              onChange={(e) => setParams({ ...params, minOutcome: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-primary-500/20 focus:border-primary-500 outline-none"
              placeholder="e.g., 50"
              required
              disabled={isLoading}
            />
          </div>
        </>
      )}

      <div className="p-4 bg-primary-500/10 rounded-lg border border-primary-500/20">
        <p className="text-sm">
          Query Fee: <span className="font-bold text-primary-500">{queryFee} ETH</span>
        </p>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-primary-500/50 disabled:opacity-50 flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Executing Query...</span>
          </>
        ) : (
          <>
            <Search className="h-5 w-5" />
            <span>Execute Query</span>
          </>
        )}
      </button>
    </form>
  );
}