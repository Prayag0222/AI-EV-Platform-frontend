'use client';
import { Plus, Search, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { InvoiceDraft, } from '../types/billing';
import { searchInventory, type InventoryItem } from '../services/inventoryApi';
import { calculateInvoice, formatCurrency } from '../utils/calculateInvoice';
import PaymentPanel from './PaymentPanel';

const blank: InvoiceDraft = {
  ticketId: null,
  shopName: 'VoltOps',
  shopAddress: '',
  gstNumber: '',
  customerName: '',
  customerAddress: '',
  customerPhone: '',
  vehicle: 'Counter sale',
  vin: '',
  technician: '',
  repairSummary: 'Walk-in spare parts / accessories sale',
  items: [],
  laborCharge: 0,
  tax: 0,
  discount: 0,
  paymentMethod: 'CASH',
  paymentStatus: 'PAID',
  notes: ''
};

export default function CounterSaleModal({ open, saving, onClose, onSave }: { open: boolean; saving: boolean; onClose: () => void; onSave: (draft: InvoiceDraft) => void }) {
  const [draft, setDraft] = useState(blank);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<InventoryItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        setIsSearching(true);
        searchInventory(searchQuery)
          .then(setSearchResults)
          .finally(() => setIsSearching(false));
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (!open) return null;

  const addItem = () => {
    if (!selectedItem || quantity <= 0) return;
    setDraft((d) => ({
      ...d,
  items: [...d.items, {
  inventoryId: selectedItem.id,
  name: selectedItem.partName,
  sku: selectedItem.sku,
  qty: quantity,
  price: selectedItem.retailPrice,
}],
    }));
    setSelectedItem(null);
    setQuantity(1);
    setSearchQuery('');
    setSearchResults([]);
  };

  const totals = calculateInvoice(draft);

  return <div className="fixed inset-0 z-50 overflow-y-auto bg-[#091426]/65 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
    <div className="mx-auto my-4 max-w-3xl rounded-2xl bg-[#faf9f7] shadow-2xl">
      <div className="flex items-center justify-between border-b p-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-volt-secondary">Quick checkout</p>
          <h2 className="text-xl font-black text-[#091426]">New counter sale</h2>
        </div>
        <button onClick={onClose} className="rounded-lg p-2 hover:bg-[#eeeae7]"><X size={19}/></button>
      </div>

      <div className="grid gap-5 p-5 md:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <input className="rounded-xl border p-3 text-sm" placeholder="Customer name" value={draft.customerName} onChange={(e) => setDraft({ ...draft, customerName: e.target.value })}/>
            <input className="rounded-xl border p-3 text-sm" placeholder="Phone number" value={draft.customerPhone} onChange={(e) => setDraft({ ...draft, customerPhone: e.target.value })}/>
          </div>

          <div className="rounded-xl border bg-white p-4">
            <h3 className="font-bold mb-3">Search and add inventory items</h3>
            <div className="relative">
              <div className="flex items-center gap-2 rounded-lg border p-2">
                <Search size={16} className="text-[#75777d]"/>
                <input
                  className="flex-1 outline-none text-sm"
                  placeholder="Search by part name, SKU, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {searchResults.length > 0 && (
                <div className="absolute top-full mt-1 w-full bg-white border rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                  {searchResults.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className={`w-full text-left px-3 py-2 text-sm border-b last:border-0 hover:bg-[#f5f3f1] ${selectedItem?.id === item.id ? 'bg-[#e8f7f4]' : ''}`}
                    >
                      <div className="font-semibold">{item.partName}</div>
                      <div className="text-xs text-[#75777d]">{item.sku} • {formatCurrency(item.retailPrice)} • Stock: {item.stockLevel}</div>
                    </button>
                  ))}
                </div>
              )}

              {selectedItem && (
                <div className="mt-3 p-3 rounded-lg bg-[#e8f7f4] border text-volt-secondary">
                  <p className="font-semibold text-sm">{selectedItem.partName}</p>
                  <p className="text-xs text-[#61636a] mt-1">{selectedItem.sku} • {formatCurrency(selectedItem.retailPrice)} • Available: {selectedItem.stockLevel}</p>
                  <div className="mt-3 flex gap-2">
                    <input
                      className="flex-1 rounded-lg border p-2 text-sm"
                      type="number"
                      min="1"
                      max={selectedItem.stockLevel}
                      placeholder="Quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    />
                    <button onClick={addItem} className="flex items-center gap-2 rounded-lg bg-[#091426] px-3 py-2 text-xs font-bold text-white"><Plus size={15}/>Add</button>
                    <button onClick={() => { setSelectedItem(null); setQuantity(1); }} className="rounded-lg border p-2 text-[#75777d] hover:bg-[#f5f3f1]"><X size={16}/></button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {draft.items.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#61636a]">Added items ({draft.items.length})</h4>
              {draft.items.map((row, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl border bg-white p-3 text-sm">
                  <span>
                    <b>{row.name}</b>
                    <small className="block text-[#75777d]">{row.qty} × {formatCurrency(row.price)}</small>
                  </span>
                  <button onClick={() => setDraft({ ...draft, items: draft.items.filter((_, index) => index !== i) })} className="p-2 text-volt-terracotta"><Trash2 size={16}/></button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <PaymentPanel draft={draft} onChange={(patch) => setDraft({ ...draft, ...patch })}/>
          <div className="mt-4 rounded-xl bg-[#091426] p-4 text-white">
            <div className="flex justify-between text-lg font-black">
              <span>Total</span>
              <span>{formatCurrency(totals.grandTotal)}</span>
            </div>
            <button disabled={saving || !draft.customerName || !draft.customerPhone || !draft.items.length} onClick={() => onSave(draft)} className="mt-4 w-full rounded-lg bg-[#63e6d8] py-3 text-sm font-black text-[#052b28] disabled:opacity-40">
              {saving ? 'Saving…' : 'Complete sale'}
            </button>
          </div>
        </div>
      </div>
    </div>
    {isSearching && (
  <div className="p-2 text-xs text-gray-500">
    Searching...
  </div>
)}
  </div>;
}

