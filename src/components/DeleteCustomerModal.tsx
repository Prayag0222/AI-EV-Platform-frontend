'use client';

import React from 'react';
import { Trash2 } from 'lucide-react';

// 🔌 Define what properties this modal needs from the parent page
interface DeleteCustomerModalProps {
  customerId: string | null;      // It needs to know WHICH customer to watch
  onClose: () => void;            // Function to close the window (set it back to null)
  onConfirm: () => void;          // Function to execute the backend fetch delete
}

export default function DeleteCustomerModal({ customerId, onClose, onConfirm }: DeleteCustomerModalProps) {
  // 🛡️ Guardrail: If no ID is passed, stay completely invisible
  if (!customerId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      
      <div className="w-full max-w-sm bg-volt-surface border border-red-500/20 rounded-container p-6 shadow-2xl relative scale-in-center animate-in zoom-in-95 duration-150">
        
        {/* Upper warning label row */}
        <div className="flex items-center gap-3 text-red-400 mb-3">
          <div className="p-2 bg-red-950/40 border border-red-500/20 rounded-volt">
            <Trash2 className="h-5 w-5 stroke-[2]" />
          </div>
          <h3 className="font-display text-base font-bold tracking-wide">
            Confirm Data Purge
          </h3>
        </div>

        {/* Warning description */}
        <p className="font-sans text-xs font-medium text-slate-400 leading-relaxed mb-6">
          Are you absolutely sure you want to securely remove this profile row? This process will delete the customer and un-link all associated vehicle metrics permanently from VoltOps registries.
        </p>

        {/* Operational Actions Strip Row */}
        <div className="flex items-center justify-end gap-3 border-t border-volt-container pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-volt font-display text-xs font-semibold text-slate-400 hover:bg-volt-background transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-volt bg-red-900 border border-red-500/30 font-display text-xs font-semibold text-red-200 hover:bg-red-800 transition-all shadow-md cursor-pointer"
          >
            Purge Record
          </button>
        </div>

      </div>
    </div>
  );
}