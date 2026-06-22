'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from "framer-motion";
import { ShieldAlert, AlertTriangle, CalendarDays, Check, FileText, PackageOpen, Sparkles, Wrench, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

// Component Imports
import MetricCard from './components/MetricCard';
import RepairTaskRow from './components/RepairTaskRow';
import IntelligenceBrief from './components/IntelligenceBrief';
import BriefingCard from './components/BriefingCard';

interface CustomerInfo { name: string; phone: string; }
interface RepairTicket {
  id: number;
  vehicleModel: string;
  issueCategory: string;
  description: string;
  technicianNotes: string | null;
  status: string; 
  customer: CustomerInfo;
  bay: string;
}

export default function TechnicianWorkspacePage() {
  const [repairs, setRepairs] = useState<RepairTicket[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); 
  const [expanded, setExpanded] = useState<number | null>(1);
  const [selectedTicket, setSelectedTicket] = useState<RepairTicket | null>(null);
  const [notice, setNotice] = useState<string>("Calibration report ready for S1 Pro");
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [activeUser, setActiveUser] = useState<{ id: string; name: string; role: string } | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>();

  const router = useRouter();

  // 🛡️ SAFE VISIBLE QUEUE MEMOIZATON
  const visibleRepairs = useMemo(() => {
    return repairs.filter(Boolean);
  }, [repairs]);

  // ⚡ LIVE COMPUTED SCHEMA STATISTICS
  const totalJobsCount = repairs.length;
  const inServiceCount = repairs.filter(r => r?.status === "In Service").length;
  const partsOrderedCount = repairs.filter(r => r?.status === "Parts Ordered").length;
  const readyCount = repairs.filter(r => r?.status === "Ready").length;

  useEffect(() => {
    const initializeWorkspace = async () => {
      try {
        const profileResponse = await fetch("http://localhost:3000/api/auth/me", {
          method: "GET",
          credentials: "include"
        });
        const profileData = await profileResponse.json();

        if (!profileData.success) {
          setNotice("Your login session has expired. Please sign back in.");
          setIsOpen(true);
          setIsLoading(false);
          return;
        }

        const loggedInUser = profileData.user;
        setActiveUser(loggedInUser);

        const ticketsResponse = await fetch(`http://localhost:3000/api/technician/dashboard?technicianId=${loggedInUser.id}`);
        const ticketsData = await ticketsResponse.json();
      
        if (ticketsData.success) {
          setRepairs(ticketsData.tickets);
        }

      } catch (error) {
        console.error("Workspace initialization failed:", error);
        setNotice("Network fatal connection dropped. Server offline.");
      } finally {
        setIsLoading(false);
      }
    };
    initializeWorkspace();
  }, []);

  // UPDATE REPAIR TICKET WORKBENCH STATUS (MANUAL OVERRIDE ROUTER)
  const advanceRepair = async (ticketId: number, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/technician/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (data.success) {
        setRepairs(prevRepairs =>
          prevRepairs.map(ticket =>
            ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
          )
        );
      } else {
        console.error("Server validation error:", data.message);
      }
    } catch (error) {
      console.error("Network sync failure updating ticket status:", error);
    }
  };

  // SAVE WORKBENCH PROGRESS LOGS TO THE DATABASE
  const saveTechnicianNotes = async (ticketId: number, notes: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/technician/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ technicianNotes: notes })
      });

      const data = await response.json();

      if (data.success) {
        setNotice(`Workbench progress logs safely stored in PostgreSQL database.`);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setNotice("Failed to save log changes to the database server.");
      }
    } catch (error) {
      console.error("Failed to commit notes to server:", error);
      setNotice("Connection error: Could not sync progress logs.");
    }
  };

  // Loading animation while authenticating
  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#F9F6F1] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-center justify-center"
        >
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="mb-8">
            <div className="h-16 w-16 rounded-full border-4 border-slate-200 border-t-emerald-600 shadow-lg" />
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-2xl font-bold text-primary-text mb-3">
            Authenticating...
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-sm text-muted-foreground">
            Verifying your credentials and loading workspace
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    // ⚡ CLEAN WRAPPER: No more redundant sidebars or ghost grid columns! 
    // The background color is now fully inherited from layout.tsx
    <div className="mx-auto max-w-[1480px] px-5 pb-14 pt-8 md:px-8 md:pt-11 lg:px-10 animate-fade-in">
      
      <section className="mb-10 grid gap-6 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Thursday · June 11</p>
          <h1 className="max-w-3xl font-display text-4xl text-primary-text font-semibold leading-[1.05] tracking-[-0.055em] md:text-5xl lg:text-[3.5rem]">
            Hello, {activeUser?.name || 'Technician'}.<br />
            <span className="text-sec-text">Repairs need your attention.</span>
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="h-11 rounded-xl bg-card px-4"><FileText />Logs</Button>
          <Button className="h-11 rounded-xl px-5 bg-[#0C5C3C] shadow-none hover:bg-[#0C5C3C]/90 text-white"><Sparkles />Diagnosis</Button>
        </div>
      </section>

      {notice && (
        <div className="mb-7 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-2xl border border-success/20 bg-emerald-50 px-4 py-3 text-sm">
          <div className="flex min-w-0 items-center gap-3">
            <Check className="size-4 shrink-0 text-emerald-600" />
            <span className='text-gray-700'><strong className='text-primary-text'>New Update:</strong> {notice}</span>
          </div>
          <Button variant="ghost" size="icon" className="size-8" onClick={() => setNotice("")}><X className="size-4" /></Button>
        </div>
      )}

      {/* METRIC SUMMARIES */}
      <section className="mb-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total Assigned" value={totalJobsCount.toString()} detail="Active allocations" icon={Wrench} />
        <MetricCard label="In Service" value={inServiceCount.toString()} detail="Active benchmark repairs" icon={AlertTriangle} tone="warning" />
        <MetricCard label="Awaiting Parts" value={partsOrderedCount.toString()} detail="Logistics supply block" icon={PackageOpen} tone="critical" />
        <MetricCard label="Ready / Completed" value={readyCount.toString()} detail="Fully resolved systems" icon={Check} tone="success" />
      </section>

      {/* MAIN INTERACTION SPLIT */}
      <div className="grid items-start gap-7 xl:grid-cols-[minmax(0,1fr)_330px]">
        <section className="min-w-0">
          <div className="mb-5 flex flex-col gap-1">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Work queue</p>
            <h2 className="font-display text-gray-800 text-2xl font-semibold tracking-[-0.04em]">Assigned repairs</h2>
          </div>

          <div className="space-y-3">
            {visibleRepairs.map((repair) => (
              <RepairTaskRow 
                key={repair.id} 
                repair={repair} 
                expanded={expanded === repair.id} 
                onExpand={() => setExpanded(expanded === repair.id ? null : repair.id)} 
                onAdvance={(newStatus) => advanceRepair(repair.id, newStatus)}
                onOpenDetails={() => setSelectedTicket(repair)}
              />
            ))}
          </div>
        </section>

        {/* TIMELINE SIDEBAR */}
        <aside className="space-y-4">
          <IntelligenceBrief />
          <BriefingCard icon={CalendarDays} title="Today's schedule" action="Open calendar">
            <div className="grid grid-cols-[42px_10px_1fr] gap-2 text-xs">
              <span className="text-muted-foreground">10:30</span>
              <span className="mt-1.5 size-2 rounded-full bg-success ring-4 ring-success-soft" />
              <div><p className="font-semibold text-primary-text">S1 Run</p><p className="text-[11px] text-muted-foreground">Bay 04</p></div>
            </div>
          </BriefingCard>
        </aside>
      </div>

      {/* WORKBENCH INTERFACE MODAL POPUP */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200" onClick={() => setSelectedTicket(null)}>
          <div className="bg-white border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[85vh] overflow-y-auto space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-display text-xl text-primary-text font-bold">EV-{selectedTicket.id.toString().padStart(4, '0')} Workspace</h3>
              <button onClick={() => setSelectedTicket(null)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            
            <div className="space-y-3 text-sm text-gray-700">
              <p><strong className='text-black'>Model:</strong> {selectedTicket.vehicleModel}</p>
              <p><strong className='text-black'>Customer:</strong> {selectedTicket.customer.name}</p>
              <p><strong className='text-black'>Reported Issue:</strong> {selectedTicket.issueCategory}</p>

              <div className="space-y-2 mt-4">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Workbench Progress Logs</label>
                <textarea 
                  value={selectedTicket.technicianNotes || ""} 
                  onChange={(e) => {
                    const txt = e.target.value;
                    if (saveSuccess) setSaveSuccess(false);
                    setSelectedTicket(p => p ? { ...p, technicianNotes: txt } : null);
                    setRepairs(items => items.map(i => i.id === selectedTicket.id ? { ...i, technicianNotes: txt } : i));
                  }}
                  className="w-full bg-slate-50 border border-border/60 p-3 rounded-xl text-xs font-mono focus:outline-none focus:border-[#0C5C3C] text-black shadow-inner"
                  rows={4}
                  placeholder="Log diagnostic voltage outputs, structural inspections, or hardware tweaks..."
                />
                {saveSuccess && (
                  <p className="text-xs text-emerald-600 font-medium transition-all pl-1 pt-1">
                    ✓ Progress saved successfully
                  </p>
                )}
                <Button 
                  onClick={() => saveTechnicianNotes(selectedTicket.id, selectedTicket.technicianNotes || "")}
                  className="w-full h-10 text-xs font-bold rounded-xl bg-[#0C5C3C] text-white shadow-none mt-2 hover:bg-[#0C5C3C]/90 transition-all"
                >
                  Save Workbench Logs
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RE-AUTHENTICATION GATEWAY TRIGGER MODAL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md px-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-8 shadow-2xl"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-50">
                <ShieldAlert className="h-8 w-8 text-orange-500" strokeWidth={2.2} />
              </div>
              <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-slate-900">Session Expired</h2>
              <p className="mt-3 text-center text-[15px] leading-7 text-slate-500">
                Your authentication session is no longer valid. Please sign in again to continue accessing the technician dashboard.
              </p>
              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push("/login");
                }}
                className="mt-8 w-full rounded-2xl bg-slate-900 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98]"
              >
                Continue to Login
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}