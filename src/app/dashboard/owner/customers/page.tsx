'use client';

import React, { useState, useEffect } from 'react';
import { Users, Loader2, UserRoundPen, Trash2, Search } from 'lucide-react';
import DeleteCustomerModal from '@/components/DeleteCustomerModal';
import EditCustomerModal from '@/components/EditCustomerModal';
import CustomerDetailPanel from './components/CustomerDetailPanel';
import { API_BASE } from '@/config/api';
import { Customer } from '@/app/dashboard/owner/types/customer';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${API_BASE}/owner/getCustomer`);
        const data = await res.json();
        setCustomers(Array.isArray(data) ? data : data.customers || []);
      } catch (err) {
        console.error("Fetch failed", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const executeDelete = async () => {
    if (!customerToDelete) return;
    const res = await fetch(`${API_BASE}/owner/deleteCustomer/${customerToDelete}`, { method: 'DELETE' });
    if (res.ok) {
      setCustomers(prev => prev.filter(c => c.id !== customerToDelete));
    }
    setCustomerToDelete(null);
  };

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-volt-primary flex items-center gap-2">
            <Users className="h-6 w-6 text-volt-secondary" /> Customer Directory
          </h1>
          <p className="text-sm text-gray-500 mt-1">A connected view of all your customers</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 border rounded-lg px-3 py-2">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="outline-none text-sm bg-transparent"
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-10">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin h-10 w-10 text-volt-primary" />
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="bg-white border rounded-xl shadow-sm p-20 text-center text-gray-400">
            No customers found.
          </div>
        ) : (
          <div className="bg-white border rounded-xl shadow-lg overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-100 text-xs uppercase text-gray-500">
                <tr>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Vehicles</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredCustomers.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => setSelectedCustomer(c)}
                  >
                    <td className="p-4 font-semibold text-volt-primary">{c.name}</td>
                    <td className="p-4 text-sm text-gray-600">{c.phone}</td>
                    <td className="p-4 text-sm text-gray-500">{c.vehicles.length} Registered</td>
                    <td className="p-4 flex justify-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); setCustomerToEdit(c); }}
                        className="p-2 hover:bg-blue-50 rounded text-blue-600"
                      >
                        <UserRoundPen className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setCustomerToDelete(c.id); }}
                        className="p-2 hover:bg-red-50 rounded text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Slide-out Panel */}
      {selectedCustomer && (
        <CustomerDetailPanel
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}

      <DeleteCustomerModal
        customerId={customerToDelete}
        onClose={() => setCustomerToDelete(null)}
        onConfirm={executeDelete}
      />
      <EditCustomerModal
        customer={customerToEdit}
        onClose={() => setCustomerToEdit(null)}
        onUpdateSuccess={(updated) =>
          setCustomers(p => p.map(c => c.id === updated.id ? updated : c))
        }
      />
    </div>
  );
}
