'use client';

import React from 'react';

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
  status: string; // e.g., "Waiting", "In Service", "Ready", "Parts Ordered"
  customer: CustomerInfo;
}

interface JobCardProps {
  ticket: RepairTicket;
}

export default function OperationJobCard({ ticket }: JobCardProps) {
  
  // 🎨 Exact status badge mapping matching the colors specified in the template script token definitions
  const getStatusBadgeStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ready':
        return 'bg-[#9cf2e8] text-[#00504a]'; // bg-secondary-fixed text-on-secondary-fixed-variant[cite: 2]
      case 'in service':
      case 'working':
        return 'bg-[#99efe5] text-[#006f67]'; // bg-secondary-container text-on-secondary-container[cite: 2]
      case 'parts ordered':
        return 'bg-[#ffdad6] text-[#93000a]'; // bg-error-container text-on-error-container[cite: 2]
      case 'waiting':
      default:
        return 'bg-[#fadfb8] text-[#564427]'; // bg-tertiary-fixed text-on-tertiary-fixed-variant[cite: 2]
    }
  };

  // Static fallback metadata arrays to populate layout rows cleanly while database schemas are pending
  const assignedTechMock = ticket.id % 2 === 0 ? 'David R.' : ticket.id % 3 === 0 ? 'Alex W.' : 'Unassigned';
  const mockLastUpdated = ticket.id % 2 === 0 ? '1 hr ago' : ticket.id % 3 === 0 ? '2 hrs ago' : '10 mins ago';

  return (
    /* 🏛️ Pure white surface layout pop against warm background canvas with exact Level 1 elevation properties[cite: 2] */
    <div className="bg-white border border-[#c5c6cd] rounded-xl p-6 ambient-shadow hover-lift flex flex-col h-full transition-all duration-200">
      
      {/* TIER 1 LINE HEADER: Token ID Code vs Pinned Customer Name Handle[cite: 2] */}
      <div className="flex justify-between items-center mb-2">
        <span className="font-sans text-2xl font-bold text-[#091426]">
          EV-{ticket.id.toString().padStart(4, '0')}
        </span>
        <span className="font-sans text-16px text-[#45474c]">
          {ticket.customer?.name || 'Walk-In Profile'}
        </span>
      </div>

      {/* Vehicle Model Title label typography frame[cite: 2] */}
      <div className="font-sans text-14px text-[#75777d] tracking-wider mb-4">
        {ticket.vehicleModel}
      </div>

      {/* Primary diagnostic fault string block space[cite: 2] */}
      <div className="font-sans text-16px text-[#1b1b1d] mb-4 flex-1 leading-relaxed">
        {ticket.description}
      </div>

      {/* Pale Tonal Status Tag area[cite: 2] */}
      <div className="mb-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-sans font-medium tracking-wide ${getStatusBadgeStyles(ticket.status)}`}>
          {ticket.status || 'Waiting'}
        </span>
      </div>

      {/* Activity Trace History description content area box container[cite: 2] */}
      <div className="bg-[#f5f3f4] rounded-lg p-3 mb-4 text-xs font-sans text-[#45474c] leading-relaxed">
        {ticket.technicianNotes || 'Vehicle arrived at depot. Awaiting diagnostic loop verification check.'}
      </div>

      {/* TIER 2 FOOTER METRICS: Two-column clean reporting table matrix view[cite: 2] */}
      <div className="flex justify-between items-center mt-auto pt-4 border-t border-[#e4e2e3]">
        
        {/* Worker Assignment metrics section[cite: 2] */}
        <div className="flex flex-col">
          <span className="font-sans text-xs text-[#75777d]">Assigned Technician</span>
          <span className="font-sans text-16px font-medium text-[#091426] mt-0.5">
            {assignedTechMock}
          </span>
        </div>

        {/* Temporal system update logging window tracking metrics[cite: 2] */}
        <div className="flex flex-col text-right">
          <span className="font-sans text-xs text-[#75777d]">Last Updated</span>
          <span className="font-sans text-16px font-medium text-[#091426] mt-0.5">
            {mockLastUpdated}
          </span>
        </div>

      </div>

    </div>
  );
}