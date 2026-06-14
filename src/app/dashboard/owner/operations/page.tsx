'use client';

import React, { useState, useEffect } from 'react';
import OperationJobCard from './components/OperationJobCard';

interface CustomerInfo {
  name: string;
  phone: string;
}

interface Technician {
  id: string;
  fullName: string;
  email: string;          
  phone: string;
  employeeId: string;          
  specialization: string;
  status: string;      
  experienceYears: string;
  address: string | null;
}

interface RepairTicket {
  id: number;
  vehicleModel: string;
  issueCategory: string;
  description: string;
  technicianNotes: string | null;
  status: string; 
  customer: CustomerInfo;
  technicianId?: string | null;
  createdAt: string;
  updatedAt?: string;
  technician?: Technician | null; 
}

export default function OperationsDeckPage() {
  const [tickets, setTickets] = useState<RepairTicket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<RepairTicket | null>(null);

  useEffect(() => {
    const initializeDeckLog = async () => {
      try {
        setErrorMessage(null);
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

  // ⚡ THE SYSTEM FIX: State-driven synchronization loop function
  const handleTicketDeleted = (deletedId: number) => {
    // 1. Recalculate State: filter out the old matching ID instantly
    setTickets((prevTickets) => prevTickets.filter((ticket) => ticket.id !== deletedId));
    
    // 2. Modal Safety Check: If the user is currently viewing this exact modal layout, dismiss it gracefully
    if (selectedTicket?.id === deletedId) {
      setSelectedTicket(null);
    }
  };

  if (loading) return <div className="p-10 text-xs font-mono text-[#75777d] bg-[#FAFAF8] min-h-screen">Synchronizing VoltOps Executive Viewport Matrix...</div>;
  if (errorMessage) return <div className="p-10 text-xs font-mono text-volt-terracotta bg-[#FAFAF8] min-h-screen">⚠️ {errorMessage}</div>;

  return (
    <main className="flex-1 bg-[#FAFAF8] p-6 lg:p-10 w-full min-h-screen relative">
      
      {/* Top Header Text Bracket Frame */}
      <div className="mb-10 max-w-360 mx-auto">
        <h2 className="text-4xl font-bold tracking-tight text-[#091426] mb-2 font-sans">
          Operations
        </h2>
        <p className="text-lg text-[#45474c] font-sans font-normal">
          Live status of all vehicles currently in operation.
        </p>
      </div>

      {/* THE RESPONSIVE VEHICLE CONTAINER GRID */}
      <div className="max-w-360 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tickets.length === 0 ? (
          <div className="col-span-full p-12 border border-dashed border-[#c5c6cd] bg-white text-center text-xs font-medium text-[#75777d]" style={{ borderRadius: '0.75rem' }}>
            Zero active asset matrices registered inside shop tracking logs.
          </div>
        ) : (
          tickets.map((ticketItem) => (
            <OperationJobCard
              key={ticketItem.id}
              ticket={ticketItem}
              onOpenDetails={(ticket) => setSelectedTicket(ticket)}
              // ⚡ CONNECTED: Links the parent filter function into the card execution engine prop slot
              onDeleteSuccess={handleTicketDeleted} 
            />
          ))
        )}
      </div>

      {/* 🏛️ THE CENTRALIZED SINGLE MODAL CONTAINER */}
      {selectedTicket && (
        <div 
          className="fixed inset-0 bg-[#091426]/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all"
          onClick={() => setSelectedTicket(null)} 
        >
          <div 
            className="bg-white border border-[#c5c6cd] rounded-2xl max-w-lg w-full shadow-2xl p-6 relative max-h-[85vh] overflow-y-auto flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()} 
          >
            {/* Header Title Section */}
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <div>
                <span className="text-2xl font-black text-[#091426] font-sans">
                  EV-{selectedTicket.id.toString().padStart(4, '0')}
                </span>
                <span className="text-xs ml-2 text-gray-400 font-mono">Detailed Operational View</span>
              </div>
              <button 
                onClick={() => setSelectedTicket(null)}
                className="text-gray-400 hover:text-gray-900 transition-colors text-xl font-bold font-mono"
              >
                ✕
              </button>
            </div>

            {/* Core Metadata Specifications Parameters list Layout */}
            <div className="space-y-4 text-sm font-sans text-gray-700">
              <p><strong className="text-gray-500 uppercase text-xs">Customer Name:</strong> <span className="text-[#091426] font-bold">{selectedTicket.customer?.name || 'Walk-In Profile'}</span></p>
              <p><strong className="text-gray-500 uppercase text-xs">Contact Phone:</strong> {selectedTicket.customer?.phone || 'N/A'}</p>
              <p><strong className="text-gray-500 uppercase text-xs">Scooter Model:</strong> <span className="text-blue-600 font-semibold">{selectedTicket.vehicleModel}</span></p>
              <p><strong className="text-gray-500 uppercase text-xs">Primary Fault Flag:</strong> <span className="underline decoration-red-400 font-bold">{selectedTicket.issueCategory}</span></p>
              
              <div className="bg-slate-50 border border-gray-200 p-3 rounded-xl">
                <span className="block text-gray-400 uppercase text-[10px] font-bold mb-1">Diagnostic Intake Symptoms</span>
                <p className="italic text-gray-700 font-medium">`{selectedTicket.description}`</p>
              </div>

              <div className="bg-[#f5f3f4] p-3 rounded-xl border border-gray-200 font-mono text-xs text-[#45474c]">
                <span className="block text-gray-500 uppercase text-[10px] font-bold mb-1 font-sans">Progress Notes</span>
                <p>{selectedTicket.technicianNotes || 'Awaiting mechanic verification notes logs.'}</p>
              </div>

              <p><strong className="text-gray-500 uppercase text-xs">Current Workshop Status:</strong> <span className="ml-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 uppercase">{selectedTicket.status}</span></p>
              
              <div className="border-t pt-3 flex flex-col text-xs space-y-1 font-mono text-gray-400">
                <p><strong>Assigned Staff:</strong> {selectedTicket.technician ? `${selectedTicket.technician.fullName} (${selectedTicket.technician.employeeId})` : 'Unassigned Pool'}</p>
                <p><strong>Database Log Entry:</strong> {new Date(selectedTicket.createdAt).toLocaleString()}</p>
              </div>
            </div>

            <div className='flex flex-col gap-3 bg-red-100 p-4 rounded-lg mt-5'>
              <button 
                onClick={() => setSelectedTicket(null)}
                className="w-full py-2.5 bg-[#091426] text-white font-bold text-xs uppercase tracking-wider rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
              >
                Dismiss Detailed Log View
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}