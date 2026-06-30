'use client';

import { useEffect, useMemo, useState } from 'react';

import { RepairTicket } from '../types/types';
import { API_BASE } from '@/config/api';

export default function useOperations() {
  const [tickets, setTickets] = useState<RepairTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchOperations() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${API_BASE}/operation/tickets`,
          {
            credentials: 'include',
            signal: controller.signal,
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || 'Failed to load operations.'
          );
        }

        setTickets(data.tickets ?? []);
      } catch (error) {
        if (error instanceof DOMException) return;

        setError(
          error instanceof Error
            ? error.message
            : 'Something went wrong.'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchOperations();

    return () => controller.abort();
  }, []);

  const activeTickets = useMemo(
    () =>
      tickets.filter(
        ticket =>
          ticket.status.toLowerCase() !== 'delivered'
      ),
    [tickets]
  );

  const deliveredTickets = useMemo(
    () =>
      tickets.filter(
        ticket =>
          ticket.status.toLowerCase() === 'delivered'
      ),
    [tickets]
  );

  return {
    loading,
    error,
    tickets,
    activeTickets,
    deliveredTickets,
  };
}