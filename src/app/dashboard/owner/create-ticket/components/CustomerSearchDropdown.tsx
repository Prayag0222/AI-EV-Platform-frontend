'use client';

import React, { useState, useEffect, useRef } from 'react';
import { User, Search ,SquarePlus} from 'lucide-react';

// 📋 SECTION 1: THE TYPESCRIPT INTERFACE CONTRACTS
export interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  vehicleModel: string;
  email: string | null;
  address: string | null;
  vin?:string;
}

interface SearchDropdownProps {
  onSelectCustomer: (customer: CustomerRecord) => void;
  onTriggerNewCustomerMode: () => void;
  selectedCustomerId: string;
}

// 🏗️ SECTION 2: THE MAIN RENDER COMPONENT FUNCTION
export default function CustomerSearchDropdown({
  onSelectCustomer,
  onTriggerNewCustomerMode,
}: SearchDropdownProps) {
  
  // A. Internal State Containers (Memory Boxes)
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [query, setQuery] = useState<string>('');
  const [filtered, setFiltered] = useState<CustomerRecord[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [networkError, setNetworkError] = useState<string | null>(null);
  
  // B. The Physical Window DOM Pointer Node
  const dropdownRef = useRef<HTMLDivElement>(null);

  // C. Lifecycle Trigger 1: Silent Background Data Cache Pull on Mount
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/owner/getCustomer',{
          credentials:"include"
        });
        if (!response.ok) throw new Error('API failed to return ledger rows.');
        
        const data = await response.json();
        const list = Array.isArray(data) ? data : (data.customers || []);
        
        setCustomers(list);
      } catch (err) {
        console.error('Failed to pre-load customer registry database lines:', err);
        setNetworkError('Failed to sync customer directory indexes.');
      }
    };
    loadCustomers();
  }, []);

  // D. Lifecycle Trigger 2: Detecting Clicks Outside to Shut the Dropdown Menu Window
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // E. Logic Engine: The Real-Time Keystroke Filter Machine
  const handleTextChange = (text: string) => {
    setQuery(text);
    
    if (!text.trim()) {
      setFiltered([]);
      setIsOpen(false);
      return;
    }

    const cleanQuery = text.toLowerCase();
    const matches = customers.filter((c) =>
      c.name.toLowerCase().includes(cleanQuery) || c.phone.includes(cleanQuery)
    );

    setFiltered(matches);
    setIsOpen(true);
  };

  // 🎨 SECTION 3: THE MARKUP RENDER INTERFACE
 return (
  <div ref={dropdownRef} className="relative w-full">

    {/* Header */}
    <div className="mb-3 flex items-start justify-between">
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-volt-primary">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-volt-secondary/10">
            <User className="h-4 w-4 text-volt-secondary" />
          </div>

          <div>
            <p className="font-display text-sm font-semibold">
              Customer
            </p>

            <p className="text-xs text-volt-muted">
              Search an existing customer or register a new one
            </p>
          </div>
        </label>

        {networkError && (
          <p className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
            {networkError}
          </p>
        )}
      </div>

      <span className="rounded-full bg-volt-secondary/10 px-3 py-1 text-[11px] font-semibold text-volt-secondary">
        {customers.length} Customers
      </span>
    </div>

    {/* Search */}
    <div className="relative">

      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-volt-muted"
        size={18}
      />

      <input
        type="text"
        value={query}
        onChange={(e) => handleTextChange(e.target.value)}
        onFocus={() => query.trim() && setIsOpen(true)}
        placeholder="Search customer by name or phone..."
        className="
          h-12
          w-full
          rounded-2xl
          border
          border-volt-container
          bg-volt-surface
          pl-12
          pr-4
          text-sm
          font-medium
          text-volt-text
          placeholder:text-volt-muted
          outline-none
          transition-all
          duration-200
          focus:border-volt-secondary
          focus:ring-4
          focus:ring-volt-secondary/10
        "
      />
    </div>

    {/* Dropdown */}
    {isOpen && (
      <div
        className="
          absolute
          z-50
          mt-3
          w-full
          overflow-hidden
          rounded-2xl
          border
          border-volt-container
          bg-volt-surface
          shadow-2xl
        "
      >

        <div className="max-h-80 overflow-y-auto">

          {filtered.length > 0 ? (

            filtered.map((customer) => (
              <button
                key={customer.id}
                type="button"
                onClick={() => {
                  onSelectCustomer(customer);
                  setQuery(`${customer.name} (${customer.phone})`);
                  setIsOpen(false);
                }}
                className="
                  group
                  flex
                  w-full
                  items-start
                  gap-3
                  border-b
                  border-volt-container/40
                  px-4
                  py-4
                  text-left
                  transition-all
                  hover:bg-volt-background
                "
              >

                <div
                  className="
                    flex
                    h-11
                    w-11
                    flex-shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-volt-secondary/10
                    transition-colors
                    group-hover:bg-volt-secondary
                  "
                >
                  <User className="h-5 w-5 text-volt-secondary group-hover:text-white" />
                </div>

                <div className="min-w-0 flex-1">

                  <div className="flex items-center justify-between">

                    <h4 className="truncate text-sm font-semibold text-volt-text">
                      {customer.name}
                    </h4>

                    <span className="rounded-full bg-volt-background px-2 py-1 text-[10px] font-medium text-volt-muted">
                      Existing
                    </span>

                  </div>

                  <p className="mt-1 text-xs text-volt-muted">
                    {customer.phone}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2">

                    <span className="rounded-full bg-volt-background px-2 py-1 text-[11px] text-volt-secondary">
                      {customer.vehicleModel}
                    </span>

                    {customer.vin && (
                      <span className="rounded-full bg-volt-background px-2 py-1 text-[11px] text-volt-muted">
                        VIN • {customer.vin}
                      </span>
                    )}

                  </div>

                </div>

              </button>
            ))

          ) : (            <div className="flex flex-col items-center justify-center px-6 py-10 text-center">

              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-volt-background">
                <Search className="h-6 w-6 text-volt-muted" />
              </div>

              <h3 className="text-sm font-semibold text-volt-text">
                No customer found
              </h3>

              <p className="mt-1 max-w-xs text-xs leading-5 text-volt-muted">
                We couldn&apos;t find a customer matching your search.
                Register a new customer to continue creating the repair ticket.
              </p>

            </div>
          )}

        </div>

        {/* Divider */}
        <div className="border-t border-volt-container/60" />

        {/* Footer CTA */}
        <div className="p-3">

          <button
            type="button"
            onClick={() => {
              onTriggerNewCustomerMode();
              setIsOpen(false);
            }}
            className="
              group
              flex
              h-12
              w-full
              items-center
              justify-center
              gap-2
              rounded-2xl
              bg-volt-secondary
              px-4
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition-all
              hover:bg-volt-secondary/90
              hover:shadow-md
              active:scale-[0.99]
            "
          >
            <SquarePlus
              className="
                h-5
                w-5
                transition-transform
                duration-200
                group-hover:rotate-90
              "
            />

            Register New Customer
          </button>

        </div>

      </div>
    )}

  </div>
);
}