import { useState } from 'react';
import { RepairTicketData } from '../types';

export const useTicket = (ticketId: string | string[] | undefined) => {
  const [ticketData, setTicketData] = useState<RepairTicketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch logic
  const fetchTicket = async () => {
    if (!ticketId) return;
    const res = await fetch(`http://localhost:3000/api/technician/workspace/${ticketId}`,{
      method:'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (data.success) setTicketData(data.ticket);
    setIsLoading(false);
  };

  // Status update logic
  const updateStatus = async (newStatus: string) => {
    const res = await fetch(`http://localhost:3000/api/technician/workspace/${ticketId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newStatus }),
    });

    if (res.ok) {
      // Optimistic UI update
      setTicketData((prev) => prev ? { ...prev, status: newStatus } : null);
    }
  };

  return { ticketData, isLoading, fetchTicket, updateStatus };
};