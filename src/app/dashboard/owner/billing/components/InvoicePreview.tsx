import type { InvoiceDraft, InvoiceRecord } from '../types/billing';
import type { Profile } from '../../services/profileApi'; // Ensure correct path
import {
  calculateInvoice,
  discountFromItems,
  formatCurrency,
  normalizeItems,
  visibleItems,
} from '../utils/calculateInvoice';

interface Props {
  draft?: InvoiceDraft;
  invoice?: InvoiceRecord;
  profile?: Profile | null;
}

export default function InvoicePreview({ draft, invoice, profile }: Props) {
  const items = draft?.items ?? normalizeItems(invoice?.items);
  const savedDiscount = discountFromItems(items);

  const totals = draft
    ? calculateInvoice(draft)
    : {
        subtotal: visibleItems(items).reduce((s, i) => s + i.qty * i.price, 0),
        labor: invoice?.laborCharge ?? 0,
        tax: invoice?.tax ?? 0,
        discount: savedDiscount,
        grandTotal: invoice?.grandTotal ?? 0,
      };


      
  // Fixed: Fallback to profile data to resolve empty strings in saved invoices
  const shopName = draft?.shopName || invoice?.shopName || profile?.shopName || '';
  const shopAddress = draft?.shopAddress || invoice?.shopAddress || profile?.shopAddress || '';
  const gstNumber = draft?.gstNumber || invoice?.gstNumber || profile?.gstNumber || '';
  
  const customerName = draft?.customerName || invoice?.customerName || '';
  const customerPhone = draft?.customerPhone || invoice?.customerPhone || '';
  const customerAddress = draft?.customerAddress || invoice?.customerAddress || '';
  const invoiceNo = invoice?.invoiceNo || 'DRAFT';
  const invoiceDate = invoice?.createdAt
    ? new Date(invoice.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

  const vehicleInfo =
    draft?.vehicle ||
    invoice?.ticket?.vehicle?.vehicleModel ||
    (invoice?.saleType === 'COUNTER' ? 'Counter Sale' : null);

  const ticketRef = draft?.ticketId
    ? `EV-${String(draft.ticketId).padStart(4, '0')}`
    : invoice?.ticketId
    ? `EV-${String(invoice.ticketId).padStart(4, '0')}`
    : 'Walk-in';

  const notes = draft?.notes || invoice?.notes || '';
  const repairSummary = draft?.repairSummary || '';
  const isPaid = invoice?.paymentStatus === 'PAID';
  const paymentMethod = invoice?.paymentMethod || draft?.paymentMethod || '';
  const isTaxInvoice = !!gstNumber;
  return (
    <div
      id="invoice-print-area"
      style={{ backgroundColor: '#ffffff' }}
      className="rounded-2xl border border-slate-200 shadow-xl overflow-hidden print:border-0 print:shadow-none print:rounded-none"
    >
      <div className="bg-slate-900 px-6 py-5 sm:px-8 sm:py-6 text-white" style={{ backgroundColor: '#0f172a' }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">{shopName}</h1>
            {shopAddress && <p className="mt-1 text-xs text-slate-400 max-w-xs leading-relaxed">{shopAddress}</p>}
            {gstNumber && <p className="mt-1 text-xs text-slate-400">GST: {gstNumber}</p>}
          </div>
          <div className="text-right shrink-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{isTaxInvoice ? 'Tax Invoice' : 'Invoice'}</p>
            <p className="mt-1 font-mono text-sm font-bold text-white">{invoiceNo}</p>
            <p className="mt-1 text-xs text-slate-400">{invoiceDate}</p>
          </div>
        </div>
      </div>

      {/* ── Bill To + Vehicle ── */}
      <div className="grid sm:grid-cols-2 gap-4 px-6 py-5 sm:px-8 border-b border-slate-100">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Bill To</p>
          <p className="mt-1.5 text-base font-black text-slate-900">{customerName}</p>
          <p className="text-sm text-slate-500">{customerPhone}</p>
          {customerAddress && (
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">{customerAddress}</p>
          )}
        </div>
        {(vehicleInfo || ticketRef) && (
          <div className="sm:text-right">
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
              {vehicleInfo ? 'Vehicle / Ticket' : 'Reference'}
            </p>
            {vehicleInfo && (
              <p className="mt-1.5 text-base font-black text-slate-900">{vehicleInfo}</p>
            )}
            <p className="text-sm text-slate-500">{ticketRef}</p>
          </div>
        )}
      </div>

      {/* ── Line Items ── */}
      <div className="px-6 sm:px-8 py-5">
        <div className="grid grid-cols-[1fr_36px_100px] sm:grid-cols-[1fr_60px_120px] gap-2 pb-2 border-b border-slate-200">
          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Description</span>
          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 text-center">Qty</span>
          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 text-right">Amount</span>
        </div>

        {visibleItems(items).length > 0 ? (
          visibleItems(items).map((item, i) => (
            <div
              key={`${item.sku}-${i}`}
              className="grid grid-cols-[1fr_36px_100px] sm:grid-cols-[1fr_60px_120px] gap-2 py-3 border-b border-slate-50 last:border-0"
            >
              <span>
                <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                <p className="text-[10px] font-mono text-slate-400 mt-0.5">{item.sku}</p>
              </span>
              <span className="text-sm text-slate-600 text-center self-center">{item.qty}</span>
              <span className="text-sm font-semibold text-slate-900 text-right self-center">
                {formatCurrency(item.qty * item.price)}
              </span>
            </div>
          ))
        ) : (
          <p className="py-6 text-sm text-slate-400 text-center">No items</p>
        )}
      </div>

      {/* ── Totals ── */}
      <div className="px-6 sm:px-8 pb-6 flex justify-end">
        <div className="w-full max-w-xs space-y-2">
          <div className="flex justify-between text-sm text-slate-500">
            <span>Parts subtotal</span>
            <span>{formatCurrency(totals.subtotal)}</span>
          </div>
          {totals.labor > 0 && (
            <div className="flex justify-between text-sm text-slate-500">
              <span>Labor</span>
              <span>{formatCurrency(totals.labor)}</span>
            </div>
          )}
          {totals.tax > 0 && (
            <div className="flex justify-between text-sm text-slate-500">
              <span>Tax {draft?.taxPercent ? `(${draft.taxPercent}%)` : ''}</span>
              <span>{formatCurrency(totals.tax)}</span>
            </div>
          )}
          {totals.discount > 0 && (
            <div className="flex justify-between text-sm text-red-500">
              <span>Discount {draft?.discountPercent ? `(${draft.discountPercent}%)` : ''}</span>
              <span>− {formatCurrency(totals.discount)}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-slate-200 pt-3">
            <span className="text-base font-black text-slate-900">Grand Total</span>
            <span className="text-xl font-black text-slate-900">{formatCurrency(totals.grandTotal)}</span>
          </div>
          {isPaid && (
            <div className="flex justify-between text-sm text-emerald-600 font-semibold pt-1">
              <span>Paid via {paymentMethod}</span>
              <span>✓</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Notes / Repair Summary ── */}
      {(repairSummary || notes) && (
        <div className="px-6 sm:px-8 pb-6">
          <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-4" style={{ backgroundColor: '#f8fafc' }}>
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2">Notes</p>
            {repairSummary && (
              <p className="text-xs text-slate-600 leading-relaxed">{repairSummary}</p>
            )}
            {notes && (
              <p className="text-xs text-slate-600 leading-relaxed mt-1">{notes}</p>
            )}
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <div className="border-t border-slate-100 px-6 sm:px-8 py-4 flex items-center justify-between">
        <p className="text-[10px] text-slate-400">Thank you for choosing {shopName}</p>
        <p className="text-[10px] text-slate-400 font-mono">{invoiceNo}</p>
      </div>
    </div>
  );
}