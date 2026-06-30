"use client";

import { X, Wrench } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { RepairTicket} from '../types/types'
import OperationStatusBadge from "./OperationStatusBadge";
import ModalMetaCell from "./ModalMetaCell";
import OperationTimeline from "./OperationTimeline";
import OperationStatusDropdown from "./OperationStatusDropdown";
import {  useState } from "react";
import { toast } from "react-toastify";
import { updateOperationStatus } from "../services/operation.service";

import {  useRouter } from "next/navigation";

interface OperationDetailDrawerProps {
  ticket: RepairTicket;
  open: boolean;
  onClose: () => void;
}

export default function OperationDetailDrawer({
  ticket,
  open,
  onClose,
}: OperationDetailDrawerProps) {

  const router = useRouter()

    const [status, setStatus] = useState(ticket.status);
    const [saving, setSaving] = useState(false);


    const handleSave = async () => {
  try {
    setSaving(true);

    await updateOperationStatus({
      ticketId: ticket.id,
      status,
    });

    toast.success("Operation updated.");

    onClose();
    

    window.location.reload();
  } catch (error) {
    toast.error(
      error instanceof Error
        ? error.message
        : "Something went wrong."
    );
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

          {/* Drawer */}

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              duration: 0.28,
              ease: "easeOut",
            }}
            className="fixed right-0 top-0 z-50 h-screen
                       w-full
                       sm:max-w-lg
                       bg-white
                       shadow-2xl
                       flex flex-col"
          >
            {/* Header */}

            <div className="sticky top-0 z-10 bg-[#FAFAF8] border-b border-[rgba(9,20,38,0.08)] px-6 py-5">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-volt-primary flex items-center justify-center">

                    <Wrench className="w-4 h-4 text-white" />

                  </div>

                  <div>

                    <p className="text-[11px] uppercase tracking-widest font-bold text-sec-text">
                      Operation
                    </p>

                    <h2 className="text-xl font-black text-volt-primary">
                      EV-{ticket.id.toString().padStart(4, "0")}
                    </h2>

                  </div>

                </div>

                <div className="flex gap-3">

    <button
        onClick={onClose}
        className="flex-1 rounded-xl border border-[rgba(9,20,38,.08)] py-3 font-semibold"
    >
        Cancel
    </button>

<button
  onClick={handleSave}
  disabled={saving}
  className="flex-1 rounded-xl bg-volt-primary py-3 font-semibold text-white transition hover:bg-[#17304D] disabled:cursor-not-allowed disabled:opacity-60"
>
  {saving ? "Saving..." : "Save Changes"}
</button>

</div>

              </div>

            </div>

            {/* Content */}

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">

              {/* Status */}

              <div className="flex items-center justify-between">

                <span className="text-[11px] uppercase tracking-widest font-bold text-sec-text">
                  Status
                </span>

                <OperationStatusBadge
                  status={ticket.status}
                />
                <OperationTimeline
    currentStatus={ticket.status}
/>

<OperationStatusDropdown
    value={status}
    role="OWNER"
    onChange={setStatus}
/>

              </div>

              {/* Customer */}

              <div className="grid grid-cols-2 gap-3">

                <ModalMetaCell
                  label="Customer"
                  value={ticket.customer?.name || "Walk-in"}
                />

                <ModalMetaCell
                  label="Phone"
                  value={ticket.customer?.phone || "—"}
                />

              </div>

              {/* Vehicle */}

              <div className="grid grid-cols-2 gap-3">

                <ModalMetaCell
                  label="Vehicle"
                  value={ticket.vehicleModel}
                  accent
                />

                <ModalMetaCell
                  label="Issue"
                  value={ticket.issueCategory}
                />

              </div>

              {/* Description */}

              <section className="rounded-xl border border-[rgba(9,20,38,.08)] bg-volt-background p-4">

                <p className="text-[11px] uppercase tracking-widest font-bold text-sec-text mb-2">
                  Description
                </p>

                <p className="text-sm text-primary-text leading-relaxed whitespace-pre-wrap">
                  {ticket.description || "—"}
                </p>

              </section>

              {/* Technician Notes */}

              <section className="rounded-xl border border-[rgba(9,20,38,.08)] bg-volt-background p-4">

                <p className="text-[11px] uppercase tracking-widest font-bold text-sec-text mb-2">
                  Technician Notes
                </p>

                <p className="text-sm leading-relaxed font-mono text-primary-text whitespace-pre-wrap">
                  {ticket.technicianNotes || "No notes yet."}
                </p>

              </section>

              {/* Footer Metadata */}

              <div className="grid grid-cols-2 gap-3">

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
                  value={new Date(ticket.createdAt).toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                />

              </div>

            </div>

            {/* Footer */}

            <div className="border-t border-[rgba(9,20,38,.08)] p-6 bg-white">

              <button
                onClick={onClose}
                className="w-full rounded-xl bg-volt-primary py-3 text-sm font-bold text-white hover:bg-[#17304D] transition"
              >
                Close
              </button>

            </div>

          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}