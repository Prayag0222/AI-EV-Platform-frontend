// src/app/technician/workspace/[ticketId]/hooks/useRepairWorkspace.ts
"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation"; // Next.js dynamic routing parameter hook
import type { InventoryItem, RepairCostInput, RepairCostTotals, RepairTicket, TicketStatus, TechnicianNote } from "../types/index";
import { API_BASE } from "@/config/api";

// 📡 BASE CONFIG: Points directly to your running Express backend API
const mapTicket = (raw: RepairTicket): RepairTicket => ({
  ...raw,
  vehicleModel: raw.vehicle?.vehicleModel || "Vehicle not linked",
  customerComplaint: raw.description,
  batteryPackSerial: raw.vehicle?.batteryPackSerial || "Not recorded",
  batteryCapacity: raw.vehicle?.batteryCapacity || "Not recorded",
  batterySoh: raw.vehicle?.batterySoh || 0,
  batteryCycles: raw.vehicle?.batteryCycles || 0,
  batteryTemp: raw.vehicle?.batteryTemp || "Not recorded",
  vin: raw.vehicle?.vin || "Not recorded",
  odometer: raw.vehicle?.odometer || "Not recorded",
  lastServiceDaysAgo: raw.vehicle?.lastServiceDaysAgo || 0,
  estimatedCompletionTime: "Not scheduled",
  repairCost: raw.estimatedCost == null ? "Not estimated" : `₹${raw.estimatedCost.toLocaleString("en-IN")}`,
  assignedAt: raw.createdAt,
  timeline: raw.timeline || [],
  notes: raw.notes || [],
  parts: raw.parts || [],
  laborHours: raw.laborHours || 0,
  laborRate: raw.laborRate || 0,
  taxRate: raw.taxRate || 0,
  discount: raw.discount || 0,
});

