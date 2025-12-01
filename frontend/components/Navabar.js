'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Database, FlaskConical, Moon, Sun, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import WalletConnect from './WalletConnect';

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => pathname.startsWith(path);

  return (
    <nav className="sticky top-0 z-50 glass-morphism border-b border-primary-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <Database className="h-8 w-8 text-primary-500 group-hover:animate-glow transition-all" />
                <div className="absolute inset-0 bg-primary-500/20 blur-xl group-hover:bg-primary-500/40 transition-all" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                BioMesh
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/patient"
              className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-all ${
                isActive('/patient')
                  ? 'bg-primary-500/20 text-primary-400'
                  : 'hover:bg-white/5 dark:hover:bg-black/20'
              }`}
            >
              <Database className="h-4 w-4" />
              <span>Patient</span>
            </Link>
            <Link
              href="/researcher"
              className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-all ${
                isActive('/researcher')
                  ? 'bg-primary-500/20 text-primary-400'
                  : 'hover:bg-white/5 dark:hover:bg-black/20'
              }`}
            >
              <FlaskConical className="h-4 w-4" />
              <span>Researcher</span>
            </Link>
            <Link
              href="/about"
              className={`px-4 py-2 rounded-lg transition-all ${
                isActive('/about')
                  ? 'bg-primary-500/20 text-primary-400'
                  : 'hover:bg-white/5 dark:hover:bg-black/20'
              }`}
            >
              About
            </Link>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-white/5 dark:hover:bg-black/20 transition-all"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-primary-600" />
              )}
            </button>

            <WalletConnect />
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-white/5 dark:hover:bg-black/20"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-white/5 dark:hover:bg-black/20"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-primary-500/20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg">
          <div className="px-4 py-4 space-y-2">
            <Link
              href="/patient"
              className="block px-4 py-2 rounded-lg hover:bg-primary-500/10"
              onClick={() => setMobileMenuOpen(false)}
            >
              Patient Portal
            </Link>
            <Link
              href="/researcher"
              className="block px-4 py-2 rounded-lg hover:bg-primary-500/10"
              onClick={() => setMobileMenuOpen(false)}
            >
              Researcher Portal
            </Link>
            <Link
              href="/about"
              className="block px-4 py-2 rounded-lg hover:bg-primary-500/10"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <div className="pt-2">
              <WalletConnect />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}