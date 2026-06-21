import type { InvoiceDraft, InvoiceItem, InvoiceTotals } from '../types/billing';

export const normalizeItems = (items: unknown): InvoiceItem[] => {
  if (!Array.isArray(items)) return [];
  return items.filter((item): item is InvoiceItem => {
    if (!item || typeof item !== 'object') return false;
    const candidate = item as Partial<InvoiceItem>;
    return typeof candidate.name === 'string' && typeof candidate.sku === 'string' &&
      typeof candidate.qty === 'number' && typeof candidate.price === 'number';
  });
};

export const calculateInvoice = (draft: Pick<InvoiceDraft, 'items' | 'laborCharge' | 'discount'>): InvoiceTotals => {
  const subtotal = draft.items.reduce((sum, item) => sum + Math.max(0, item.qty) * item.price, 0);
  const labor = Math.max(0, Number(draft.laborCharge) || 0);
  const discount = Math.min(Math.max(0, Number(draft.discount) || 0), subtotal + labor);
  return { subtotal, labor, discount, grandTotal: subtotal + labor - discount };
};

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(amount);

export const discountFromItems = (items: InvoiceItem[]) =>
  Math.abs(items.find((item) => item.sku === 'VOLTOPS-DISCOUNT')?.price || 0);

export const visibleItems = (items: InvoiceItem[]) => items.filter((item) => !item.sku.startsWith('VOLTOPS-'));
