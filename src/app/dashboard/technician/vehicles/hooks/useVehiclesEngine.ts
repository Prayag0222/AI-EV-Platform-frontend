import { useState, useEffect } from "react";
import { RepairingVehicleTicket, VehicleTelemetryData } from "../types";

export function useVehiclesEngine() {
  const [tickets, setTickets] = useState<RepairingVehicleTicket[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTicket, setSelectedTicket] = useState<RepairingVehicleTicket | null>(null);
  const [notice, setNotice] = useState<string>("");

  // 📡 Fetch active telemetry tickets from server
  useEffect(() => {
    const fetchRepairingVehicles = async () => {
      try {
        setIsLoading(true);
        
        const profileRes = await fetch("http://localhost:3000/api/auth/me", {
          method: "GET",
          credentials: "include"
        });
        const profileData = await profileRes.json();

        if (!profileData.success) {
          setNotice("Session expired. Re-authentication required.");
          return;
        }

        const id = profileData.user.id;

        const ticketsRes = await fetch(
          `http://localhost:3000/api/vehicles/dashboard/${id}`
        );
        const ticketsData = await ticketsRes.json();

        if (ticketsData.success) {
          const activeRepairing = (ticketsData.tickets as RepairingVehicleTicket[]).filter(
            (t) => t.status !== "Delivered" && t.status !== "Ready" && t.vehicle
          );
          setTickets(activeRepairing);
        }
      } catch (error) {
        console.error("Failed to load repairing vehicles telemetry streams:", error);
        setNotice("Network connection drop. Core offline.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepairingVehicles();
  }, []);

  // 🛠️ PATCH: Commit telemetry mutations using strict Partial structures
  const updateVehicleTelemetry = async (
    ticketId: number, 
    telemetryUpdates: Partial<VehicleTelemetryData> // ✨ Goodbye 'any', hello precise object tracking!
  ) => {
    try {
      const response = await fetch(`http://localhost:3000/api/technician/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telemetry: telemetryUpdates }),
      });

      const data = await response.json();

      if (data.success) {
        setTickets((prevTickets) =>
          prevTickets.map((t) =>
            t.id === ticketId
              ? { ...t, vehicle: { ...t.vehicle, ...telemetryUpdates } }
              : t
          )
        );
        
        if (selectedTicket && selectedTicket.id === ticketId) {
          setSelectedTicket((prev) =>
            prev ? { ...prev, vehicle: { ...prev.vehicle, ...telemetryUpdates } } : null
          );
        }
        
        setNotice("Telemetry arrays committed securely to cloud disk.");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Network sync collision updating vehicle configurations:", error);
      setNotice("Sync failed. Check device local network link.");
      return false;
    }
  };

  // 🔍 Calculate matching strings safely
  const filteredTickets = tickets.filter((ticket) => {
    const normQuery = searchQuery.toLowerCase().trim();
    if (!normQuery) return true;

    return (
      ticket.id.toString().includes(normQuery) ||
      ticket.vehicle?.vehicleModel?.toLowerCase().includes(normQuery) || // ✨ Matches types index layout perfectly now
      ticket.vehicle?.vin?.toLowerCase().includes(normQuery) ||
      ticket.customer?.name?.toLowerCase().includes(normQuery)
    );
  });

  return {
    filteredTickets,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedTicket,
    setSelectedTicket,
    updateVehicleTelemetry,
    notice,
    setNotice,
  };
}