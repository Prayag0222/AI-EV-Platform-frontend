"use client";

import React from "react";

interface Props {
  icon: React.ReactNode;
  label: string;
  count: number;
  accent?: boolean;
}

export default function SectionLabel({
  icon,
  label,
  count,
  accent = false,
}: Props) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-sec-text">
        <span className="text-volt-secondary">
          {icon}
        </span>

        {label}
      </div>

      <div className="flex-1 h-px bg-[rgba(9,20,38,0.07)]" />

      <span
        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
          accent
            ? "bg-emerald-green text-volt-secondary"
            : "bg-volt-container text-sec-text"
        }`}
      >
        {count}
      </span>
    </div>
  );
}