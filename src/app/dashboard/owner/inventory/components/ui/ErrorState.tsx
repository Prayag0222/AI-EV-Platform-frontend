'use client';

import { motion } from 'framer-motion';
import {
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

interface Props {
  message: string;
  onRetry: () => void;
}

export default function ErrorState({
  message,
  onRetry,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center px-6 py-20 text-center"
    >
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50">
        <AlertTriangle
          size={36}
          className="text-red-600"
        />
      </div>

      <h2 className="text-xl font-bold text-gray-900">
        Something went wrong
      </h2>

      <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
        {message}
      </p>

      <button
        onClick={onRetry}
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 active:scale-95"
      >
        <RefreshCw size={17} />
        Try Again
      </button>
    </motion.div>
  );
}