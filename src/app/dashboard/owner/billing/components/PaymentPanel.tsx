import { Banknote, CreditCard, Landmark, QrCode } from 'lucide-react';
import type { InvoiceDraft, PaymentMethod, PaymentStatus } from '../types/billing';

const methods: Array<{ value: PaymentMethod; label: string; icon: typeof Banknote }> = [
  { value: 'CASH', label: 'Cash', icon: Banknote },
  { value: 'UPI', label: 'UPI', icon: QrCode },
  { value: 'CARD', label: 'Card', icon: CreditCard },
  { value: 'BANK_TRANSFER', label: 'Bank', icon: Landmark },
];

interface Props {
  draft: InvoiceDraft;
  onChange: (patch: Partial<InvoiceDraft>) => void;
}

export default function PaymentPanel({ draft, onChange }: Props) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-bold text-slate-900">Payment Details</h3>
      <p className="mt-1 text-xs text-slate-500">Choose how this invoice will be settled.</p>
      
      <div className="mt-4 grid grid-cols-2 gap-3">
        {methods.map(({ value, label, icon: Icon }) => (
          <button
            type="button"
            key={value}
            onClick={() => onChange({ paymentMethod: value })}
            className={`flex items-center justify-center sm:justify-start gap-2 rounded-xl border px-3 py-3 text-sm font-semibold transition-colors ${
              draft.paymentMethod === value
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>
      
      <label className="mt-6 block text-[10px] font-bold uppercase tracking-widest text-slate-400">
        Payment Status
      </label>
      
      <div className="mt-2 flex rounded-xl bg-slate-100 p-1">
        {(['UNPAID', 'PAID'] as PaymentStatus[]).map((status) => (
          <button
            type="button"
            key={status}
            onClick={() => onChange({ paymentStatus: status })}
            className={`flex-1 rounded-lg px-3 py-2 text-xs font-bold transition-all ${
              draft.paymentStatus === status
                ? status === 'PAID'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'bg-white text-amber-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {status === 'PAID' ? 'Paid' : 'Unpaid'}
          </button>
        ))}
      </div>
    </section>
  );
}