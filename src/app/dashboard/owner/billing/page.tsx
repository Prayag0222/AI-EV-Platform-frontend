"use client";
import {
  CheckCircle2,
  Download,
  Plus,
  Printer,
  RefreshCw,
  Send,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import CounterSaleModal from "./components/CounterSaleModal";
import InvoiceBuilder from "./components/InvoiceBuilder";
import InvoiceHistory from "./components/InvoiceHistory"; 
import InvoicePreview from "./components/InvoicePreview";
import PendingTickets from "./components/PendingTickets";
import { calculateInvoice } from "./utils/calculateInvoice";
import {
  createInvoice,
  deleteInvoice,
  getBillingWorkspace,
  updateInvoicePayment,
} from "./services/billingApi";
import { downloadInvoicePDF, printInvoice } from "./services/pdfService";
import type {
  BillingTicket,
  InvoiceDraft,
  InvoiceRecord,
} from "./types/billing";
import { getProfile, type Profile } from "../services/profileApi";
import { toast } from 'react-toastify';




const ticketToDraft = (ticket: BillingTicket, profile: Profile | null): InvoiceDraft => ({
  ticketId: ticket.id,
 shopName: profile?.shopName || "VoltOps",
shopAddress: profile?.shopAddress || "",
gstNumber: profile?.gstNumber || "",
  customerName: ticket.customer.name,
  customerAddress: ticket.customer.address || "",
  customerPhone: ticket.customer.phone,
  vehicle: ticket.vehicle?.vehicleModel || "",
  vin: ticket.vehicle?.vin || "",
  technician: ticket.technician?.fullName || "Unassigned",
  repairSummary:
    ticket.aiSummary ||
    ticket.notes?.at(-1)?.structuredText ||
    ticket.description,
  items:
    ticket.parts?.map((part) => ({
      inventoryId: part.inventoryItem.id,
      name: part.inventoryItem.partName,
      sku: part.inventoryItem.sku,
      qty: part.quantity,
      price: part.inventoryItem.retailPrice,
    })) || [],
  laborCharge: ticket.finalCost || null,
taxPercent: 0,
discountPercent: 0,
  paymentMethod: "CASH",
  paymentStatus: "UNPAID",
  notes: "",
});

export default function BillingPage() {
  const [tickets, setTickets] = useState<BillingTicket[]>([]);
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [draft, setDraft] = useState<InvoiceDraft | null>(null);
  const [preview, setPreview] = useState<InvoiceRecord | null>(null);
  const [counterOpen, setCounterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  
  useEffect(() => {
    let cancelled = false;

    getBillingWorkspace()
      .then((data) => {
        if (cancelled) return;
        setTickets(data.tickets);
        setInvoices(data.invoices);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Could not load billing.",
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

      getProfile()
  .then(setProfile)
  .catch(console.error);

    return () => {
      cancelled = true;
    };
  }, []);
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 3500);
    return () => window.clearTimeout(timer);
  }, [notice]);
  const pending = useMemo(
    () =>
      tickets.filter(
        (ticket) =>
          ticket.status === "RESOLVED" &&
          !ticket.invoice &&
          !invoices.some((invoice) => invoice.ticketId === ticket.id),
      ),
    [tickets, invoices],
  );

  const saveDraft = async (value: InvoiceDraft) => {
    setSaving(true);
    setError("");
    try {
      const invoice = await createInvoice({
        customerName: value.customerName,
        customerAddress: value.customerAddress,
        customerPhone: value.customerPhone,
        shopName: value.shopName,
        shopAddress: value.shopAddress,
        gstNumber: value.gstNumber,
        ticketId: value.ticketId,
        items: value.items,
        laborCharge: value.laborCharge || null,
       tax: calculateInvoice(value).tax,
discount: calculateInvoice(value).discount,
        notes: value.notes,
        paymentStatus: value.paymentStatus,
        paymentMethod: value.paymentMethod,
      });
      setInvoices((current) => [invoice, ...current]);
      setDraft(null);
      setCounterOpen(false);
      setPreview(invoice);
      setNotice(`${invoice.invoiceNo} generated successfully.`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Invoice could not be saved.";
  setError(message);
  toast.error(message);  // ← add this line only
    } finally {
      setSaving(false);
    }
  };
  const markPaid = async (invoice: InvoiceRecord) => {
    try {
      const updated = await updateInvoicePayment(
        invoice.id,
        "PAID",
        invoice.paymentMethod === "NONE" ? "CASH" : invoice.paymentMethod,
      );
      setInvoices((list) =>
        list.map((row) => (row.id === invoice.id ? updated : row)),
      );
      setPreview((row) => (row?.id === updated.id ? updated : row));
      setNotice(`${invoice.invoiceNo} marked paid.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment update failed.");
    }
  };
  const remove = async (invoice: InvoiceRecord) => {
    if (!window.confirm(`Delete ${invoice.invoiceNo}? This cannot be undone.`))
      return;
    try {
      await deleteInvoice(invoice.id);
      setInvoices((list) => list.filter((row) => row.id !== invoice.id));
      setPreview(null);
      setNotice("Invoice deleted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    }
  };
const print = (invoice?: InvoiceRecord) => {
    const targetInvoice = invoice || preview;
    if (targetInvoice) setPreview(targetInvoice);
    if (!targetInvoice) return;
    
    window.setTimeout(() => printInvoice(targetInvoice), 80); // ✅ Fixed
  };

  const download = (invoice: InvoiceRecord) => {
    downloadInvoicePDF(invoice);
  };
  const share = (invoice: InvoiceRecord) => {
    const message = `VoltOps invoice ${invoice.invoiceNo}\nCustomer: ${invoice.customerName}\nTotal: ₹${invoice.grandTotal.toFixed(2)}\nStatus: ${invoice.paymentStatus}`;
    window.open(
      `https://wa.me/${invoice.customerPhone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  if (loading)
    return (
      <main className="grid min-h-full place-items-center bg-[#faf9f7]">
        <div className="flex items-center gap-3 text-sm font-semibold text-[#61636a]">
          <RefreshCw className="animate-spin" size={18} />
          Loading billing workspace…
        </div>
      </main>
    );
  return (
    <main className="min-h-full bg-[#faf9f7] px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
      <div className="mx-auto max-w-375 space-y-9">
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-volt-secondary">
              Revenue operations
            </p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-[#091426] sm:text-4xl">
              Billing & invoices
            </h1>
            <p className="mt-2 max-w-xl text-sm text-[#61636a]">
              Turn completed repair tickets into accurate invoices—with workshop
              data already filled in.
            </p>
          </div>
          <button
            onClick={() => setCounterOpen(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#091426] px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5"
          >
            <Plus size={17} />
            New counter sale
          </button>
        </header>
        {error && (
          <div className="flex items-center justify-between rounded-xl border border-[#ffb4ab] bg-[#fff1ef] px-4 py-3 text-sm font-semibold text-[#93000a]">
            <span>{error}</span>
            <button onClick={() => setError("")}>
              <X size={17} />
            </button>
          </div>
        )}
        {notice && (
          <div className="fixed right-5 top-5 z-70 flex items-center gap-2 rounded-xl bg-[#053b36] px-4 py-3 text-sm font-bold text-white shadow-xl">
            <CheckCircle2 size={17} className="text-[#63e6d8]" />
            {notice}
          </div>
        )}
        <PendingTickets
          tickets={pending}
          selectedId={draft?.ticketId}
          onSelect={(ticket) => {
            console.log("PROFILE BEFORE DRAFT:", profile);
            setDraft(ticketToDraft(ticket,profile));
            window.setTimeout(
              () =>
                document
                  .getElementById("invoice-builder")
                  ?.scrollIntoView({ behavior: "smooth" }),
              10,
            );
          }}
        />
        {draft && (
          <div id="invoice-builder">
            <InvoiceBuilder
              draft={draft}
              saving={saving}
              onChange={(patch) =>
                setDraft((current) =>
                  current ? { ...current, ...patch } : current,
                )
              }
              onSave={() => void saveDraft(draft)}
              onCancel={() => setDraft(null)}
            />
          </div>
        )}
        <InvoiceHistory
          invoices={invoices}
          onView={setPreview}
          onPrint={print}
          onMarkPaid={(invoice) => void markPaid(invoice)}
          onDelete={(invoice) => void remove(invoice)}
        />
      </div>
      <CounterSaleModal
     key={`${counterOpen}-${profile?.id}-${profile?.shopName ?? ""}`}
        open={counterOpen}
        saving={saving}
        profile={profile}
        onClose={() => setCounterOpen(false)}
        onSave={(value) => void saveDraft(value)}
      />
      {preview && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#091426]/70 p-4 backdrop-blur-sm print:static print:bg-white print:p-0">
          <div className="mx-auto my-4 max-w-3xl print:m-0 print:max-w-none">
            <div className="mb-3 flex flex-wrap justify-end gap-2 print:hidden">
              <button
                onClick={() => void print()}
                className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-bold"
              >
                <Printer size={15} />
                Print PDF
              </button>
              <button
                onClick={() =>void download(preview)}
                className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-bold"
              >
                <Download size={15} />
                Download PDF
              </button>
              <button
                onClick={() => share(preview)}
                className="flex items-center gap-2 rounded-lg bg-[#25d366] px-3 py-2 text-xs font-bold text-[#063b1a]"
              >
                <Send size={15} />
                Share WhatsApp
              </button>
              {preview.paymentStatus !== "PAID" && (
                <button
                  onClick={() => void markPaid(preview)}
                  className="rounded-lg bg-[#63e6d8] px-3 py-2 text-xs font-bold text-[#052b28]"
                >
                  Mark paid
                </button>
              )}
              <button
                onClick={() => setPreview(null)}
                className="rounded-lg bg-white p-2"
              >
                <X size={16} />
              </button>
            </div>
            <InvoicePreview invoice={preview} profile={profile}/>
          </div>
        </div>
      )}
    </main>
  );
}
