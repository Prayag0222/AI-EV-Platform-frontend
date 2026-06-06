'use client';

import React, { useState, useEffect } from 'react';
import OperationJobCard from './components/OperationJobCard';

interface CustomerInfo {
  name: string;
  phone: string;
}

interface RepairTicket {
  id: number;
  vehicleModel: string;
  issueCategory: string;
  description: string;
  technicianNotes: string | null;
  status: string; 
  customer: CustomerInfo;
}

export default function OperationsDeckPage() {
  const [tickets, setTickets] = useState<RepairTicket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const initializeDeckLog = async () => {
      try {
        setErrorMessage(null);
        // Reading smoothly from your current running live database server running on port 3000
        const response = await fetch('http://127.0.0.1:3000/api/operation/tickets');
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.error || 'Failed to downlink operations data streams.');
        
        setTickets(data.tickets || []);
      } catch (err) {
        console.error('Operations UI connection drop:', err);
        setErrorMessage('Could not establish secure network links with the active Express ledger engine.');
      } finally {
        setLoading(false);
      }
    };

    initializeDeckLog();
  }, []);

  if (loading) return <main className="p-10 text-xs font-mono text-[#75777d] bg-[#FAFAF8] min-h-screen">Synchronizing VoltOps Executive Viewport Matrix...</main>;
  if (errorMessage) return <main className="p-10 text-xs font-mono text-[#ba1a1a] bg-[#FAFAF8] min-h-screen">⚠️ {errorMessage}</main>;

  return (
    /* 🏛️ Pure bone white canvas styling layered with strict maximum responsive column breakpoints[cite: 2] */
    <main className="flex-1 bg-[#FAFAF8] p-6 lg:p-10 w-full min-h-screen">
      
      {/* Top Header Text Bracket Frame[cite: 2] */}
      <div className="mb-10 max-w-[1440px] mx-auto">
        <h2 className="text-4xl font-bold tracking-tight text-[#091426] mb-2 font-sans">
          Operations
        </h2>
        <p className="text-lg text-[#45474c] font-sans font-normal">
          Live status of all vehicles currently in operation.
        </p>
      </div>

      {/* 📋 THE FIXED RESPONSIVE VEHICLE CONTAINER GRID VIEWPORT matching screen_2.png[cite: 2] */}
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tickets.length === 0 ? (
          <div className="col-span-full p-12 border border-dashed border-[#c5c6cd] bg-white text-center text-xs font-medium text-[#75777d]" style={{ borderRadius: '0.75rem' }}>
            Zero active asset matrices registered inside shop tracking logs.
          </div>
        ) : (
          tickets.map((ticketItem) => (
            <OperationJobCard
              key={ticketItem.id}
              ticket={ticketItem}
            />
          ))
        )}
      </div>

    </main>
  );
}