export function useRepairWorkspace() {
  // A. Extract dynamic ticketId directly from Next.js URL paths
  const params = useParams();
  const ticketId = params?.ticketId ? parseInt(params.ticketId as string, 10) : null;

  // B. Local Reactive States
  const [ticket, setTicket] = useState<RepairTicket | null>(null);
  const [notes, setNotes] = useState<TechnicianNote[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [technician, setTechnician] = useState<string>("");
  const [error, setError] = useState("");
  const [isSavingStatus, setIsSavingStatus] = useState(false);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isSavingPart, setIsSavingPart] = useState(false);
  const [isSavingCosts, setIsSavingCosts] = useState(false);

  // C. References to preserve microphone states across component renders
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // 1. FETCH TICKET METRICS & EXISTING NOTES ON SCREEN MOUNT
  useEffect(() => {
    async function loadWorkspaceData() {
      if (!ticketId || isNaN(ticketId)) return;
      
      try {
        setIsLoading(true);

        // 1. Fetch the unified ticket data layer
        setError("");
        const ticketResponse = await fetch(`${API_BASE}/technician/workspace/${ticketId}`,{
          credentials:"include"
        });
        
        if (ticketResponse.ok) {
          const resData = await ticketResponse.json();
          
          // 2. Hydrate the core vehicle and layout properties
          const mappedTicket = mapTicket(resData.ticket);
          setTicket(mappedTicket);
          
          // 3. Extract the embedded notes directly from the ticket object itself
          if (resData.ticket && resData.ticket.notes) {
            setNotes(mappedTicket.notes);
          } else {
            setNotes([]);
          }

          if (resData.ticket.technician?.fullName) {
             setTechnician(resData.ticket.technician.fullName);
          } 
          // If your backend sent it as a flat string property
          else if (resData.ticket.assignedTechnician) {
             setTechnician(resData.ticket.assignedTechnician);
          }       
        }

        const inventoryResponse = await fetch(`${API_BASE}/inventory`,{
          credentials:"include"
        });
        if (inventoryResponse.ok) {
          const inventoryData = await inventoryResponse.json();
          setInventory(inventoryData.items || []);
        }
      } catch (error) {
        console.error("❌ Network error connecting to full-stack pipelines:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadWorkspaceData();
  }, [ticketId]);

  // 2. STATUS CHANGING CONTROLLER (PATCH SYSTEM)
  const changeStatus = async (newStatus: TicketStatus) => {
    if (!ticket || !ticketId) return;

    const previousStatus = ticket.status;
    setIsSavingStatus(true);
    setError("");
    setTicket((prev) => (prev ? { ...prev, status: newStatus } : null));

    try {
      const response = await fetch(`${API_BASE}/technician/workspace/${ticketId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newStatus }),
        credentials:"include"
      });
      const body = await response.json();
      if (!response.ok || !body.success) throw new Error(body.message || "Status update failed.");
      setTicket((prev) => prev ? {
        ...prev,
        updatedAt: body.ticket?.updatedAt || prev.updatedAt,
        closedAt: body.ticket?.closedAt ?? prev.closedAt,
        timeline: body.timelineEvent ? [body.timelineEvent, ...prev.timeline] : prev.timeline,
      } : null);
    } catch (error) {
      console.error("❌ Failed to patch pipeline position update:", error);
      setTicket((prev) => prev ? { ...prev, status: previousStatus } : null);
      setError(error instanceof Error ? error.message : "Status update failed.");
    } finally {
      setIsSavingStatus(false);
    }
  };

  // 3. TAG CHIP INJECTION CONTROLLER
  const addQuickChip = async (chipLabel: string) => {
    if (!ticketId) return;

    // Inject immediately into local UI state array
    const freshMockNote: TechnicianNote = {
      id: Date.now(),
      ticketId,
      rawVoiceText: chipLabel,
      structuredText: chipLabel,
      quickTags: ["Quick-Chip"],
      imageUrls: [],
      createdAt: new Date().toISOString(),
    };
    setNotes((prev) => [...prev, freshMockNote]);

    try {
      const response = await fetch(`${API_BASE}/technician/workspace/${ticketId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ structuredText: chipLabel, rawVoiceText: chipLabel, quickTags: [chipLabel], imageUrls: [] }),
        credentials:"include"
      });
      const body = await response.json();
      if (response.ok && body.note) setNotes((prev) => prev.map((note) => note.id === freshMockNote.id ? body.note : note));
    } catch (error) {
      console.error("❌ Failed to log chip note:", error);
    }
  };

  // --- 🆕 4. CREATE MANUAL NOTE (WITH AI STRUCTURING) ---
  const addManualNote = async (text: string) => {
    if (!ticketId) return;

    // Optimistic UI Update
    const tempId = Date.now();
    const optimisticNote: TechnicianNote = {
      id: tempId,
      ticketId,
      rawVoiceText: text,
      structuredText: "Structuring note via AI...", 
      quickTags: ["Manual-Entry"],
      imageUrls: [],
      createdAt: new Date().toISOString(),
    };
    
    setNotes((prev) => [...prev, optimisticNote]);

    try {
      const response = await fetch(`${API_BASE}/technician/workspace/${ticketId}/notes/manual`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
        credentials:"include"
      });

      const body = await response.json();
      
      if (response.ok && body.success && body.note) {
        setNotes((prev) => prev.map(n => n.id === tempId ? body.note : n));
      } else {
        throw new Error(body.error || "Failed to save note");
      }
    } catch (err) {
      console.error("❌ Failed to save manual note:", err);
      setNotes((prev) => prev.filter(n => n.id !== tempId));
    }
  };

  // --- 🆕 5. UPDATE EXISTING NOTE ---
  const updateNote = async (noteId: number, newStructuredText: string) => {
    // Optimistic Update
    setNotes((prev) => 
      prev.map(n => n.id === noteId ? { ...n, structuredText: newStructuredText } : n)
    );

    try {
      const response = await fetch(`${API_BASE}/technician/notes/${noteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ structuredText: newStructuredText }),
        credentials:"include"
      });

      if (!response.ok) throw new Error("Failed to update note");
    } catch (err) {
      console.error("❌ Failed to update note in DB:", err);
      // Optional: trigger a re-fetch of notes here to sync state if failed
    }
  };

  // --- 🆕 6. DELETE NOTE ---
  const deleteNote = async (noteId: number) => {
    // Optimistic Update
    setNotes((prev) => prev.filter(n => n.id !== noteId));

    try {
      const response = await fetch(`${API_BASE}/technician/notes/${noteId}`, {
        method: 'DELETE',
        credentials:"include"
      });

      if (!response.ok) throw new Error("Failed to delete note");
    } catch (err) {
      console.error("❌ Failed to delete note from DB:", err);
      // Optional: trigger a re-fetch of notes here to sync state if failed
    }
  };

  // 7. THE AUDIO PIPELINE: TWO-STAGE GROQ CONTROLLER
  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      
      const streamHandle = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(streamHandle, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        if (!ticketId) return;

        const completeAudioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        
        const dataEnvelope = new FormData();
        dataEnvelope.append("audio", completeAudioBlob, "briefing.webm");


        try {
          const apiResponse = await fetch(
            `${API_BASE}/technician/workspace/${ticketId}/notes/audio`,
            {
              method: "POST",
              body: dataEnvelope, 
              credentials:"include"
            }
          );

          if (apiResponse.ok) {
            const parsedJson = await apiResponse.json();
            if (parsedJson.success && parsedJson.note) {
              setNotes((prev) => [...prev, parsedJson.note]);
            }
          }
        } catch (uploadErr) {
          console.error("❌ Failed to upload recording data envelope:", uploadErr);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("❌ Failed to start browser recording interface standard:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  // 8. PARTS MANAGEMENT
  const addPart = async (inventoryId: number, quantity: number) => {
    if (!ticketId) return false;
    setIsSavingPart(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/technician/workspace/${ticketId}/parts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inventoryId, quantity }),
        credentials:"include"
      });
      const body = await response.json();
      if (!response.ok || !body.success) throw new Error(body.message || "Part allocation failed.");
      setTicket((current) => current ? { ...current, parts: [...current.parts, body.part] } : null);
      setInventory((items) => items.map((item) => item.id === inventoryId ? { ...item, stockLevel: item.stockLevel - quantity } : item));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Part allocation failed.");
      return false;
    } finally {
      setIsSavingPart(false);
    }
  };

  const removePart = async (partId: number) => {
    if (!ticketId || !ticket) return;
    const allocated = ticket.parts.find((part) => part.id === partId);
    setIsSavingPart(true);
    try {
      const response = await fetch(`${API_BASE}/technician/workspace/${ticketId}/parts/${partId}`, { method: "DELETE",credentials:"include" });
      const body = await response.json();
      if (!response.ok || !body.success) throw new Error(body.message || "Part removal failed.");
      setTicket((current) => current ? { ...current, parts: current.parts.filter((part) => part.id !== partId) } : null);
      if (allocated) setInventory((items) => items.map((item) => item.id === allocated.inventoryId ? { ...item, stockLevel: item.stockLevel + allocated.quantity } : item));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Part removal failed.");
    } finally {
      setIsSavingPart(false);
    }
  };

  const saveRepairCosts = async (costs: RepairCostInput): Promise<RepairCostTotals | null> => {
    if (!ticketId) return null;
    setIsSavingCosts(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/technician/workspace/${ticketId}/costs`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(costs),
        credentials:"include"
      });
      const body = await response.json();
      if (!response.ok || !body.success) throw new Error(body.message || "Repair costs could not be saved.");
      setTicket((current) => current ? {
        ...current,
        ...body.ticket,
        repairCost: body.ticket.estimatedCost == null ? "Not estimated" : `₹${body.ticket.estimatedCost.toLocaleString("en-IN")}`,
      } : null);
      return body.totals as RepairCostTotals;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Repair costs could not be saved.");
      return null;
    } finally {
      setIsSavingCosts(false);
    }
  };

  return {
    ticket,
    notes,
    isLoading,
    isRecording,
    error,
    isSavingStatus,
    isSavingPart,
    isSavingCosts,
    inventory,
    partsTotal: ticket?.parts.reduce((sum, part) => sum + part.lockedCost * part.quantity, 0) || 0,
    technician,
    startRecording,
    stopRecording,
    changeStatus,
    addQuickChip,
    addManualNote,
    updateNote,
    deleteNote,
    addPart,
    removePart,
    saveRepairCosts,
  };
}
