import { useState } from 'react';
import { RepairTicketData } from '../types';
import { API_BASE } from '@/config/api';

export const useTicket = (ticketId: string | string[] | undefined) => {
  const [ticketData, setTicketData] = useState<RepairTicketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch logic
  const fetchTicket = async () => {
    if (!ticketId) return;
    const res = await fetch(`${API_BASE}/technician/workspace/${ticketId}`,{
      method:'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    const data = await res.json();
    if (data.success) setTicketData(data.ticket);
    setIsLoading(false);
  };

  // Status update logic
  const updateStatus = async (newStatus: string) => {
    const res = await fetch(`${API_BASE}/technician/workspace/${ticketId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ newStatus }),
    });

    if (res.ok) {
      // Optimistic UI update
      setTicketData((prev) => prev ? { ...prev, status: newStatus } : null);
    }
  };

  return { ticketData, isLoading, fetchTicket, updateStatus };
};
