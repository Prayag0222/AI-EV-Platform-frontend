'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

import { API_BASE } from '@/config/api';
import { Customer } from '@/app/dashboard/owner/types/customer';

import CustomerHeader from './components/CustomerHeader';
import CustomerStats from './components/CustomerStats'; 
import CustomerTable from './components/CustomerTable'; 
import CustomerMobileCard from './components/CustomerMobileCard'; 
import EmptyState from './components/EmptyState'; 
import CustomerDetailPanel from './components/CustomerDetailPanel'; 

import DeleteCustomerModal from '@/components/DeleteCustomerModal';
import EditCustomerModal from '@/components/EditCustomerModal';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');

  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

  const [customerToDelete, setCustomerToDelete] =
    useState<string | null>(null);

  const [customerToEdit, setCustomerToEdit] =
    useState<Customer | null>(null);

useEffect(() => {
  const controller = new AbortController();

  async function fetchCustomers() {
    try {
      const response = await fetch(
        `${API_BASE}/owner/getCustomer`,
        {
          credentials: 'include',
          signal: controller.signal,
        }
      );

      if (!response.ok) throw new Error();

      const data = await response.json();

      setCustomers(
        Array.isArray(data)
          ? data
          : data.customers ?? []
      );
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        toast.error('Unable to load customers');
        setError('Failed to load customers');
      }
    } finally {
      setLoading(false);
    }
  }

  fetchCustomers();

  return () => controller.abort();
}, []);

  const executeDelete = async () => {
    if (!customerToDelete) return;

    try {
      const response = await fetch(
        `${API_BASE}/owner/deleteCustomer/${customerToDelete}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      setCustomers((prev) =>
        prev.filter((c) => c.id !== customerToDelete)
      );

      if (selectedCustomer?.id === customerToDelete) {
        setSelectedCustomer(null);
      }

      toast.success('Customer deleted');
    } catch {
      toast.error('Failed to delete customer');
    } finally {
      setCustomerToDelete(null);
    }
  };

  const filteredCustomers = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    if (!keyword) return customers;

    return customers.filter(
      (customer) =>
        customer.name
          .toLowerCase()
          .includes(keyword) ||
        customer.phone
          .toLowerCase()
          .includes(keyword)
    );
  }, [customers, searchTerm]);

  const stats = useMemo(() => {
    const totalVehicles = customers.reduce(
      (sum, customer) =>
        sum + customer.vehicles.length,
      0
    );

    return {
      totalCustomers: customers.length,
      totalVehicles,
      averageVehicles:
        customers.length === 0
          ? '0'
          : (
              totalVehicles /
              customers.length
            ).toFixed(1),
      showing: filteredCustomers.length,
    };
  }, [customers, filteredCustomers]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-volt-secondary" />
          <p className="text-sm text-sec-text">
            Loading customers...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-volt-background">

        <CustomerHeader
          totalCustomers={customers.length}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <main className="mx-auto max-w-7xl px-4 py-5 md:px-8 md:py-10">

          <CustomerStats
            stats={stats}
            searchActive={!!searchTerm}
          />

          {error ? (
            <EmptyState
              title="Unable to load customers"
              description={error}
            />
          ) : filteredCustomers.length === 0 ? (
            <EmptyState
              title={
                searchTerm
                  ? 'No matching customers'
                  : 'No customers found'
              }
              description={
                searchTerm
                  ? `No customer matches "${searchTerm}".`
                  : 'Customers will appear here after they are added.'
              }
              showClear={!!searchTerm}
              onClear={() => setSearchTerm('')}
            />
          ) : (
            <>
              {/* Mobile */}

              <div className="space-y-4 md:hidden">
                {filteredCustomers.map((customer) => (
                  <CustomerMobileCard
                    key={customer.id}
                    customer={customer}
                    onSelect={setSelectedCustomer}
                    onEdit={setCustomerToEdit}
                    onDelete={setCustomerToDelete}
                  />
                ))}
              </div>

              {/* Desktop */}

              <div className="hidden md:block">
                <CustomerTable
                  customers={filteredCustomers}
                  totalCustomers={customers.length}
                  searchTerm={searchTerm}
                  onClearSearch={() =>
                    setSearchTerm('')
                  }
                  onSelect={setSelectedCustomer}
                  onEdit={setCustomerToEdit}
                  onDelete={setCustomerToDelete}
                />
              </div>
            </>
          )}
        </main>
      </div>

      {selectedCustomer && (
        <CustomerDetailPanel
          customer={selectedCustomer}
          onClose={() =>
            setSelectedCustomer(null)
          }
        />
      )}

      <DeleteCustomerModal
        customerId={customerToDelete}
        onClose={() =>
          setCustomerToDelete(null)
        }
        onConfirm={executeDelete}
      />

      <EditCustomerModal
        customer={customerToEdit}
        onClose={() =>
          setCustomerToEdit(null)
        }
        onUpdateSuccess={(updated) => {
          setCustomers((prev) =>
            prev.map((customer) =>
              customer.id === updated.id
                ? updated
                : customer
            )
          );

          if (
            selectedCustomer?.id === updated.id
          ) {
            setSelectedCustomer(updated);
          }

          toast.success(
            'Customer updated successfully'
          );
        }}
      />
    </>
  );
}