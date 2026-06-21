"use client";

import { Calculator, Save } from "lucide-react";
import { useState } from "react";
import type { RepairCostInput, RepairCostTotals, RepairTicket } from "../types/index";

const money = (value: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value);

export function RepairCostPanel({ ticket, partsTotal, saving, onSave }: {
  ticket: RepairTicket;
  partsTotal: number;
  saving: boolean;
  onSave: (costs: RepairCostInput) => Promise<RepairCostTotals | null>;
}) {
  const [costs, setCosts] = useState<RepairCostInput>({
    estimatedCost: ticket.estimatedCost || 0,
    laborHours: ticket.laborHours || 0,
    laborRate: ticket.laborRate || 0,
    taxRate: ticket.taxRate || 0,
    discount: ticket.discount || 0,
  });
  const [saved, setSaved] = useState(false);

  const laborTotal = costs.laborHours * costs.laborRate;
  const subtotal = partsTotal + laborTotal;
  const taxAmount = subtotal * (costs.taxRate / 100);
  const grossTotal = subtotal + taxAmount;
  const grandTotal = Math.max(0, grossTotal - costs.discount);
  const invalidDiscount = costs.discount > grossTotal;

  const update = (field: keyof RepairCostInput, value: string) => {
    setSaved(false);
    setCosts((current) => ({ ...current, [field]: Math.max(0, Number(value) || 0) }));
  };

  return <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
    <div className="flex items-start justify-between gap-4"><div><div className="flex items-center gap-2"><Calculator className="size-4 text-teal-700"/><h2 className="font-display text-base font-bold text-slate-900">Repair Cost Panel</h2></div><p className="mt-1 text-xs text-slate-400">Parts pricing comes from locked inventory allocations.</p></div>{saved && <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">Saved</span>}</div>

    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <CostInput label="Estimated cost" value={costs.estimatedCost} onChange={(value) => update("estimatedCost", value)} prefix="₹"/>
      <CostInput label="Labor hours" value={costs.laborHours} onChange={(value) => update("laborHours", value)} step="0.25"/>
      <CostInput label="Labor rate/hour" value={costs.laborRate} onChange={(value) => update("laborRate", value)} prefix="₹"/>
      <CostInput label="Tax rate" value={costs.taxRate} onChange={(value) => update("taxRate", value)} suffix="%" max={100}/>
      <CostInput label="Discount" value={costs.discount} onChange={(value) => update("discount", value)} prefix="₹"/>
    </div>

    {invalidDiscount && <p className="mt-2 text-xs font-semibold text-red-600">Discount cannot exceed the total before discount.</p>}

    <div className="mt-5 grid gap-2 rounded-xl bg-slate-50 p-4 text-xs sm:grid-cols-2 lg:grid-cols-3">
      <Total label="Parts total" value={partsTotal}/><Total label="Labor total" value={laborTotal}/><Total label="Subtotal" value={subtotal}/><Total label={`Tax (${costs.taxRate}%)`} value={taxAmount}/><Total label="Discount" value={-costs.discount}/><div className="flex items-center justify-between rounded-lg bg-slate-900 px-3 py-2.5 text-white"><b>Grand total</b><strong className="text-sm">{money(grandTotal)}</strong></div>
    </div>

    <div className="mt-4 flex justify-end"><button disabled={saving || invalidDiscount} onClick={async () => setSaved(Boolean(await onSave(costs)))} className="flex h-10 items-center gap-2 rounded-xl bg-teal-700 px-4 text-xs font-bold text-white hover:bg-teal-800 disabled:opacity-40"><Save className="size-4"/>{saving ? "Saving…" : "Save repair costs"}</button></div>
  </section>;
}

function CostInput({ label, value, onChange, prefix, suffix, step = "0.01", max }: { label: string; value: number; onChange: (value: string) => void; prefix?: string; suffix?: string; step?: string; max?: number }) {
  return <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500"><span>{label}</span><span className="mt-1.5 flex h-10 items-center rounded-xl border border-slate-200 bg-white px-3 focus-within:border-teal-600">{prefix && <span className="mr-1 text-slate-400">{prefix}</span>}<input type="number" min="0" max={max} step={step} value={value} onChange={(event) => onChange(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-800 outline-none"/>{suffix && <span className="ml-1 text-slate-400">{suffix}</span>}</span></label>;
}

function Total({ label, value }: { label: string; value: number }) {
  return <div className="flex items-center justify-between rounded-lg border border-slate-200/60 bg-white px-3 py-2.5"><span className="text-slate-500">{label}</span><b className={value < 0 ? "text-red-600" : "text-slate-800"}>{money(value)}</b></div>;
}
