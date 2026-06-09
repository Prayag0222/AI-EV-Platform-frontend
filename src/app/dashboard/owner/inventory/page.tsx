'use client';

import React, { useState, useEffect } from 'react';

interface InventoryItem {
  id: number;
  partName: string;
  sku: string;
  category: string;
  stockLevel: number;
  retailPrice: number;
  lowStockAlert: number;
}

export default function FunctionalInventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Initialized to true by default to avoid cascading renders
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form Field States — ✅ SKU field state is completely removed!
  const [partName, setPartName] = useState('');
  const [category, setCategory] = useState('');
  const [stockLevel, setStockLevel] = useState('0');
  const [retailPrice, setRetailPrice] = useState('');
  const [lowStockAlert, setLowStockAlert] = useState('5');

  // 🛰️ 1. Isolated Fetch Engine inside Effect Scope to prevent cascading updates
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setErrorMessage(null);
        const response = await fetch('http://127.0.0.1:3000/api/inventory');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch inventory.');
        }
        setItems(data.items || []);
      } catch (err: unknown) {
        // Enforcing strict linter checkup mapping via explicit instance checking
        const errorInstance = err instanceof Error ? err : new Error(String(err));
        setErrorMessage(errorInstance.message || 'Could not connect to backend server.');
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []); // Triggers strictly once on mount

  // 💾 2. Submit new part data using standard REST POST method (Without manual SKU field)
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:3000/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partName,
          category, // Backend uses this to build your SKU prefix
          stockLevel: Number(stockLevel),
          retailPrice: Number(retailPrice),
          lowStockAlert: Number(lowStockAlert)
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Server rejected submission.');
      }

      // 🔄 Async inline rehydration to refresh data table safely
      const refreshResponse = await fetch('http://127.0.0.1:3000/api/inventory');
      const refreshData = await refreshResponse.json();
      if (refreshResponse.ok) {
        setItems(refreshData.items || []);
      }

      // Reset Input Form Strings
      setPartName('');
      setCategory('');
      setStockLevel('0');
      setRetailPrice('');
      setLowStockAlert('5');
      alert('Item added successfully! Server generated code: ' + String(data.item?.sku));
    } catch (err: unknown) {
      const errorInstance = err instanceof Error ? err : new Error(String(err));
      alert(`Error: ${errorInstance.message}`);
    }
  };

  if (loading) return <div className="p-6 font-mono text-sm">Loading inventory dataset...</div>;
  if (errorMessage) return <div className="p-6 font-mono text-sm text-red-500">⚠️ Error: {errorMessage}</div>;

  return (
    <main className="p-8 space-y-10 max-w-6xl mx-auto">
      
      {/* Structural Headers */}
      <div>
        <h1 className="text-2xl font-bold">Inventory Management Framework</h1>
        <p className="text-sm text-gray-500">Symmetrical pipeline syncing server-side auto-generated tracking codes to your table grid layout.</p>
      </div>

      {/* 📥 PLAIN INPUT FORM BLOCK */}
      <section className="p-6 border border-gray-300 rounded bg-white">
        <h2 className="text-lg font-bold mb-4">Add New Stock Asset</h2>
        <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold mb-1">Part Name</label>
            <input type="text" required value={partName} onChange={(e) => setPartName(e.target.value)} className="w-full border p-2 rounded text-sm bg-gray-50" placeholder="e.g. Ather Brake Pads" />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Category</label>
            <input type="text" required value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border p-2 rounded text-sm bg-gray-50" placeholder="e.g. Consumables, Electrical" />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Initial Stock Level</label>
            <input type="number" required value={stockLevel} onChange={(e) => setStockLevel(e.target.value)} className="w-full border p-2 rounded text-sm bg-gray-50" />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Retail Price (₹ )</label>
            <input type="number" step="0.01" required value={retailPrice} onChange={(e) => setRetailPrice(e.target.value)} className="w-full border p-2 rounded text-sm bg-gray-50" placeholder="0.00" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold mb-1">Low Stock Threshold Limit</label>
            <input type="number" required value={lowStockAlert} onChange={(e) => setLowStockAlert(e.target.value)} className="w-full border p-2 rounded text-sm bg-gray-50" />
          </div>
          <div className="md:col-span-2 pt-2">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded font-bold text-sm hover:bg-blue-700 transition-colors cursor-pointer">
              Generate Tracking Code & Save
            </button>
          </div>
        </form>
      </section>

      {/* 📊 BARE-BONES DATA TABLE GRID VIEW */}
      <section className="border border-gray-300 rounded bg-white overflow-hidden">
        <div className="p-4 bg-gray-100 border-b border-gray-300">
          <h2 className="font-bold">Active Warehouse Stock List</h2>
        </div>
        
        {items.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-400">Inventory ledger is empty. Add your first part above.</div>
        ) : (
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 font-bold text-xs text-gray-600">
                <th className="p-3">ID</th>
                <th className="p-3">Part Name</th>
                <th className="p-3">Auto SKU</th>
                <th className="p-3">Category</th>
                <th className="p-3">Stock Level</th>
                <th className="p-3">Price</th>
                <th className="p-3">Alert Limit</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-3 font-mono text-xs">{item.id}</td>
                  <td className="p-3 font-medium">{item.partName}</td>
                  {/* ✅ Displays the exact string code calculated directly by Express server */}
                  <td className="p-3 font-mono text-xs font-bold text-gray-700">{item.sku}</td>
                  <td className="p-3">{item.category}</td>
                  <td className={`p-3 font-bold ${item.stockLevel <= item.lowStockAlert ? 'text-red-600' : 'text-green-600'}`}>
                    {item.stockLevel}
                  </td>
                  <td className="p-3 font-mono">  ₹ {item.retailPrice.toFixed(2)}</td>
                  <td className="p-3 text-gray-400">{item.lowStockAlert}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

    </main>
  );
}