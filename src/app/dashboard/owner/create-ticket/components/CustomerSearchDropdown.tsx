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
  selectedCustomerId
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
        const response = await fetch('http://localhost:3000/api/owner/getCustomer');
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
      <label className="block gap-2 text-xxs flex itmes-center  font-sora font-bold  tracking-wider text-volt-muted mb-1.5">
      <User className='size-5'/> Customer Indentification 
      </label>

      {networkError && (
        <p className="text-xxs text-volt-alert mb-2 font-mono">{networkError}</p>
      )}



      <span className='text-xs font-medium text-gray-400 '> Search existing customer</span>
      {/* 💬 Text Input Tracker Box Bar Element */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-volt-muted text-black" size={16} />
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={query}
          onChange={(e) => handleTextChange(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
          className="w-full  pl-10 px-3 py-2.5 bg-volt-background border placeholder:font-bold border-volt-container text-volt-text placeholder:text-volt-muted text-xs font-medium rounded focus:outline-none focus:border-volt-secondary transition-all"
        />
      </div>

      {/* 📂 SUGGESTIONS PANEL ACCENT WINDOW */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto bg-volt-surface border border-volt-container rounded shadow-xl backdrop-blur-md divide-y divide-volt-container/10">
          
          {/* 👥 Loop and render matching custom list cards */}
          {filtered.map((customer) => (
            <button
              key={customer.id}
              type="button"
              onClick={() => {
                onSelectCustomer(customer);
                setQuery(`${customer.name} (${customer.phone})`);
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between text-left hover:bg-volt-secondary/10 transition-colors group cursor-pointer"
            >
              <span className="text-xs flex items-center gap-2 font-semibold text-volt-text group-hover:text-volt-secondary transition-colors">
                <User className='size-4'/>{customer.name}
              </span>
              <span className="text-xxs font-mono text-volt-muted mt-0.5 sm:mt-0">
                📞 {customer.phone} - <span className="italic font-hanken">{customer.vehicleModel}</span>
              </span>
            </button>
          ))}

          {/* 🆕 THE ESCAPE BUTTON: Fallback dynamic trigger to go custom inline */}
          <button
            key="fallback-add-btn"
            type="button"
            onClick={() => {
              onTriggerNewCustomerMode();
              setIsOpen(false);
            }}
            className="w-full px-4 py-3 text-left text-volt-secondary hover:bg-volt-secondary/5 text-xs hover:font-bold font-display font-semibold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer border-t border-volt-container/20"
          >
            <SquarePlus className='size-4'/> Add New Customer
          </button>
        </div>
      )}
    </div>
  );
}