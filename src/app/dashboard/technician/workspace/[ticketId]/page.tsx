'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, Wrench, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import TelemetryHeader from './components/TelemetryHeader';
import StatusSwiper from './components/StatusSwiper';
import { useTicket } from './hooks/useTicket';
import VoiceNotesModule from './components/VoiceNotesModule';




export default function MobileWorkspacePage() {
  const router = useRouter();
const { ticketId } = useParams();
 const { ticketData, isLoading, fetchTicket, updateStatus } = useTicket(ticketId);

 useEffect(() => { fetchTicket(); }, []);
 

if (isLoading || !ticketData) return <div>Loading...</div>;

 

  return (
    // 📱 MOBILE FIRST WRAPPER: Limits width on big screens to look like an app
    <div className="min-h-screen bg-slate-50 font-sans mx-auto max-w-md shadow-2xl relative pb-24">
      
      {/* GLOBAL APP HEADER */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <button 
          onClick={() => router.push('/dashboard/technician')}
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-600 transition"
        >
          <ChevronLeft className="size-6" />
        </button>
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Active Workspace</p>
          <h1 className="text-lg font-display font-bold text-slate-900 leading-tight">
            EV-{ticketData.id.toString().padStart(4, '0')}
          </h1>
        </div>
        <div className="w-10" /> {/* Spacer to perfectly center the title */}
      </header>

      {/* MAIN CONTENT SCROLL ZONE */}
      <main className="p-4 space-y-6">
        
    <TelemetryHeader
    vehicleModel={ticketData.vehicleModel}
    customerName={ticketData.customer.name}/>
    <StatusSwiper currentStatus={ticketData.status} onStatusChange={updateStatus} />

    <VoiceNotesModule 
            ticketId={ticketId} 
            onNoteAdded={fetchTicket} // This refreshes the whole page data when a note is saved!
        />

      </main>

    </div>
  );
}