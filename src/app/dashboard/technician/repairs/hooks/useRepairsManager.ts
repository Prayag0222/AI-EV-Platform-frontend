import { useCallback, useEffect, useMemo, useState } from "react";
import { API_BASE } from "@/config/api";
import type { RepairTicket, StatusFilter, WorkbenchStatus } from "../types";

const PAGE_SIZE = 8;

export const useRepairsManager = () => {
  const [repairs, setRepairs] = useState<RepairTicket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [activeUser, setActiveUser] = useState<{ id: string; name: string; role: string } | null>(null);
  const [searchQuery, setSearchQueryState] = useState("");
  const [statusFilter, setStatusFilterState] = useState<StatusFilter>("All");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [notice, setNotice] = useState("");
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  const fetchWorkspaceData = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);
    setError("");

    try {
      const profileResponse = await fetch(`${API_BASE}/auth/me`, {
        method: "GET",
        credentials: "include",
      });
      const profileData = await profileResponse.json();

      if (!profileResponse.ok || !profileData.success) {
        setIsSessionExpired(true);
        throw new Error(profileData.error || "Your session has expired. Please sign in again.");
      }

      const userAccount = profileData.user as { id: string; name: string; role: string };
      setActiveUser(userAccount);

      const ticketsResponse = await fetch(
        `${API_BASE}/technician/dashboard?technicianId=${encodeURIComponent(userAccount.id)}`,{
          credentials:"include"
        }
      );
      const ticketsData = await ticketsResponse.json();

      if (!ticketsResponse.ok || !ticketsData.success) {
        throw new Error(ticketsData.error || "Unable to load the repair queue.");
      }

      const fetchedTickets = (ticketsData.tickets || []) as RepairTicket[];
      setRepairs(fetchedTickets);
      setSelectedTicketId((current) =>
        current && fetchedTickets.some((ticket) => ticket.id === current)
          ? current
          : fetchedTickets[0]?.id ?? null,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "The repair queue could not be synchronized.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => void fetchWorkspaceData(), 0);
    return () => window.clearTimeout(initialLoad);
  }, [fetchWorkspaceData]);

  const updateTicketStatus = async (ticketId: number, newStatus: WorkbenchStatus) => {
    try {
      const response = await fetch(`${API_BASE}/technician/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
        credentials:"include"
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Status update was rejected.");
      setRepairs((current) =>
        current.map((ticket) => ticket.id === ticketId ? { ...ticket, status: newStatus, updatedAt: new Date().toISOString() } : ticket),
      );
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Status update failed.");
    }
  };

  const saveTechnicianNotes = async (ticketId: number, notes: string) => {
    try {
      const response = await fetch(`${API_BASE}/technician/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ technicianNotes: notes }),
        credentials:"include"
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Notes could not be saved.");
      setRepairs((current) => current.map((ticket) => ticket.id === ticketId ? { ...ticket, technicianNotes: notes } : ticket));
      setSaveSuccess(true);
      window.setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Notes could not be saved.");
    }
  };

  const filteredTickets = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return repairs.filter((ticket) => {
      const matchesStatus = statusFilter === "All" || ticket.status === statusFilter;
      const searchableValues = [
        ticket.id.toString(),
        `EV-${ticket.id.toString().padStart(4, "0")}`,
        ticket.customer?.name,
        ticket.customer?.phone,
        ticket.vehicle?.vehicleModel || ticket.vehicleModel,
        ticket.vehicle?.vin,
      ];
      return matchesStatus && (!query || searchableValues.some((value) => value?.toLowerCase().includes(query)));
    });
  }, [repairs, searchQuery, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginatedTickets = filteredTickets.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const selectedTicket = useMemo(() => repairs.find((ticket) => ticket.id === selectedTicketId) || null, [repairs, selectedTicketId]);

  const setSearchQuery = (value: string) => { setSearchQueryState(value); setPage(1); };
  const setStatusFilter = (value: string) => { setStatusFilterState(value as StatusFilter); setPage(1); };

  return {
    tickets: paginatedTickets,
    rawTickets: repairs,
    selectedTicket,
    activeUser,
    searchQuery,
    statusFilter,
    isLoading,
    isRefreshing,
    error,
    saveSuccess,
    notice,
    isSessionExpired,
    pagination: { page: safePage, pageSize: PAGE_SIZE, totalItems: filteredTickets.length, totalPages },
    setPage,
    setSearchQuery,
    setStatusFilter,
    setSelectedTicketId,
    setNotice,
    refresh: () => fetchWorkspaceData(true),
    updateTicketStatus,
    saveTechnicianNotes,
  };
};
