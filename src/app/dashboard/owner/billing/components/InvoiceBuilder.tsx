'use client';
import { FileText, Package, ReceiptText, Save, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import type { InvoiceDraft } from '../types/billing';
import { calculateInvoice, formatCurrency } from '../utils/calculateInvoice';
import PaymentPanel from './PaymentPanel';

const input = 'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 focus:bg-white';

interface Props {
  draft: InvoiceDraft;
  saving: boolean;
  onChange: (patch: Partial<InvoiceDraft>) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function InvoiceBuilder({ draft, saving, onChange, onSave, onCancel }: Props) {
  const totals = calculateInvoice(draft);
  const [showShopDetails, setShowShopDetails] = useState(false);

  const ticketLabel = draft.ticketId ? `EV-${String(draft.ticketId).padStart(4, '0')}` : 'Counter Sale';

  return (
    <section className="grid gap-5 xl:grid-cols-[1fr_320px]">

      {/* ── Left: Main Form ── */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Invoice Builder</p>
            <h2 className="text-lg font-black text-slate-900 mt-0.5">{ticketLabel}</h2>
          </div>
          <button
            onClick={onCancel}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-6">

          {/* Shop Details — collapsible */}
          <div className="rounded-xl border border-slate-100 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowShopDetails(v => !v)}
              className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Shop Details</span>
              {showShopDetails ? <ChevronUp size={15} className="text-slate-400" /> : <ChevronDown size={15} className="text-slate-400" />}
            </button>
            {showShopDetails && (
              <div className="p-4 space-y-3 border-t border-slate-100">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Shop Name</label>
                  <input className={`${input} mt-1.5`} value={draft.shopName} readOnly />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Shop Address</label>
                  <textarea className={`${input} mt-1.5 min-h-16 resize-none`} value={draft.shopAddress} readOnly />
                </div>
                {draft.gstNumber && (
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">GST Number</label>
                    <input className={`${input} mt-1.5`} value={draft.gstNumber} readOnly />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Customer & Ticket Info */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Customer & Ticket</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-xl bg-slate-50 border border-slate-100 p-4">
              {[
                ['Customer', draft.customerName],
                ['Phone', draft.customerPhone],
                ['Vehicle', draft.vehicle],
                ['VIN', draft.vin],
                ['Technician', draft.technician],
                ['Ticket', ticketLabel],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-900 truncate">{value || '—'}</p>
                </div>
              ))}
            </div>
            <div className="mt-3">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Customer Address
              </label>
              <textarea
                className={`${input} mt-1.5 min-h-14 resize-none`}
                placeholder="Customer address (optional)"
                value={draft.customerAddress}
                onChange={(e) => onChange({ customerAddress: e.target.value })}
              />
            </div>
          </div>

          {/* Repair Summary */}
          {draft.repairSummary && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText size={15} className="text-slate-400" />
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Repair Summary</p>
              </div>
              <p className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-600">
                {draft.repairSummary}
              </p>
            </div>
          )}

          {/* Parts Used */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Package size={15} className="text-slate-400" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Parts Used</p>
            </div>
            {draft.items.length > 0 ? (
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <div className="grid grid-cols-[1fr_40px_96px] bg-slate-50 px-4 py-2.5 text-[9px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">
                  <span>Part</span>
                  <span>Qty</span>
                  <span className="text-right">Amount</span>
                </div>
                {draft.items.map((item, i) => (
                  <div
                    key={`${item.sku}-${i}`}
                    className="grid grid-cols-[1fr_40px_96px] items-center border-b border-slate-100 last:border-0 px-4 py-3"
                  >
                    <span>
                      <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                      <p className="text-[10px] font-mono text-slate-400 mt-0.5">{item.sku}</p>
                    </span>
                    <span className="text-sm text-slate-600">{item.qty}</span>
                    <span className="text-sm font-semibold text-slate-900 text-right">
                      {formatCurrency(item.qty * item.price)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-400">
                No parts logged for this repair.
              </p>
            )}
          </div>

          {/* Charges */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Charges & Adjustments</p>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Labor charge</label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-medium">₹</span>
                  <input
                    className={`${input} pl-8`}
                    type="number"
                    min="0"
                    value={draft.laborCharge || ''}
                    placeholder="0"
                    onChange={(e) => onChange({ laborCharge: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tax %</label>
                <div className="relative mt-1.5">
                  <input
                    className={`${input} pr-8`}
                    type="number"
                    min="0"
                    max="100"
                    value={draft.taxPercent || ''}
                    placeholder="0"
                    onChange={(e) => onChange({ taxPercent: Number(e.target.value) })}
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">%</span>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Discount %</label>
                <div className="relative mt-1.5">
                  <input
                    className={`${input} pr-8`}
                    type="number"
                    min="0"
                    max="100"
                    value={draft.discountPercent || ''}
                    placeholder="0"
                    onChange={(e) => onChange({ discountPercent: Number(e.target.value) })}
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Invoice Notes
            </label>
            <textarea
              className={`${input} mt-1.5 min-h-20 resize-none`}
              placeholder="Payment terms, warranty info, or customer message..."
              value={draft.notes}
              onChange={(e) => onChange({ notes: e.target.value })}
            />
          </div>

        </div>
      </div>

      {/* ── Right: Summary + Payment ── */}
      <aside className="space-y-4">

        <PaymentPanel draft={draft} onChange={onChange} />

        {/* Totals Card */}
        <div className="sticky top-5 rounded-2xl bg-slate-900 p-5 text-white">
          <div className="flex items-center gap-2 mb-5">
            <ReceiptText size={16} className="text-emerald-400" />
            <h3 className="text-sm font-bold">Invoice Total</h3>
          </div>

          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between text-slate-400">
              <span>Parts subtotal</span>
              <span>{formatCurrency(totals.subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Labor</span>
              <span>{formatCurrency(totals.labor)}</span>
            </div>
            {totals.tax > 0 && (
              <div className="flex justify-between text-slate-400">
                <span>Tax ({draft.taxPercent}%)</span>
                <span>{formatCurrency(totals.tax)}</span>
              </div>
            )}
            {totals.discount > 0 && (
              <div className="flex justify-between text-red-400">
                <span>Discount ({draft.discountPercent}%)</span>
                <span>− {formatCurrency(totals.discount)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-white/10 pt-3 text-xl font-black">
              <span>Total</span>
              <span>{formatCurrency(totals.grandTotal)}</span>
            </div>
          </div>

          <button
            disabled={saving}
            onClick={onSave}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-3.5 text-sm font-black text-emerald-950 hover:bg-emerald-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
          >
            <Save size={15} />
            {saving ? 'Saving…' : 'Generate Invoice'}
          </button>

          <button
            onClick={onCancel}
            className="mt-2 w-full rounded-xl px-4 py-2.5 text-xs font-semibold text-white/40 hover:text-white/70 transition-colors"
          >
            Cancel
          </button>
        </div>
      </aside>

    </section>
  );
}