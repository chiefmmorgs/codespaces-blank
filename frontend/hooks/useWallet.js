import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CHAIN_CONFIG } from '@/lib/contracts';

export function useWallet() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState('0');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(web3Provider);

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', () => window.location.reload());
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const handleAccountsChanged = async (accounts) => {
    if (accounts.length === 0) {
      disconnect();
    } else {
      setAddress(accounts[0]);
      await updateBalance(accounts[0]);
    }
  };

  const updateBalance = async (addr) => {
    if (provider && addr) {
      try {
        const bal = await provider.getBalance(addr);
        setBalance(ethers.formatEther(bal));
      } catch (err) {
        console.error('Failed to fetch balance:', err);
      }
    }
  };

  const connect = async () => {
    if (!provider) {
      setError('MetaMask not detected');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const network = await provider.getNetwork();
      
      if (Number(network.chainId) !== CHAIN_CONFIG.chainId) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${CHAIN_CONFIG.chainId.toString(16)}` }],
          });
        } catch (switchError) {
          setError('Please switch to Sepolia network');
          setIsConnecting(false);
          return;
        }
      }

      const accounts = await provider.send('eth_requestAccounts', []);
      const userSigner = await provider.getSigner();
      
      setAddress(accounts[0]);
      setSigner(userSigner);
      await updateBalance(accounts[0]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAddress(null);
    setSigner(null);
    setBalance('0');
  };

  return {
    provider,
    signer,
    address,
    balance,
    isConnecting,
    error,
    connect,
    disconnect,
    isConnected: !!address,
  };
}