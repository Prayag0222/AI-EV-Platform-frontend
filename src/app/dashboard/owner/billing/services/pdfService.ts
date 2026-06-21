import type { InvoiceRecord } from '../types/billing';

export const downloadInvoicePDF = async (invoice: InvoiceRecord) => {
  if (typeof window === 'undefined') return;

  const { default: html2pdf } = await import('html2pdf.js');

  const element = document.getElementById('invoice-print-area');

  if (!element) return;

  const options = {
    margin: 10,
    filename: `${invoice.invoiceNo}.pdf`,
    image: { type: 'jpeg' as const , quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: {
      orientation: 'portrait' as const,
      unit: 'mm',
      format: 'a4',
    },
  };

  html2pdf().set(options).from(element).save();
};

export const printInvoice = () => {
  if (typeof window === 'undefined') return;
  window.print();
};