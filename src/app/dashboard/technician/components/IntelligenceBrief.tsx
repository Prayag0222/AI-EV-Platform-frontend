'use client';

import React from 'react';
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function IntelligenceBrief() {
  return (
    <section className="overflow-hidden rounded-3xl bg-[#211C17] p-5 text-primary-foreground shadow-[0_20px_60px_-42px_var(--foreground)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-warning-soft" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">AI briefing</p>
        </div>
        <span className="rounded-full bg-primary-foreground/10 px-2 py-1 text-[10px]">92% confidence</span>
      </div>
      <h2 className="mt-6 font-display text-xl font-semibold leading-tight tracking-[-0.035em]">
        Start with the cell group metrics.
      </h2>
      <p className="mt-3 text-sm leading-6 text-primary-foreground/65">
        Isolation tracking failures rose following high-velocity charging intervals over past operations metrics.
      </p>
      <div className="mt-5 space-y-3 border-t border-primary-foreground/10 pt-4">
        <div className="grid grid-cols-[28px_1fr] gap-2 text-xs">
          <span className="text-primary-foreground/40">01</span>
          <span>Verify thermal sensor resistance parameters</span>
        </div>
        <div className="grid grid-cols-[28px_1fr] gap-2 text-xs">
          <span className="text-primary-foreground/40">02</span>
          <span>Measure module stack insulation drops</span>
        </div>
      </div>
      <Button variant="secondary" className="mt-5 h-10 w-full rounded-xl bg-[#FAF8F4] text-sec-text hover:bg-primary-foreground/90 hover:text-black">
        Review diagnosis <ArrowUpRight />
      </Button>
    </section>
  );
}