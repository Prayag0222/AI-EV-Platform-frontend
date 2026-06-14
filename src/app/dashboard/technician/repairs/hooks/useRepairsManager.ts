import { useState, useEffect, useMemo } from 'react';
import { RepairTicket, WorkbenchStatus } from '../types';

export const useRepairsManager = () => {
  // 📥 CORE DATA STORAGE STREAMS
  const [tickets, setRepairs] = useState<RepairTicket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [activeUser, setActiveUser] = useState<{ id: string; name: string; role: string } | null>(null);

  // 🎛️ CONTROLLER RUNTIME FILTERS
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // 🚨 UI SYSTEM BANNERS & DELAYS
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [notice, setNotice] = useState<string>("");
  const [isSessionExpired, setIsSessionExpired] = useState<boolean>(false);

  // 🔄 1. AUTOMATED WORKSPACE SYNCHRONIZATION PIPELINE
  useEffect(() => {
    const fetchWorkspaceData = async () => {
      try {
        setIsLoading(true);
        
        const profileResponse = await fetch("http://localhost:3000/api/auth/me", {
          method: "GET",
          credentials: "include"
        });
        const profileData = await profileResponse.json();

        if (!profileData.success) {
          setNotice("Authentication lease terminated. Re-routing to entry gate.");
          setIsSessionExpired(true);
          return;
        }

        const userAccount = profileData.user;
        setActiveUser(userAccount);

        const ticketsResponse = await fetch(`http://localhost:3000/api/technician/dashboard?technicianId=${userAccount.id}`);
        const ticketsData = await ticketsResponse.json();

        if (ticketsData.success) {
          const fetchedTickets = ticketsData.tickets || [];
          setRepairs(fetchedTickets);
          if (fetchedTickets.length > 0) {
            setSelectedTicketId(fetchedTickets[0].id);
          }
        }
      } catch (err) {
        console.error("Critical error syncing workspace grids:", err);
        setNotice("Network connection drop registered. Database sync offline.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkspaceData();
  }, []);

  // 🔧 2. REAL-TIME MANUAL RE-ROUTING TRANSACTION PIPELINE
  const updateTicketStatus = async (ticketId: number, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/technician/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (data.success) {
        setRepairs((prevTickets) =>
          prevTickets.map((ticket: RepairTicket) =>
            ticket.id === ticketId ? { ...ticket, status: newStatus as WorkbenchStatus } : ticket
          )
        );
      } else {
        setNotice(data.message || "Server validation rejected workflow change.");
      }
    } catch (err) {
      console.error("Failed to commit status change:", err);
      setNotice("Logistics update failed. Connection timeout.");
    }
  };

  // 📝 3. TECHNICAL PROGRESS LOG COMMIT PIPELINE
  const saveTechnicianNotes = async (ticketId: number, notes: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/technician/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ technicianNotes: notes })
      });

      const data = await response.json();

      if (data.success) {
        setRepairs((prevTickets) =>
          prevTickets.map((ticket: RepairTicket) =>
            ticket.id === ticketId ? { ...ticket, technicianNotes: notes } : ticket
          )
        );
        setNotice("Workbench notes saved successfully.");
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setNotice("Database failed to process technical logs.");
      }
    } catch (err) {
      console.error("Notes execution failure:", err);
      setNotice("Network frame dropped. Unable to save text log progress.");
    }
  };

  // ⚡ 4. HIGH-PERFORMANCE DATA FILTER ENGINE
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket: RepairTicket) => {
      if (!ticket) return false;

      // Filter Element Step 1: Match workflow status choice criteria
      const matchesStatus = statusFilter === "All" || ticket.status === statusFilter;

      // Filter Element Step 2: Run clean multi-target search matching rules
      const normQuery = searchQuery.toLowerCase().trim();
      
      // 🛡️ BULLETPROOF FALLBACKS: We wrap every string in (property || "") to prevent undefined crashes!
      const matchesSearch =
        normQuery === "" ||
        (ticket.id?.toString() || "").includes(normQuery) ||
        (ticket.vehicleModel || "").toLowerCase().includes(normQuery) ||
        (ticket.issueCategory || "").toLowerCase().includes(normQuery) ||
        (ticket.customer?.name || "").toLowerCase().includes(normQuery);

      return matchesStatus && matchesSearch;
    });
  }, [tickets, statusFilter, searchQuery]);

  const currentSelectedTicket = useMemo(() => {
    return tickets.find((t: RepairTicket) => t.id === selectedTicketId) || null;
  }, [tickets, selectedTicketId]);

  return {
    tickets: filteredTickets,
    rawTickets: tickets,
    selectedTicket: currentSelectedTicket,
    activeUser,
    searchQuery,
    statusFilter,
    isLoading,
    saveSuccess,
    notice,
    isSessionExpired,
    setSearchQuery,
    setStatusFilter,
    setSelectedTicketId,
    setNotice,
    updateTicketStatus,
    saveTechnicianNotes
  };
};