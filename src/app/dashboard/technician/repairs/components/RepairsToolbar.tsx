'use client';

import React from 'react';
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface RepairsToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onFilterChange: (value: string) => void;
}

export default function RepairsToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onFilterChange
}: RepairsToolbarProps) {
  
  // Strict workflow filter options mapping directly to database values
  const filterOptions = ["All", "Waiting", "In Service", "Parts Ordered", "Ready"];

  return (
    <div className="w-full bg-white rounded-2xl border border-border/70 p-4 shadow-sm flex flex-col gap-4 md:flex-row md:items-center md:justify-between transition-all duration-200">
      
      {/* 🔍 1. FUZZY STRING SEARCH BAR INPUT CONTAINER */}
      <div className="relative flex-1 max-w-md w-full">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-[#0C5C3C]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
          placeholder="Search ticket ID, vehicle variant or customer name..."
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
              {option === "All" ? "All Repairs" : option}
            </Button>
          );
        })}
      </div>

    </div>
  );
}