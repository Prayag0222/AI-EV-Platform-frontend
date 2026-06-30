"use client";

import React from "react";

interface Props {
  icon: React.ReactNode;
  label: string;
  value: number;
  accent?: boolean;
}

export default function OperationStats({
  icon,
  label,
  value,
  accent = false,
}: Props) {
  return (
    <div className="flex items-center gap-2 bg-white border border-[rgba(9,20,38,0.08)] rounded-xl px-4 py-2.5">
      <div
        className={`w-7 h-7 rounded-lg flex items-center justify-center ${
          accent
            ? "bg-emerald-green text-volt-secondary"
            : "bg-volt-container text-sec-text"
        }`}
      >
        {icon}
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-sec-text">
          {label}
        </p>

        <p className="text-base font-black text-volt-primary leading-none">
          {value}
        </p>
      </div>
    </div>
  );
}