import { Banknote, CreditCard, Landmark, QrCode } from 'lucide-react';
import type { InvoiceDraft, PaymentMethod, PaymentStatus } from '../types/billing';

const methods: Array<{ value: PaymentMethod; label: string; icon: typeof Banknote }> = [
  { value: 'CASH', label: 'Cash', icon: Banknote }, { value: 'UPI', label: 'UPI', icon: QrCode },
  { value: 'CARD', label: 'Card', icon: CreditCard }, { value: 'BANK_TRANSFER', label: 'Bank', icon: Landmark },
];

export default function PaymentPanel({ draft, onChange }: { draft: InvoiceDraft; onChange: (patch: Partial<InvoiceDraft>) => void }) {
  return <section className="rounded-2xl border border-[#e1dedb] bg-white p-5">
    <h3 className="font-bold text-[#091426]">Payment</h3>
    <p className="mt-1 text-xs text-[#75777d]">Choose how this invoice will be settled.</p>
    <div className="mt-4 grid grid-cols-2 gap-2">
      {methods.map(({ value, label, icon: Icon }) => <button type="button" key={value} onClick={() => onChange({ paymentMethod: value })} className={`flex items-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold ${draft.paymentMethod === value ? 'border-[#006a63] bg-[#e8f7f4] text-[#006a63]' : 'border-[#dedbd8] text-[#61636a]'}`}><Icon size={16}/>{label}</button>)}
    </div>
    <label className="mt-5 block text-xs font-bold uppercase tracking-wider text-[#61636a]">Payment status</label>
    <div className="mt-2 flex rounded-xl bg-[#f2f0ef] p-1">
      {(['UNPAID', 'PAID'] as PaymentStatus[]).map((status) => <button type="button" key={status} onClick={() => onChange({ paymentStatus: status })} className={`flex-1 rounded-lg px-3 py-2 text-xs font-bold ${draft.paymentStatus === status ? 'bg-white text-[#091426] shadow-sm' : 'text-[#75777d]'}`}>{status === 'PAID' ? 'Paid' : 'Unpaid'}</button>)}
    </div>
  </section>;
}
