'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Compass, AlertCircle } from 'lucide-react';
import { Button } from '@/components/Button';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full bg-white border border-slate-200 dark:border-slate-850 dark:bg-slate-950/20 rounded-2xl p-8 shadow-xl flex flex-col items-center"
      >
        {/* Error icon circle */}
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 mb-6">
          <AlertCircle className="h-8 w-8" />
        </div>

        <h1 className="text-6xl font-black text-indigo-600 dark:text-indigo-400">
          404
        </h1>
        
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-4">
          Page Not Found
        </h2>
        
        <p className="text-sm text-slate-450 dark:text-slate-450 mt-2">
          Sorry, the page you are looking for does not exist, has been removed, or is temporarily unavailable.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full">
          <Link href="/" className="flex-1">
            <Button
              variant="primary"
              className="w-full cursor-pointer"
              leftIcon={<Home className="h-4 w-4" />}
            >
              Go Home
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button
              variant="outline"
              className="w-full cursor-pointer"
              leftIcon={<Compass className="h-4 w-4" />}
            >
              Browse Gear
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
