'use client';

import React, { useState, useEffect } from 'react';

interface InvoiceItem {
  name: string;
  sku: string;
  qty: number;
  price: number;
}

interface InvoiceRecord {
  id: number;
  invoiceNo: string;
  customerName: string;
  customerPhone: string;
  ticketId: number | null;
  items: unknown; // Safe unknown definition for PostgreSQL json columns
  laborCharge: number;
  grandTotal: number;
  paymentStatus: string;
  paymentMethod: string;
}

// ✅ NEXT.JS CRITICAL: Explicit default export declaration matches router contract rules
export default function FunctionalBillingPage() {
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Keeps loaders running safely on mount
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form Fields State Block
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [ticketId, setTicketId] = useState('');
  const [laborCharge, setLaborCharge] = useState('0');
  const [paymentStatus, setPaymentStatus] = useState('UNPAID');
  const [paymentMethod, setPaymentMethod] = useState('CASH');

  // Temporary Row Element State Parameters
  const [lineItems, setLineItems] = useState<InvoiceItem[]>([]);
  const [tempItemName, setTempItemName] = useState('');
  const [tempItemSku, setTempItemSku] = useState('');
  const [tempItemQty, setTempItemQty] = useState('1');
  const [tempItemPrice, setTempItemPrice] = useState('');

  // 🛰️ Isolated Network Synchronization Engine
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setErrorMessage(null);
        const response = await fetch('http://127.0.0.1:3000/api/invoice');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to sync ledger.');
        }
        setInvoices(data.invoices || []);
      } catch (err: unknown) {
        const errorInstance = err instanceof Error ? err : new Error(String(err));
        setErrorMessage(errorInstance.message || 'Could not downlink transaction histories.');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []); // Fires strictly on view initialize

  // ➕ Add temporary transaction item to local basket list array
  const handleAddLineItem = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!tempItemName || !tempItemPrice) {
      alert('Please fill out Name and Price arrays before pushing entry.');
      return;
    }

    const newItem: InvoiceItem = {
      name: tempItemName,
      sku: tempItemSku || 'COUNTER-SALE',
      qty: Number(tempItemQty) || 1,
      price: Number(tempItemPrice) || 0
    };

    setLineItems([...lineItems, newItem]);
    setTempItemName('');
    setTempItemSku('');
    setTempItemQty('1');
    setTempItemPrice('');
  };

  // 💾 Commit final document data payload through REST protocol routing hooks
  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lineItems.length === 0) {
      alert('Cannot execute an empty invoice tracking manifest.');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:3000/api/invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          ticketId: ticketId ? Number(ticketId) : null,
          items: lineItems,
          laborCharge: Number(laborCharge),
          paymentStatus,
          paymentMethod
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Server rejected invoice record storage logic.');
      }

      // 🔄 Rehydrate local lists asynchronously
      const refreshResponse = await fetch('http://127.0.0.1:3000/api/invoice');
      const refreshData = await refreshResponse.json();
      if (refreshResponse.ok) {
        setInvoices(refreshData.invoices || []);
      }

      setCustomerName('');
      setCustomerPhone('');
      setTicketId('');
      setLaborCharge('0');
      setPaymentStatus('UNPAID');
      setPaymentMethod('CASH');
      setLineItems([]);
      alert(`Invoice created! Code key assigned: ${String(data.invoice?.invoiceNo)}`);
    } catch (err: unknown) {
      const errorInstance = err instanceof Error ? err : new Error(String(err));
      alert(`Transaction aborted: ${errorInstance.message}`);
    }
  };

  if (loading) return <div className="p-6 font-mono text-sm">Synchronizing billing matrix histories...</div>;
  if (errorMessage) return <div className="p-6 font-mono text-sm text-red-500">⚠️ Error: {errorMessage}</div>;

  return (
    <main className="p-8 space-y-10 max-w-6xl mx-auto">
      
      <div>
        <h1 className="text-2xl font-bold">Billing & Invoicing Utility</h1>
        <p className="text-sm text-gray-500">Direct invoice execution terminal mapping transactional ledger rows to your database.</p>
      </div>

      {/* 📥 FORM TRANSACTION BUILD PANEL */}
      <section className="p-6 border border-gray-300 rounded bg-white space-y-6">
        <h2 className="text-lg font-bold">Generate Direct Customer Receipt</h2>
        
        <div className="p-4 bg-gray-50 border rounded space-y-4">
          <h3 className="text-xs uppercase font-bold tracking-wider text-gray-600">Step 1: Add Parts/Items to Basket</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1">Item / Part Name</label>
              <input type="text" value={tempItemName} onChange={(e) => setTempItemName(e.target.value)} className="w-full border p-2 rounded text-sm bg-white" placeholder="e.g. Ather Charger" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">SKU Code (Optional)</label>
              <input type="text" value={tempItemSku} onChange={(e) => setTempItemSku(e.target.value)} className="w-full border p-2 rounded text-sm bg-white" placeholder="COUNTER-SALE" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Quantity</label>
              <input type="number" min="1" value={tempItemQty} onChange={(e) => setTempItemQty(e.target.value)} className="w-full border p-2 rounded text-sm bg-white" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Unit Price (₹)</label>
              <input type="number" value={tempItemPrice} onChange={(e) => setTempItemPrice(e.target.value)} className="w-full border p-2 rounded text-sm bg-white" placeholder="0.00" />
            </div>
          </div>
          <button type="button" onClick={handleAddLineItem} className="px-3 py-1.5 bg-gray-800 text-white font-bold text-xs rounded hover:bg-gray-700 transition cursor-pointer">
            + Push Item into Basket ({lineItems.length} Added)
          </button>

          {lineItems.length > 0 && (
            <div className="text-xs bg-white border rounded p-2 font-mono divide-y">
              {lineItems.map((basketItem, idx) => (
                <div key={idx} className="py-1 flex justify-between">
                  <span>{basketItem.name} ({basketItem.sku}) x{basketItem.qty}</span>
                  <span className="font-bold">₹{(basketItem.price * basketItem.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={handleCreateInvoice} className="space-y-4">
          <h3 className="text-xs uppercase font-bold tracking-wider text-gray-600">Step 2: Customer & Labor Parameters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1">Customer Name</label>
              <input type="text" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full border p-2 rounded text-sm bg-gray-50" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Customer Phone</label>
              <input type="text" required value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full border p-2 rounded text-sm bg-gray-50" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Ticket ID Link (Optional)</label>
              <input type="number" value={ticketId} onChange={(e) => setTicketId(e.target.value)} className="w-full border p-2 rounded text-sm bg-gray-50" placeholder="Null if Counter Sale" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Flat Labor Charges (₹)</label>
              <input type="number" value={laborCharge} onChange={(e) => setLaborCharge(e.target.value)} className="w-full border p-2 rounded text-sm bg-gray-50" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Payment Status</label>
              <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} className="w-full border p-2 rounded text-sm bg-gray-50">
                <option value="UNPAID">UNPAID</option>
                <option value="PAID">PAID</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Payment Method Reference</label>
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full border p-2 rounded text-sm bg-gray-50">
                <option value="CASH">CASH</option>
                <option value="UPI">UPI</option>
                <option value="CARD">CARD</option>
                <option value="NONE">NONE</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button type="submit" className="w-full md:w-auto px-6 py-2.5 bg-blue-600 text-white rounded font-bold text-sm hover:bg-blue-700 transition status-sync cursor-pointer">
              Compile Invoice Statement & Commit
            </button>
          </div>
        </form>
      </section>

      {/* 📊 LEDGER ARCHIVE DATA GRID */}
      <section className="border border-gray-300 rounded bg-white overflow-hidden">
        <div className="p-4 bg-gray-100 border-b border-gray-300">
          <h2 className="font-bold">Historical Financial Invoicing Ledger</h2>
        </div>
        
        {invoices.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-400">Financial database contains zero transaction records.</div>
        ) : (
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 font-bold text-xs text-gray-600">
                <th className="p-3">Invoice Code</th>
                <th className="p-3">Client</th>
                <th className="p-3">Reference Scope</th>
                <th className="p-3">Labor Fee</th>
                <th className="p-3">Grand Total</th>
                <th className="p-3">State</th>
                <th className="p-3">Method</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-3 font-mono text-xs font-bold text-blue-600">{inv.invoiceNo}</td>
                  <td className="p-3">
                    <div className="font-medium">{inv.customerName}</div>
                    <div className="text-[11px] text-gray-400 font-mono">{inv.customerPhone}</div>
                  </td>
                  <td className="p-3">
                    {inv.ticketId ? (
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-mono">Ticket #{inv.ticketId}</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs font-mono">Counter Sale</span>
                    )}
                  </td>
                  <td className="p-3 font-mono text-gray-500">₹{inv.laborCharge.toFixed(2)}</td>
                  <td className="p-3 font-mono font-bold text-gray-900">₹{inv.grandTotal.toFixed(2)}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${inv.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {inv.paymentStatus}
                    </span>
                  </td>
                  <td className="p-3 text-xs font-mono font-bold text-gray-500">{inv.paymentMethod}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

    </main>
  );
}