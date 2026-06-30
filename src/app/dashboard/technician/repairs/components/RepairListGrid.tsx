"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, SearchX, Wrench } from "lucide-react";
import type { RepairPagination, RepairTicket } from "../types";
import RepairSelectionCard from "./RepairSelectionCard";
import { motion } from "framer-motion";

interface RepairListGridProps {
  tickets: RepairTicket[];
  selectedTicketId: number | null;
  pagination: RepairPagination;
  onPageChange: (page: number) => void;
  onTicketSelect: (id: number) => void;
  onClearFilters: () => void;
  isFiltered: boolean;
}

export default function RepairListGrid({
  tickets,
  selectedTicketId,
  pagination,
  onPageChange,
  onTicketSelect,
  onClearFilters,
  isFiltered,
}: RepairListGridProps) {
  if (!tickets.length) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex min-h-72 w-full flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-white p-8 text-center"
      >
        <div className="grid size-14 place-items-center rounded-2xl bg-[#F9F6F1] text-[#0C5C3C]">
          {isFiltered ? (
            <SearchX className="size-6" />
          ) : (
            <motion.div
              animate={{
                rotate: [0, -8, 8, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
              }}
            >
              <Wrench className="size-6" />
            </motion.div>
          )}
        </div>
        <div>
          <h3 className="font-display text-base font-bold text-primary-text">
            {isFiltered
              ? "No matching repair tickets"
              : "Your repair queue is clear"}
          </h3>
          <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-sec-text">
            {isFiltered
              ? "Try another ticket ID, customer, phone, vehicle, VIN, or status."
              : "New tickets assigned to you will appear here automatically."}
          </p>
        </div>
        {isFiltered && (
          <button
            onClick={onClearFilters}
            className="rounded-xl bg-[#0C5C3C] px-4 py-2 text-xs font-bold text-white hover:bg-[#094b32]"
          >
            Clear search and filters
          </button>
        )}
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <motion.div className="flex w-full flex-col gap-3">
        {tickets.map((ticket, index) => (
          <motion.div
            key={ticket.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.2,
              delay: index * 0.03,
            }}
          >
            <Link
              href={`/dashboard/technician/workspace/${ticket.id}`}
              onClick={() => onTicketSelect(ticket.id)}
              className="block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#0C5C3C] focus-visible:ring-offset-2"
            >
              <RepairSelectionCard
                ticket={ticket}
                isActive={ticket.id === selectedTicketId}
              />
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <div className="flex flex-col items-center justify-between gap-3 rounded-xl border border-border/60 bg-white px-4 py-3 text-xs text-sec-text sm:flex-row">
        <span>
          Showing {(pagination.page - 1) * pagination.pageSize + 1}–
          {Math.min(
            pagination.page * pagination.pageSize,
            pagination.totalItems,
          )}{" "}
          of {pagination.totalItems} tickets
        </span>
        <div className="flex items-center gap-2">
          <button
            disabled={pagination.page <= 1}
            onClick={() => onPageChange(pagination.page - 1)}
            className="rounded-lg border border-border p-2  text-primary-text disabled:cursor-not-allowed disabled:opacity-35"
            aria-label="Previous repair page"
          >
            <ChevronLeft className="size-4" />
          </button>
          <div className="rounded-lg bg-slate-100 px-3 py-1 font-semibold">
            {pagination.page}
          </div>

          <span className="text-slate-500">/ {pagination.totalPages}</span>
          <button
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => onPageChange(pagination.page + 1)}
            className=" rounded-lg border transition-all hover:border-[#0C5C3C] hover:bg-[#0C5C3C]
hover:text-white
active:scale-95
disabled:pointer-events-none
 border-border p-2 text-primary-text disabled:cursor-not-allowed disabled:opacity-35"
            aria-label="Next repair page"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
