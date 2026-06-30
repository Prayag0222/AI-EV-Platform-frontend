'use client';
import { Plus, Search, Trash2, X, ShoppingBag, AlertCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { InvoiceDraft } from '../types/billing';
import { searchInventory, type InventoryItem } from '../services/inventoryApi';
import { calculateInvoice, formatCurrency } from '../utils/calculateInvoice';
import PaymentPanel from './PaymentPanel';
import { toast } from 'react-toastify';
import type   { Profile } from '../../services/profileApi';

const createBlankDraft = (profile: Profile | null): InvoiceDraft => ({
  ticketId: null,
  shopName: profile?.shopName ?? "",
  shopAddress: profile?.shopAddress ?? "",
  gstNumber: profile?.gstNumber ?? "",
  customerName: "",
  customerAddress: "",
  customerPhone: "",
  vehicle: "Counter sale",
  vin: "",
  technician: "",
  repairSummary: "Walk-in spare parts / accessories sale",
  items: [],
  laborCharge: 0,
  taxPercent: 0,
  discountPercent: 0,
  paymentMethod: "CASH",
  paymentStatus: "PAID",
  notes: "",
});

interface Props {
  open: boolean;
  saving: boolean;
  profile: Profile | null;
  onClose: () => void;
  onSave: (draft: InvoiceDraft) => void;
}

export default function CounterSaleModal({ open, saving,profile, onClose, onSave }: Props) {
  const [draft, setDraft] = useState<InvoiceDraft>(() => createBlankDraft(profile));
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<InventoryItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const searchRef = useRef<HTMLDivElement>(null);




  // Reset form when modal opens


  // Debounced inventory search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        searchInventory(searchQuery)
          .then(setSearchResults)
          .catch(() => setSearchResults([]))
          .finally(() => setIsSearching(false));
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close search dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!open) return null;

  const addItem = () => {
    if (!selectedItem || quantity <= 0) return;

    if (quantity > selectedItem.stockLevel) {
      toast.warning(`Only ${selectedItem.stockLevel} units in stock`, { autoClose: 2000 });
      return;
    }

    // Check if item already added — update qty instead of duplicate
    const existing = draft.items.findIndex(i => i.inventoryId === selectedItem.id);
    if (existing !== -1) {
      const updated = [...draft.items];
      const newQty = updated[existing].qty + quantity;
      if (newQty > selectedItem.stockLevel) {
        toast.warning(`Total quantity exceeds available stock (${selectedItem.stockLevel})`, { autoClose: 2000 });
        return;
      }
      updated[existing] = { ...updated[existing], qty: newQty };
      setDraft(d => ({ ...d, items: updated }));
    } else {
      setDraft(d => ({
        ...d,
        items: [...d.items, {
          inventoryId: selectedItem.id,
          name: selectedItem.partName,
          sku: selectedItem.sku,
          qty: quantity,
          price: selectedItem.retailPrice,
        }],
      }));
    }

    setSelectedItem(null);
    setQuantity(1);
    setSearchQuery('');
    setSearchResults([]);
  };

  const removeItem = (index: number) => {
    setDraft(d => ({ ...d, items: d.items.filter((_, i) => i !== index) }));
  };

  const canSave = !saving && draft.customerName.trim() && draft.customerPhone.trim() && draft.items.length > 0;
  const totals = calculateInvoice(draft);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full sm:max-w-2xl max-h-[95dvh] sm:max-h-[90vh] flex flex-col rounded-t-3xl sm:rounded-2xl bg-white shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-slate-900 flex items-center justify-center">
              <ShoppingBag size={16} className="text-white" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Quick Checkout</p>
              <h2 className="text-base font-black text-slate-900 leading-tight">New Counter Sale</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X size={17} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-5 space-y-5">

            {/* Customer Info */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Customer</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                  placeholder="Customer name *"
                  value={draft.customerName}
                  onChange={(e) => setDraft(d => ({ ...d, customerName: e.target.value }))}
                />
                <input
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                  placeholder="Phone number *"
                  type="tel"
                  value={draft.customerPhone}
                  onChange={(e) => setDraft(d => ({ ...d, customerPhone: e.target.value }))}
                />
              </div>
            </div>

            {/* Inventory Search */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Add Items</p>
              <div ref={searchRef} className="relative">
                <div className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 transition ${searchQuery ? 'border-slate-900' : 'border-slate-200'}`}>
                  <Search size={15} className="text-slate-400 shrink-0" />
                  <input
                    className="flex-1 text-sm text-slate-900 placeholder:text-slate-400 outline-none bg-transparent"
                    placeholder="Search part name or SKU..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {isSearching && (
                    <div className="h-4 w-4 rounded-full border-2 border-slate-300 border-t-slate-700 animate-spin shrink-0" />
                  )}
                  {searchQuery && !isSearching && (
                    <button onClick={() => { setSearchQuery(''); setSearchResults([]); }} className="text-slate-400 hover:text-slate-600">
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Search Results Dropdown */}
                {searchResults.length > 0 && (
                  <div className="absolute top-full mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden">
                    {searchResults.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => { setSelectedItem(item); setSearchResults([]); setSearchQuery(item.partName); }}
                        className="w-full text-left px-4 py-3 text-sm border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900">{item.partName}</span>
                          <span className="font-bold text-slate-900">{formatCurrency(item.retailPrice)}</span>
                        </div>
                        <div className="flex items-center justify-between mt-0.5">
                          <span className="text-xs text-slate-400">{item.sku} • {item.category}</span>
                          <span className={`text-xs font-semibold ${item.stockLevel <= item.lowStockAlert ? 'text-red-500' : 'text-emerald-600'}`}>
                            {item.stockLevel} in stock
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Selected Item Controls */}
                {selectedItem && (
                  <div className="mt-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-slate-900 truncate">{selectedItem.partName}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {formatCurrency(selectedItem.retailPrice)} · {selectedItem.stockLevel} available
                        </p>
                      </div>
                      {selectedItem.stockLevel <= selectedItem.lowStockAlert && (
                        <div className="flex items-center gap-1 text-amber-600 shrink-0">
                          <AlertCircle size={13} />
                          <span className="text-xs font-semibold">Low stock</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                        <button
                          onClick={() => setQuantity(q => Math.max(1, q - 1))}
                          className="px-3 py-2 text-slate-600 hover:bg-slate-50 font-bold text-sm transition-colors"
                        >−</button>
                        <input
                          type="number"
                          min={1}
                          max={selectedItem.stockLevel}
                          value={quantity}
                          onChange={(e) => setQuantity(Math.min(selectedItem.stockLevel, Math.max(1, Number(e.target.value))))}
                          className="w-14 text-center text-sm font-semibold text-slate-900 outline-none py-2 border-x border-slate-200"
                        />
                        <button
                          onClick={() => setQuantity(q => Math.min(selectedItem.stockLevel, q + 1))}
                          className="px-3 py-2 text-slate-600 hover:bg-slate-50 font-bold text-sm transition-colors"
                        >+</button>
                      </div>
                      <span className="text-sm font-bold text-slate-900 flex-1 text-right">
                        = {formatCurrency(selectedItem.retailPrice * quantity)}
                      </span>
                      <button
                        onClick={addItem}
                        className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
                      >
                        <Plus size={13} /> Add
                      </button>
                      <button
                        onClick={() => { setSelectedItem(null); setQuantity(1); setSearchQuery(''); }}
                        className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Added Items List */}
            {draft.items.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                  Items · {draft.items.length}
                </p>
                <div className="space-y-2">
                  {draft.items.map((row, i) => (
                    <div key={i} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-900 truncate">{row.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{row.qty} × {formatCurrency(row.price)}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 ml-2">
                        <span className="text-sm font-bold text-slate-900">{formatCurrency(row.qty * row.price)}</span>
                        <button
                          onClick={() => removeItem(i)}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Notes (optional)</p>
              <textarea
                rows={2}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition resize-none"
                placeholder="Any additional notes..."
                value={draft.notes}
                onChange={(e) => setDraft(d => ({ ...d, notes: e.target.value }))}
              />
            </div>

            {/* Payment */}
            <PaymentPanel draft={draft} onChange={(patch) => setDraft(d => ({ ...d, ...patch }))} />

          </div>
        </div>

        {/* Footer — Total + CTA */}
        <div className="shrink-0 border-t border-slate-100 bg-white px-5 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="space-y-0.5">
              <p className="text-xs text-slate-400">Subtotal</p>
              <p className="text-xs text-slate-400">
                {draft.items.length} item{draft.items.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-slate-900">{formatCurrency(totals.grandTotal)}</p>
              {draft.paymentStatus === 'PAID' ? (
                <p className="text-xs font-semibold text-emerald-600">Paid · {draft.paymentMethod}</p>
              ) : (
                <p className="text-xs font-semibold text-amber-600">Unpaid</p>
              )}
            </div>
          </div>
          <button
            disabled={!canSave}
            onClick={() => onSave(draft)}
            className="w-full rounded-xl bg-slate-900 py-3.5 text-sm font-black text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-black transition-colors active:scale-[0.99]"
          >
            {saving ? 'Creating invoice…' : 'Complete Sale'}
          </button>
          {!draft.customerName || !draft.customerPhone || !draft.items.length ? (
            <p className="text-center text-xs text-slate-400 mt-2">
              {!draft.customerName ? 'Enter customer name' : !draft.customerPhone ? 'Enter phone number' : 'Add at least one item'}
            </p>
          ) : null}
        </div>

      </div>
    </div>
  );
}