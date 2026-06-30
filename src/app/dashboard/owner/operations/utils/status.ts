import { StatusAppearance } from "../types/types";

export const STATUS_CONFIG: Record<string, StatusAppearance> = {
  DIAGNOSING: {
    bg: "bg-volt-sand",
    text: "text-[#564427]",
    dot: "bg-[#564427]",
  },

  IN_SERVICE: {
    bg: "bg-[#D6EFDE]",
    text: "text-[#006F67]",
    dot: "bg-[#006F67]",
  },

  RESOLVED: {
    bg: "bg-emerald-green",
    text: "text-volt-secondary",
    dot: "bg-volt-secondary",
  },

  DELIVERED: {
    bg: "bg-emerald-green",
    text: "text-volt-secondary",
    dot: "bg-volt-secondary",
  },
};

export function getStatusConfig(status: string): StatusAppearance {
  return STATUS_CONFIG[status] ?? STATUS_CONFIG.DIAGNOSING;
}

export function formatStatus(status: string): string {
  return status.replaceAll("_", " ");
}