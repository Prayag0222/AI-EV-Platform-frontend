import { API_BASE } from '@/config/api';
import type { BillingTicket, CreateInvoicePayload, InvoiceRecord } from '../types/billing';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, init);
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || 'Billing request failed.');
  return body as T;
}

export async function getBillingWorkspace() {
  const [ticketData, invoiceData] = await Promise.all([
    request<{ tickets: BillingTicket[] }>('/operation/tickets'),
    request<{ invoices: InvoiceRecord[] }>('/invoice'),
  ]);
  return { tickets: ticketData.tickets || [], invoices: invoiceData.invoices || [] };
}

export async function createInvoice(payload: CreateInvoicePayload) {
  const data = await request<{ invoice: InvoiceRecord }>('/invoice', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
  });
  return data.invoice;
}

export const updateInvoicePayment = (id: number, paymentStatus: 'PAID' | 'UNPAID', paymentMethod?: string) =>
  request<{ invoice: InvoiceRecord }>(`/invoice/${id}`, {
    method: 'PATCH', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentStatus, ...(paymentMethod ? { paymentMethod } : {}) }),
  }).then((data) => data.invoice);

export const deleteInvoice = (id: number) => request<{ success: boolean }>(`/invoice/${id}`, { method: 'DELETE' });
