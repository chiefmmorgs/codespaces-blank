'use client';

import Link from 'next/link';
import { Database, Lock, Coins, Shield, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomePage() {
  const features = [
    {
      icon: Lock,
      title: 'Fully Encrypted',
      description: 'Patient data is encrypted client-side using Zama\'s FHE technology before submission'
    },
    {
      icon: Database,
      title: 'Decentralized Storage',
      description: 'Health records stored on-chain with blockchain immutability and transparency'
    },
    {
      icon: Coins,
      title: 'Patient Monetization',
      description: 'Patients earn automatically when researchers query their encrypted data'
    },
    {
      icon: Shield,
      title: 'Privacy-Preserving',
      description: 'Researchers query without ever seeing raw patient data - compute on encrypted data'
    }
  ];

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-primary-600/5 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-500/10 rounded-full mb-6">
            <Sparkles className="h-4 w-4 text-primary-500" />
            <span className="text-sm text-primary-600 dark:text-primary-400">Powered by Zama FHE</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent animate-gradient">
            Clinical Trial Data,
            <br />
            Encrypted & Monetized
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-10">
            A privacy-preserving marketplace where patients submit encrypted health data 
            and researchers query it without ever decrypting. Built on blockchain with 
            Fully Homomorphic Encryption.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/patient"
              className="group px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-primary-500/50 flex items-center justify-center space-x-2"
            >
              <span>Submit Your Data</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href="/researcher"
              className="px-8 py-4 glass-morphism hover:bg-white/20 dark:hover:bg-black/40 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2"
            >
              <span>Run Queries</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="card-3d p-6 glass-morphism rounded-xl border border-primary-500/20 hover:border-primary-500/40 transition-all"
            >
              <div className="p-3 bg-primary-500/10 rounded-lg w-fit mb-4">
                <feature.icon className="h-6 w-6 text-primary-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="glass-morphism rounded-2xl p-12 text-center border border-primary-500/20"
        >
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div>
              <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold mb-2">Patient Submits</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Encrypt health data client-side and submit to blockchain
              </p>
            </div>
            
            <div>
              <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold mb-2">Researcher Queries</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Execute encrypted queries on patient data without decryption
              </p>
            </div>
            
            <div>
              <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold mb-2">Patient Earns</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Automatic payment distribution - 70% to patients, 30% platform fee
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}