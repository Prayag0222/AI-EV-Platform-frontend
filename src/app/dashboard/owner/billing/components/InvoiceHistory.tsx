'use client';
import {
  ChevronLeft, ChevronRight, Search, Eye,
  Printer, Trash2, CheckCircle2, X,
} from 'lucide-react';
import { useMemo, useState, useRef, useEffect } from 'react';
import type { InvoiceRecord } from '../types/billing';
import { formatCurrency } from '../utils/calculateInvoice';

const PAGE_SIZE = 8;

interface Props {
  invoices: InvoiceRecord[];
  onView: (i: InvoiceRecord) => void;
  onPrint: (i: InvoiceRecord) => void;
  onMarkPaid: (i: InvoiceRecord) => void;
  onDelete: (i: InvoiceRecord) => void;
}

export default function InvoiceHistory({ invoices, onView, onPrint, onMarkPaid, onDelete }: Props) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('ALL');
  const [page, setPage] = useState(1);
  const [menuId, setMenuId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuId(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return invoices.filter((inv) => {
      const matchSearch = !q ||
        inv.invoiceNo.toLowerCase().includes(q) ||
        inv.customerName.toLowerCase().includes(q) ||
        inv.customerPhone.includes(q);
      const matchStatus = status === 'ALL' || inv.paymentStatus === status;
      return matchSearch && matchStatus;
    });
  }, [invoices, query, status]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pages);
  const rows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const resetPage = () => setPage(1);

  return (
    <section className="rounded-2xl border border-volt-container bg-white overflow-hidden">

      {/* ── Header ── */}
      <div className="border-b border-volt-container px-4 sm:px-6 py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-volt-secondary">Ledger</p>
            <h2 className="mt-0.5 text-lg font-black text-volt-primary">Invoice History</h2>
          </div>
          <span className="text-xs font-semibold text-slate-400">{filtered.length} records</span>
        </div>

        {/* Filters */}
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); resetPage(); }}
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
              placeholder="Search invoice, customer..."
            />
            {query && (
              <button onClick={() => { setQuery(''); resetPage(); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Status filter chips */}
          <div className="flex gap-1.5 shrink-0">
            {(['ALL', 'PAID', 'UNPAID'] as const).map((s) => (
              <button
                key={s}
                onClick={() => { setStatus(s); resetPage(); }}
                className={`rounded-xl px-3 py-2.5 text-xs font-bold transition-colors ${
                  status === s
                    ? 'bg-slate-900 text-white'
                    : 'border border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-400'
                }`}
              >
                {s === 'ALL' ? 'All' : s === 'PAID' ? 'Paid' : 'Unpaid'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Mobile Cards ── */}
      <div className="block sm:hidden divide-y divide-slate-100">
        {rows.length === 0 ? (
          <p className="py-12 text-center text-sm text-slate-400">No invoices match these filters.</p>
        ) : (
          rows.map((inv) => (
            <div key={inv.id} className="p-4 space-y-3">
              {/* Top row */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-mono text-xs font-bold text-volt-secondary truncate">{inv.invoiceNo}</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{inv.customerName}</p>
                  <p className="text-xs text-slate-400">{inv.customerPhone}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${
                    inv.paymentStatus === 'PAID'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    {inv.paymentStatus}
                  </span>
                  <p className="text-base font-black text-slate-900">{formatCurrency(inv.grandTotal)}</p>
                </div>
              </div>

              {/* Meta row */}
              <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                <span className="bg-slate-100 rounded-lg px-2 py-1 font-medium">
                  {inv.ticket?.vehicle?.vehicleModel || (inv.saleType === 'COUNTER' ? 'Counter sale' : '—')}
                </span>
                <span>{inv.paymentMethod.replace('_', ' ')}</span>
                <span>{new Date(inv.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => onView(inv)}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <Eye size={13} /> View
                </button>
                <button
                  onClick={() => onPrint(inv)}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <Printer size={13} /> Print
                </button>
                {inv.paymentStatus !== 'PAID' && (
                  <button
                    onClick={() => onMarkPaid(inv)}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
                  >
                    <CheckCircle2 size={13} /> Paid
                  </button>
                )}
                <button
                  onClick={() => onDelete(inv)}
                  className="flex items-center justify-center rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Desktop Table ── */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-200">
            <tr>
              {['Invoice No.', 'Customer', 'Vehicle', 'Date', 'Total', 'Status', 'Method', 'Actions'].map((h) => (
                <th key={h} className="px-5 py-3 font-bold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-sm text-slate-400">
                  No invoices match these filters.
                </td>
              </tr>
            ) : (
              rows.map((inv) => (
                <tr key={inv.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4 font-mono text-xs font-bold text-volt-secondary">{inv.invoiceNo}</td>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-900">{inv.customerName}</p>
                    <p className="text-xs text-slate-400">{inv.customerPhone}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {inv.ticket?.vehicle?.vehicleModel || (inv.saleType === 'COUNTER' ? 'Counter sale' : '—')}
                  </td>
                  <td className="px-5 py-4 text-slate-500 text-xs">
                    {new Date(inv.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-4 font-bold text-slate-900">{formatCurrency(inv.grandTotal)}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${
                      inv.paymentStatus === 'PAID'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {inv.paymentStatus}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs font-medium text-slate-500">
                    {inv.paymentMethod.replace('_', ' ')}
                  </td>
                  <td className="px-5 py-4">
                    <div className="relative" ref={menuId === inv.id ? menuRef : undefined}>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onView(inv)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                          title="View"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => onPrint(inv)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                          title="Print"
                        >
                          <Printer size={15} />
                        </button>
                        {inv.paymentStatus !== 'PAID' && (
                          <button
                            onClick={() => onMarkPaid(inv)}
                            className="rounded-lg p-1.5 text-emerald-500 hover:bg-emerald-50 transition-colors"
                            title="Mark Paid"
                          >
                            <CheckCircle2 size={15} />
                          </button>
                        )}
                        <button
                          onClick={() => onDelete(inv)}
                          className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {filtered.length > PAGE_SIZE && (
        <div className="flex items-center justify-between border-t border-slate-100 px-4 sm:px-6 py-4">
          <span className="text-xs text-slate-400">
            {rows.length} of {filtered.length} invoices
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={safePage <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-xl border border-slate-200 p-2 disabled:opacity-30 hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft size={15} />
            </button>
            <span className="text-xs font-semibold text-slate-600 min-w-20 text-center">
              Page {safePage} of {pages}
            </span>
            <button
              disabled={safePage >= pages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-xl border border-slate-200 p-2 disabled:opacity-30 hover:bg-slate-50 transition-colors"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}