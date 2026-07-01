"use client";

import { Wrench, X, Phone, Bike, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { RepairTicket } from '../types/types';
import ModalMetaCell from "./ModalMetaCell";
import OperationTimeline from "./OperationTimeline";
import OperationStatusDropdown from "./OperationStatusDropdown";
import { useState } from "react";
import { toast } from "react-toastify";
import { updateOperationStatus } from "../services/operation.service";

interface Props {
  ticket: RepairTicket;
  open: boolean;
  onClose: () => void;
}

export default function OperationDetailDrawer({ ticket, open, onClose }: Props) {
  const [status, setStatus] = useState(ticket.status);
  const [saving, setSaving] = useState(false);

  const hasChanges = status !== ticket.status;

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateOperationStatus({ ticketId: ticket.id, status });
      toast.success("Operation updated.");
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && ticket && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
          />

          {/* Drawer — full screen on mobile, side panel on desktop */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="fixed right-0 top-0 z-50 h-[100dvh] w-full sm:max-w-lg bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-volt-surface border-b border-volt-container px-4 sm:px-6 py-4 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-volt-primary flex items-center justify-center shrink-0">
                    <Wrench className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                      Operation
                    </p>
                    <h2 className="text-lg font-black text-volt-primary truncate">
                      EV-{ticket.id.toString().padStart(4, "0")}
                    </h2>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content — scrollable */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-5">

              {/* Status section — clean stacked layout */}
              <section>
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-3">
                  Update Status
                </p>
                <OperationStatusDropdown value={status} role="OWNER" onChange={setStatus} />
              </section>

              {/* Progress timeline */}
              <OperationTimeline currentStatus={status} />

              {/* Customer + Phone */}
              <div className="grid grid-cols-2 gap-3">
                <ModalMetaCell label="Customer" value={ticket.customer?.name || "Walk-in"} />
                <ModalMetaCell label="Phone" value={ticket.customer?.phone || "—"} />
              </div>

              {/* Vehicle + Issue */}
              <div className="grid grid-cols-2 gap-3">
                <ModalMetaCell label="Vehicle" value={ticket.vehicleModel} accent />
                <ModalMetaCell label="Issue" value={ticket.issueCategory} />
              </div>

              {/* Description */}
              <section className="rounded-xl border border-volt-container bg-volt-background p-4">
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">
                  Description
                </p>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {ticket.description || "—"}
                </p>
              </section>

              {/* Technician Notes */}
              <section className="rounded-xl border border-volt-container bg-volt-background p-4">
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">
                  Technician Notes
                </p>
                <p className="text-sm leading-relaxed font-mono text-slate-700 whitespace-pre-wrap">
                  {ticket.technicianNotes || "No notes yet."}
                </p>
              </section>

              {/* Footer Metadata */}
              <div className="grid grid-cols-2 gap-3 pb-2">
                <ModalMetaCell
                  label="Technician"
                  value={
                    ticket.technician
                      ? `${ticket.technician.fullName} (#${ticket.technician.employeeId})`
                      : "Unassigned"
                  }
                />
                <ModalMetaCell
                  label="Created"
                  value={new Date(ticket.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                />
              </div>
            </div>

            {/* Footer — sticky action bar */}
            <div className="shrink-0 border-t border-volt-container bg-white px-4 sm:px-6 py-4">
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !hasChanges}
                  className="flex-1 rounded-xl bg-volt-primary py-3 text-sm font-bold text-white hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}