import { Profile } from "../../services/profileApi";

export type PaymentMethod = 'CASH' | 'UPI' | 'CARD' | 'BANK_TRANSFER' | 'NONE';
export type PaymentStatus = 'PAID' | 'UNPAID';

export interface InvoiceItem {
  name: string;
  sku: string;
  qty: number;
  price: number;
  inventoryId?: number;
}

export interface BillingTicket {
  id: number;
  issueCategory: string;
  description: string;
  status: string;
  closedAt?: string | null;
  updatedAt: string;
  aiSummary?: string | null;
  finalCost?: number | null;
  customer: { name: string; phone: string; address?: string };
  vehicle?: { vehicleModel: string; vin: string } | null;
  technician?: { fullName: string } | null;
  notes?: Array<{ structuredText: string }>;
  parts?: Array<{
    id: number;
    quantity: number ;
    lockedCost: number;
    inventoryItem: {id:number, partName: string; sku: string; retailPrice: number };
  }>;
  invoice?: { id: number } | null;
}

export interface InvoiceRecord {
  id: number;
  invoiceNo: string;
  shopName: string;
  shopAddress: string;
  gstNumber?: string | null;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  ticketId: number | null;
  items: unknown;
  laborCharge: number;
  tax: number;
  discount: number;
  grandTotal: number;
  notes: string;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  saleType?: 'REPAIR' | 'COUNTER';
  createdAt: string;
  updatedAt: string;
  ticket?: BillingTicket | null;
}

export interface InvoiceDraft {
  ticketId: number | null;
  shopName: string;
  shopAddress: string;
  gstNumber: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  vehicle: string;
  vin: string;
  technician: string;
  repairSummary: string;
  items: InvoiceItem[];
  laborCharge: number | null;
taxPercent: number;
discountPercent: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  notes: string
}

export interface InvoiceTotals {
  subtotal: number;
  labor: number;
  tax: number;
  discount: number;
  grandTotal: number;
}

export interface CreateInvoicePayload {
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  shopName?: string;
  shopAddress?: string;
  gstNumber?: string;
  ticketId: number | null;
  items: InvoiceItem[];
  laborCharge: number | null;
  tax: number;
  discount: number;
  notes?: string;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
}


