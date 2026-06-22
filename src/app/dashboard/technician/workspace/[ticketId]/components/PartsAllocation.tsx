"use client";

import { PackagePlus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { InventoryItem, UsedPart } from "../types/index";

const money = (value: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value);

export function PartsAllocation({ inventory, parts, total, saving, onAdd, onRemove }: {
  inventory: InventoryItem[];
  parts: UsedPart[];
  total: number;
  saving: boolean;
  onAdd: (inventoryId: number, quantity: number) => Promise<boolean>;
  onRemove: (partId: number) => Promise<void>;
}) {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const matches = useMemo(() => inventory.filter((item) => item.stockLevel > 0 && `${item.partName} ${item.sku}`.toLowerCase().includes(search.toLowerCase())), [inventory, search]);
  const selected = inventory.find((item) => item.id === selectedId);

  return <section id="workspace-parts" className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
    <div className="flex items-end justify-between gap-3"><div><h2 className="font-display text-base font-bold text-slate-900">Parts Allocation</h2><p className="mt-0.5 text-xs text-slate-400">Stock is deducted only after a successful database save.</p></div><b className="text-sm text-teal-700">{money(total)}</b></div>
    <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_90px_auto]">
      <label className="relative"><Search className="absolute left-3 top-3 size-4 text-slate-400"/><input value={search} onChange={(event) => { setSearch(event.target.value); setSelectedId(null); }} className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-teal-600" placeholder="Search inventory by part or SKU"/></label>
      <input type="number" min={1} max={selected?.stockLevel || 1} value={quantity} onChange={(event) => setQuantity(Math.max(1, Number(event.target.value)))} className="h-10 rounded-xl border border-slate-200 px-3 text-sm" aria-label="Part quantity"/>
      <button disabled={!selected || saving || quantity > (selected?.stockLevel || 0)} onClick={async () => { if (selected && await onAdd(selected.id, quantity)) { setSearch(""); setSelectedId(null); setQuantity(1); } }} className="flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-xs font-bold text-white disabled:opacity-35"><PackagePlus className="size-4"/>Add</button>
    </div>
    {search && !selected && <div className="mt-2 max-h-44 overflow-y-auto rounded-xl border bg-white p-1 shadow-lg">{matches.length ? matches.slice(0, 8).map((item) => <button key={item.id} onClick={() => { setSelectedId(item.id); setSearch(`${item.partName} (${item.sku})`); }} className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs hover:bg-slate-50"><span><b className="block text-slate-800">{item.partName}</b><small className="font-mono text-slate-400">{item.sku}</small></span><span className="text-right"><b className="block text-teal-700">{money(item.retailPrice)}</b><small className="text-slate-400">{item.stockLevel} in stock</small></span></button>) : <p className="p-3 text-xs text-slate-400">No available inventory matches.</p>}</div>}
    <div className="mt-4 space-y-2">{parts.length ? parts.map((part) => <div key={part.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-xs"><span><b className="block text-slate-800">{part.inventoryItem.partName}</b><small className="font-mono text-slate-400">{part.inventoryItem.sku} · {part.quantity} × {money(part.lockedCost)}</small></span><div className="flex items-center gap-3"><b>{money(part.quantity * part.lockedCost)}</b><button disabled={saving} onClick={() => void onRemove(part.id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50" aria-label={`Remove ${part.inventoryItem.partName}`}><Trash2 className="size-4"/></button></div></div>) : <p className="rounded-xl border border-dashed p-5 text-center text-xs text-slate-400">No parts allocated yet.</p>}</div>
  </section>;
}
