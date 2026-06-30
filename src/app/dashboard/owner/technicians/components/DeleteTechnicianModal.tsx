'use client';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  open: boolean;
  techName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteTechnicianModal({ open, techName, onConfirm, onCancel }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-7 shadow-2xl"
          >
            {/* Icon */}
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <AlertTriangle className="h-7 w-7 text-red-500" />
            </div>

            {/* Text */}
            <h2 className="mt-5 text-center text-lg font-black text-slate-900">
              Remove Technician?
            </h2>
            <p className="mt-2 text-center text-sm text-slate-500 leading-relaxed">
              <span className="font-semibold text-slate-700">{techName}</span> will be permanently
              removed from your workshop. This cannot be undone.
            </p>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 rounded-2xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-red-600 py-3 text-sm font-bold text-white hover:bg-red-700 transition-colors active:scale-[0.98]"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
            </div>

            {/* Close */}
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}