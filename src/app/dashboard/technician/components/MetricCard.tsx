'use client';

import React from 'react';
import { LucideIcon } from "lucide-react";

interface MetricProps {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  // Binds directly to the semantic layout states
  tone?: "critical" | "warning" | "success"; 
}

export default function MetricCard({ label, value, detail, icon: Icon, tone }: MetricProps) {
  
  // ⚡ THE SYSTEM FIX: Clear dictionary maps for the PostCSS build scanner
  const toneClasses = {
    critical: "text-volt-terracotta", // Maps straight to your dark red custom variable
    warning: "text-volt-sand",       // Maps straight to your warm gold custom variable
    success: "text-volt-secondary",  // Maps straight to your custom muted teal variable
  };

  // Safe fallback extract key: uses the token string if found, otherwise stays neutral
  const activeToneClass = tone ? toneClasses[tone] : "text-muted-foreground";

  return (
    <article className="rounded-2xl border border-border/70 bg-card px-5 py-4 shadow-[0_12px_32px_-28px_var(--foreground)]">
      <div className="flex items-start justify-between">
        <p className="text-sm text-muted-foreground font-sans">{label}</p>
        
        {/* ✅ The complete string compiles perfectly into the class layout block */}
        <Icon className={`size-4 shrink-0 ${activeToneClass}`} />
      </div>
      
      <p className="mt-4 font-display text-3xl text-primary-text font-semibold tracking-tighter">
        {value}
      </p>
      <p className="mt-1 text-xs text-muted-foreground font-sans">
        {detail}
      </p>
    </article>
  );
}