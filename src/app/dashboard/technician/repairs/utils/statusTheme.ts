import { WorkbenchStatus } from "../types";

// 📋 1. TYPE BOUNDS FOR STYLING SCHEMAS
interface StatusStyle {
  badge: string;  // Tailwind classes for the corner visual pill card container
  text: string;   // Tailwind classes for the textual status labels
  dot: string;    // Tailwind classes for the status dot indicator lights
}

// 🛠️ 2. PURE STYLING INTERPRETER ENGINE
// This function takes a raw status string from PostgreSQL and translates it into custom design values.
export const getStatusStyle = (status: WorkbenchStatus): StatusStyle => {
  const styles: Record<WorkbenchStatus, StatusStyle> = {
    "PENDING": {
      badge: "bg-slate-100 text-slate-700 border border-slate-200/80 shadow-sm font-semibold",
      text: "text-slate-600 font-medium",
      dot: "bg-slate-400"
    },
    "DIAGNOSING": {
      // Uses a professional light amber twist for active bench tear-downs
      badge: "bg-amber-50 text-amber-800 border border-amber-200/80 shadow-sm font-semibold",
      text: "text-amber-600 font-bold",
      dot: "bg-amber-500 animate-pulse" // Added pulse animation for real-time diagnostics!
    },
    "IN_SERVICE": {
      badge: "bg-orange-50 text-orange-800 border border-orange-200/80 shadow-sm font-semibold",
      text: "text-orange-600 font-bold",
      dot: "bg-orange-500"
    },
    "RESOLVED": {
      // Cohesive match: Integrates your premium brand emerald-green color palette (#0C5C3C)
      badge: "bg-yellow-50 text-[#0C5C3C] border border-emerald-200/80 shadow-sm font-bold",
      text: "text-[#0C5C3C] font-bold",
      dot: "bg-[#0C5C3C]"
    },
     "DELIVERED": {
      // Cohesive match: Integrates your premium brand emerald-green color palette (#0C5C3C)
      badge: "bg-emerald-50 text-[#0C5C3C] border border-emerald-200/80 shadow-sm font-bold",
      text: "text-[#0C5C3C] font-bold",
      dot: "bg-[#0C5C3C]"
    }
  };

  // 🛡️ Safe fallback guard if a weird or uninitialized state ever surfaces
  return styles[status] || {
    badge: "bg-slate-50 text-slate-500 border border-slate-200",
    text: "text-slate-400",
    dot: "bg-slate-300"
  };
};