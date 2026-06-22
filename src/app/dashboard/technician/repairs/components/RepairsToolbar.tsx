'use client';

import React from 'react';
import { RefreshCw, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface RepairsToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onFilterChange: (value: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export default function RepairsToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onFilterChange,
  onRefresh,
  isRefreshing,
}: RepairsToolbarProps) {
  
  // Strict workflow filter options mapping directly to database values
  const filterOptions = ["All", "PENDING", "DIAGNOSING", "IN_SERVICE", "RESOLVED", "DELIVERED"];

  return (
    <div className="w-full bg-white rounded-2xl border border-border/70 p-4 shadow-sm flex flex-col gap-4 md:flex-row md:items-center md:justify-between transition-all duration-200">
      
      {/* 🔍 1. FUZZY STRING SEARCH BAR INPUT CONTAINER */}
      <div className="relative flex-1 min-w-0 w-full md:max-w-xl">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-[#0C5C3C]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
          placeholder="Search ticket, customer, phone, vehicle or VIN..."
          aria-label="Search repair queue"
          className="h-10 w-full rounded-xl border border-border/50 bg-[#F9F6F1] pl-10 pr-4 text-sm font-medium text-primary-text placeholder:text-muted-foreground outline-none transition-all duration-200 focus:border-border/80 focus:bg-white focus:ring-2 focus:ring-[#0C5C3C]/10"
        />
      </div>

      {/* 🎛️ 2. HORIZONTAL STATUS FILTER CHANNELS */}
      <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
        {filterOptions.map((option: string) => {
          const isActive = statusFilter === option;
          
          return (
            <Button
              key={option}
              variant="ghost"
              size="sm"
              onClick={() => onFilterChange(option)}
              className={cn(
                "h-9 rounded-xl px-4 text-xs font-bold tracking-tight transition-all duration-200 shadow-none border border-transparent",
                isActive 
                  ? "bg-[#0C5C3C] text-white hover:bg-[#0C5C3C]/90 focus:ring-2 focus:ring-[#0C5C3C]/20" 
                  : "bg-[#F9F6F1] text-gray-700 hover:bg-border/40 hover:text-primary-text"
              )}
            >
              {option === "All" ? "All Repairs" : option.replace("_", " ")}
            </Button>
          );
        })}
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="h-9 rounded-xl border border-border/60 bg-white px-3 text-xs font-bold text-[#0C5C3C] hover:bg-emerald-50"
          aria-label="Refresh repair queue"
        >
          <RefreshCw className={cn("mr-1.5 size-3.5", isRefreshing && "animate-spin")} />
          Refresh
        </Button>
      </div>

    </div>
  );
}
