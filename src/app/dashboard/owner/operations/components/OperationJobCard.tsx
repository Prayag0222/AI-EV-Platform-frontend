'use client';

import React from 'react';

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

interface JobCardProps {
  ticket: RepairTicket;
  onOpenDetails: (ticket: RepairTicket) => void; 
  // ⚡ SYSTEM ADDTION: Callback prop to notify the parent state loop
  onDeleteSuccess: (ticketId: number) => void; 
}

export default function OperationJobCard({ ticket, onOpenDetails, onDeleteSuccess }: JobCardProps) {

  const getStatusBadgeStyles = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'ready':
        return 'bg-[#9cf2e8] text-[#00504a]'; 
      case 'in service':
      case 'working':
        return 'bg-[#99efe5] text-[#006f67]'; 
      case 'parts ordered':
        return 'bg-[#ffdad6] text-[#93000a]'; 
      case 'waiting':
      default:
        return 'bg-[#fadfb8] text-[#564427]'; 
    }
  };

  const displayTime = ticket.updatedAt 
    ? new Date(ticket.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '10 mins ago';

  const deleteTicketHandler = async (ticketId: number) => {
    const confirmDelete = confirm('Are you sure you want to remove this ticket from the system?');
    if (!confirmDelete) return;
    
    const id = ticketId;

    try {
      const response = await fetch(`http://Localhost:3000/api/owner/deleteTicket/${id}`, {
        method: "DELETE",
      });

      const responseData = await response.json();

      if (!response.ok) {
        alert(responseData.message || 'Could not delete ticket.');
        return;
      }
      
      
      // ⚡ CRITICAL FIX: Trigger the callback function to update the parent state instantly!
      onDeleteSuccess(id);

    } catch (error) {
      console.log("error in deleting ticket", error);
    }
  };

  return (
    <div className="bg-white border border-[#c5c6cd] rounded-xl p-6 ambient-shadow hover-lift flex flex-col h-full transition-all duration-200">
      
      {/* TIER 1 LINE HEADER: Token ID Code vs Customer Name */}
      <div className="flex justify-between items-center mb-2">
        <span className="font-sans text-2xl font-bold text-[#091426]">
          EV-{ticket.id.toString().padStart(4, '0')}
        </span>
        <span className="font-sans text-base font-semibold text-[#45474c]">
          {ticket.customer?.name || 'Walk-In Profile'}
        </span>
      </div>

      {/* Vehicle Model Title */}
      <div className="font-sans text-xs text-[#75777d] tracking-wider mb-4 uppercase font-bold">
        {ticket.vehicleModel}
      </div>

      {/* Primary fault preview content */}
      <div className="font-sans text-sm text-[#1b1b1d] mb-4 flex-1 font-bold">
        {ticket.issueCategory}
      </div>

      {/* Status Badge Tag */}
      <div className="mb-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-sans font-semibold tracking-wide ${getStatusBadgeStyles(ticket.status)}`}>
          {ticket.status || 'Waiting'}
        </span>
      </div>

      {/* INTERACTIVE ACTIONS FLOOR */}
      <div className="pt-1 flex justify-between">
        <button
          onClick={() => onOpenDetails(ticket)} 
          className="bg-gray-200 rounded-xl px-4 py-1 text-xs font-bold tracking-wide hover:bg-[#091426] hover:text-white transition-all cursor-pointer"
        >
          Full Info View ➔
        </button>
        <button 
          onClick={() => deleteTicketHandler(ticket.id)}
          className='bg-red-600 text-xs p-1 px-3 text-white font-semibold rounded-md mx-auto active:scale-100 cursor-pointer hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg'
        >
          Delete 
        </button>
      </div>

      {/* TIER 2 FOOTER METRICS */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#e4e2e3]">
        <div className="flex flex-col">
          <span className="font-sans text-[10px] uppercase font-bold text-[#75777d] mb-0.5">Technician</span>
          <span className="font-sans text-xs font-bold text-[#091426]">
            {ticket.technician ? ticket.technician.fullName : 'Unassigned Pool'}
          </span>
        </div>

        <div className="flex flex-col text-right">
          <span className="font-sans text-[10px] uppercase font-bold text-[#75777d]">Activity</span>
          <span className="font-sans text-xs font-bold text-[#091426] mt-0.5">
            {displayTime}
          </span>
        </div>
      </div>

    </div>
  );
}