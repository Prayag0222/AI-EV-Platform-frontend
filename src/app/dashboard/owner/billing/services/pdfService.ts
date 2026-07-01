import type { InvoiceRecord } from "../types/billing";
import { API_BASE } from "@/config/api";

async function fetchPDF(
  invoiceId: number,
  download = false
): Promise<Blob> {
  const response = await fetch(
    `${API_BASE}/invoice/${invoiceId}/pdf${
      download ? "?download=true" : ""
    }`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to generate invoice PDF.");
  }

  return await response.blob();
}

export const printInvoice = (invoice: InvoiceRecord) => {
  window.open(
    `${API_BASE}/invoice/${invoice.id}/print`,
    "_blank",
    "noopener,noreferrer"
  );
};

export const downloadInvoicePDF = async (
  invoice: InvoiceRecord
) => {
  const blob = await fetchPDF(invoice.id, true);

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = `${invoice.invoiceNo}-${invoice.customerName.replace(
    /\s+/g,
    "-"
  )}.pdf`;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

export const shareOnWhatsApp = (invoice: InvoiceRecord) => {
  const message =
    `Hello ${invoice.customerName}, your invoice ${invoice.invoiceNo} ` +
    `for ₹${invoice.grandTotal.toFixed(2)} is ready.`;

  const phone = invoice.customerPhone.replace(/\D/g, "");

  window.open(
    `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`,
    "_blank"
  );
};
