import { FileText, Package, ReceiptText, Save, X } from 'lucide-react';
import type { InvoiceDraft } from '../types/billing';
import { calculateInvoice, formatCurrency } from '../utils/calculateInvoice';
import PaymentPanel from './PaymentPanel';

const inputClass = 'mt-1.5 w-full rounded-xl border border-[#d9d6d2] bg-[#fbfaf9] px-3 py-2.5 text-sm text-[#091426] outline-none transition focus:border-[#006a63] focus:ring-2 focus:ring-[#006a63]/10';

export default function InvoiceBuilder({ draft, saving, onChange, onSave, onCancel }: {
  draft: InvoiceDraft; saving: boolean; onChange: (patch: Partial<InvoiceDraft>) => void; onSave: () => void; onCancel: () => void;
}) {
  const totals = calculateInvoice(draft);
  return <section className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,.7fr)]">
    <div className="rounded-2xl border border-[#dedbd8] bg-white p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-volt-secondary">Invoice builder</p><h2 className="mt-1 text-xl font-bold">Ticket EV-{String(draft.ticketId).padStart(4, '0')}</h2></div><button onClick={onCancel} aria-label="Close invoice builder" className="rounded-lg border border-[#dedbd8] p-2 text-[#61636a] hover:bg-[#f5f3f1]"><X size={17}/></button></div>

      <div className="mt-6 space-y-4">
        <div><label className="text-xs font-bold uppercase tracking-wider text-[#61636a]">Shop name<input className={inputClass} value={draft.shopName} readOnly/></label></div>
        <div><label className="text-xs font-bold uppercase tracking-wider text-[#61636a]">Shop address<textarea className={`${inputClass} min-h-16 resize-y`} value={draft.shopAddress} readOnly/></label></div>
        <div className="grid gap-3 sm:grid-cols-2"><label className="text-xs font-bold uppercase tracking-wider text-[#61636a]">GST number (optional)<input className={inputClass} value={draft.gstNumber} readOnly/></label></div>
      </div>

      <div className="mt-6 grid gap-3 rounded-xl bg-[#f5f3f1] p-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
        {[['Customer', draft.customerName], ['Phone', draft.customerPhone], ['Vehicle', draft.vehicle], ['VIN', draft.vin], ['Technician', draft.technician], ['Ticket', `EV-${String(draft.ticketId).padStart(4, '0')}`]].map(([label, value]) => <div key={label}><p className="text-[10px] font-bold uppercase tracking-wider text-[#75777d]">{label}</p><p className="mt-0.5 truncate font-semibold text-[#091426]">{value || 'Not available'}</p></div>)}
      </div>

      <div className="mt-4"><label className="text-xs font-bold uppercase tracking-wider text-[#61636a]">Customer address<textarea className={`${inputClass} min-h-16 resize-y`} value={draft.customerAddress} onChange={(e) => onChange({ customerAddress: e.target.value })}/></label></div>

      <div className="mt-6"><div className="flex items-center gap-2"><FileText size={17} className="text-volt-secondary"/><h3 className="font-bold">Repair summary</h3></div><p className="mt-2 rounded-xl border border-[#ebe8e5] bg-[#fbfaf9] p-4 text-sm leading-6 text-[#61636a]">{draft.repairSummary || 'No repair summary was recorded.'}</p></div>
      <div className="mt-6"><div className="flex items-center gap-2"><Package size={17} className="text-volt-secondary"/><h3 className="font-bold">Parts used</h3></div><div className="mt-3 overflow-hidden rounded-xl border border-[#e5e2df]"><div className="grid grid-cols-[1fr_42px_90px] bg-[#f5f3f1] px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-[#75777d]"><span>Part</span><span>Qty</span><span className="text-right">Amount</span></div>{draft.items.length ? draft.items.map((item, index) => <div key={`${item.sku}-${index}`} className="grid grid-cols-[1fr_42px_90px] items-center border-t border-[#eeeae7] px-4 py-3 text-sm"><span><b>{item.name}</b><small className="block font-mono text-[10px] text-[#8a8b90]">{item.sku}</small></span><span>{item.qty}</span><span className="text-right font-semibold">{formatCurrency(item.qty * item.price)}</span></div>) : <p className="p-4 text-sm text-[#75777d]">No parts were logged for this repair.</p>}</div></div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2"><label className="text-xs font-bold uppercase tracking-wider text-[#61636a]">Labor charge<input className={inputClass} type="number" min="0" value={draft.laborCharge || ""} placeholder='0' onChange={(e) => onChange({ laborCharge: Number(e.target.value) })}/></label>
      
      <label className="text-xs font-bold uppercase tracking-wider text-[#61636a]">
    Discount %
    <div className="relative">
      <input
        className={`${inputClass} pr-8`}
        type="number"
        min="0"
        max="100"
        value={draft.discountPercent || ''}
        placeholder="Discount"
        onChange={(e) =>
          onChange({
            discountPercent: Number(e.target.value),
          })
        }
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#75777d]">
        %
      </span>
    </div>
  </label></div>

      <div className="mt-4"><label className="text-xs font-bold uppercase tracking-wider text-[#61636a]">
    Tax %
    <div className="relative">
      <input
        className={`${inputClass} pr-8`}
        type="number"
        min="0"
        max="100"
        value={draft.taxPercent || ''}
        placeholder="Tax"
        onChange={(e) =>
          onChange({
            taxPercent: Number(e.target.value),
          })
        }
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#75777d]">
        %
      </span>
    </div>
  </label> </div>

      <label className="mt-4 block text-xs font-bold uppercase tracking-wider text-[#61636a]">Invoice notes<textarea className={`${inputClass} min-h-24 resize-y`} value={draft.notes} onChange={(e) => onChange({ notes: e.target.value })}  placeholder="Payment terms, warranty note, or customer-facing message"/></label>
    </div>
    <aside className="space-y-5"><PaymentPanel draft={draft} onChange={onChange}/><div className="sticky top-5 rounded-2xl bg-[#091426] p-5 text-white shadow-xl"><div className="flex items-center gap-2"><ReceiptText size={18} className="text-[#63e6d8]"/><h3 className="font-bold">Invoice total</h3></div><div className="mt-5 space-y-3 text-sm"><div className="flex justify-between text-white/65"><span>Parts subtotal</span><span>{formatCurrency(totals.subtotal)}</span></div><div className="flex justify-between text-white/65"><span>Labor</span><span>{formatCurrency(totals.labor)}</span></div>{totals.tax > 0 && <div className="flex justify-between text-white/65"><span>Tax</span><span>{formatCurrency(totals.tax)}</span></div>}<div className="flex justify-between text-[#ffb4ab]"><span>Discount</span><span>− {formatCurrency(totals.discount)}</span></div><div className="flex justify-between border-t border-white/15 pt-4 text-xl font-black"><span>Total</span><span>{formatCurrency(totals.grandTotal)}</span></div></div><button disabled={saving} onClick={onSave} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#63e6d8] px-4 py-3 text-sm font-black text-[#052b28] transition hover:bg-white disabled:opacity-60"><Save size={17}/>{saving ? 'Saving…' : 'Generate & save invoice'}</button><button onClick={onCancel} className="mt-2 w-full rounded-xl px-4 py-2.5 text-xs font-bold text-white/60 hover:text-white">Cancel</button></div></aside>
  </section>;
}
