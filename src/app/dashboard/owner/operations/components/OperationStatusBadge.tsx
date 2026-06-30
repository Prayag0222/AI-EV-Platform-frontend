"use client";

import { getStatusConfig } from "../utils/status";

interface Props {
  status: string;
}

export default function OperationStatusBadge({
  status,
}: Props) {
  const cfg = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${cfg.bg} ${cfg.text}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}
      />

      {status}
    </span>
  );
}