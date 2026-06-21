import { CalendarDays, ChevronRight, PackageCheck, UserRound } from 'lucide-react';
import type { BillingTicket } from '../types/billing';
import { formatCurrency } from '../utils/calculateInvoice';

export default function PendingTickets({ tickets, selectedId, onSelect }: {
  tickets: BillingTicket[]; selectedId?: number | null; onSelect: (ticket: BillingTicket) => void;
}) {
  return (
    <section aria-labelledby="ready-heading">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#006a63]">Billing queue</p><h2 id="ready-heading" className="mt-1 text-xl font-bold text-[#091426]">Ready for billing</h2></div>
        <span className="rounded-full bg-[#d7f4ef] px-3 py-1 text-xs font-bold text-[#006a63]">{tickets.length} ready</span>
      </div>
      {tickets.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#c5c6cd] bg-white p-8 text-center text-sm text-[#61636a]">No resolved tickets are waiting for an invoice.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tickets.map((ticket) => {
            const partsTotal = ticket.parts?.reduce((sum, part) => sum + part.inventoryItem.retailPrice * part.quantity, 0) || 0;
            const active = selectedId === ticket.id;
            return <article key={ticket.id} className={`rounded-2xl border bg-white p-5 shadow-sm transition ${active ? 'border-[#006a63] ring-2 ring-[#006a63]/10' : 'border-[#e1dedb] hover:-translate-y-0.5 hover:shadow-md'}`}>
              <div className="flex items-start justify-between"><span className="rounded-md bg-[#091426] px-2.5 py-1 font-mono text-xs font-bold text-white">EV-{String(ticket.id).padStart(4, '0')}</span><span className="text-xs font-semibold text-[#006a63]">Resolved</span></div>
              <h3 className="mt-4 text-lg font-bold text-[#091426]">{ticket.customer.name}</h3>
              <p className="mt-1 text-sm text-[#61636a]">{ticket.vehicle?.vehicleModel || 'Vehicle not linked'}</p>
              <div className="mt-4 grid gap-2 text-xs text-[#61636a]">
                <span className="flex items-center gap-2"><UserRound size={14}/>{ticket.technician?.fullName || 'Unassigned technician'}</span>
                <span className="flex items-center gap-2"><CalendarDays size={14}/>{new Date(ticket.closedAt || ticket.updatedAt).toLocaleDateString('en-IN')}</span>
                <span className="flex items-center gap-2"><PackageCheck size={14}/>{ticket.parts?.length || 0} part lines · {formatCurrency(partsTotal)}</span>
              </div>
              <button onClick={() => onSelect(ticket)} className="mt-5 flex w-full items-center justify-between rounded-xl bg-[#f1f5f4] px-4 py-3 text-sm font-bold text-[#006a63] transition hover:bg-[#d7f4ef]">Generate invoice <ChevronRight size={16}/></button>
            </article>;
          })}
        </div>
      )}
    </section>
  );
}
