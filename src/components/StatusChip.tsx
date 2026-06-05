import React from "react";

interface StatusChipProps {
  status: "optimal" | "warning" | "online";
  text: string;
}

export default function StatusChip({ status, text }: StatusChipProps) {
  const styles = {
    online: "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20",
    optimal: "bg-emerald-go/10 text-emerald-go border border-emerald-go/20",
    warning: "bg-orange-500/10 text-orange-400 border border-orange-500/20"
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-mono text-[11px] uppercase tracking-wider ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
        status === "optimal" ? "bg-emerald-go" : status === "online" ? "bg-neon-cyan" : "bg-orange-400"
      }`} />
      {text}
    </div>
  );
}