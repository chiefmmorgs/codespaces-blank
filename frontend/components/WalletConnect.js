'use client';

import { useWallet } from '@/hooks/useWallet';
import { formatAddress } from '@/lib/utils';
import { Wallet, LogOut } from 'lucide-react';

export default function WalletConnect() {
  const { address, balance, isConnecting, connect, disconnect, isConnected } = useWallet();

  if (isConnected) {
    return (
      <div className="flex items-center space-x-2">
        <div className="hidden sm:flex flex-col items-end text-xs">
          <span className="text-gray-600 dark:text-gray-400">{formatAddress(address)}</span>
          <span className="text-primary-500 font-semibold">{parseFloat(balance).toFixed(4)} ETH</span>
        </div>
        <button
          onClick={disconnect}
          className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg transition-all"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Disconnect</span>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      disabled={isConnecting}
      className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all shadow-lg hover:shadow-primary-500/50 disabled:opacity-50"
    >
      <Wallet className="h-4 w-4" />
      <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
    </button>
  );
}