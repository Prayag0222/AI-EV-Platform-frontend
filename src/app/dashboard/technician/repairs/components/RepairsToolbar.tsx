"use client";

import { motion } from "framer-motion";
import React from "react";
import { RefreshCw, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RepairsToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onFilterChange: (value: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const FILTER_OPTIONS = [
  "All",
  "PENDING",
  "DIAGNOSING",
  "IN_SERVICE",
  "RESOLVED",
  "DELIVERED",
] as const;

export default function RepairsToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onFilterChange,
  onRefresh,
  isRefreshing,
}: RepairsToolbarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="flex flex-col gap-5 p-5">

        {/* Search */}

        <div className="relative">

          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={searchQuery}
            onChange={(e) =>
              onSearchChange(e.target.value)
            }
            placeholder="Search ticket ID, customer, phone, VIN or vehicle..."
            aria-label="Search repair queue"
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          />

        </div>

        {/* Filters */}

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">

            {FILTER_OPTIONS.map((option) => {
              const active =
                statusFilter === option;

              return (
                <motion.div
                  key={option}
                  whileTap={{ scale: 0.96 }}
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      onFilterChange(option)
                    }
                    className={cn(
                      "h-10 rounded-xl border px-4 text-xs font-semibold whitespace-nowrap transition-all",

                      active
                        ? "border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-700"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                    )}
                  >
                    {option === "All"
                      ? "All Repairs"
                      : option.replace(
                          "_",
                          " "
                        )}
                  </Button>
                </motion.div>
              );
            })}

          </div>

          <motion.div
            whileTap={{ scale: 0.96 }}
          >
            <Button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="h-10 rounded-xl bg-[#0C5C3C] px-5 text-sm font-semibold text-white hover:bg-[#094b32]"
            >
              <RefreshCw
                className={cn(
                  "mr-2 h-4 w-4",
                  isRefreshing &&
                    "animate-spin"
                )}
              />

              {isRefreshing
                ? "Refreshing..."
                : "Refresh Queue"}
            </Button>
          </motion.div>

        </div>

      </div>
    </motion.div>
  );
}