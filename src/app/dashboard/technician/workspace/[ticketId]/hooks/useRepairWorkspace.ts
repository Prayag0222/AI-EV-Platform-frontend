// src/app/technician/workspace/[ticketId]/hooks/useRepairWorkspace.ts
"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation"; // Next.js dynamic routing parameter hook
import type { RepairTicket, TicketStatus, TechnicianNote } from "../types/index";
import { log } from "console";

// 📡 BASE CONFIG: Points directly to your running Express backend API
const EXPRESS_API_BASE = "http://localhost:3000/api";

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

  // C. References to preserve microphone states across component renders
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // 1. FETCH TICKET METRICS & EXISTING NOTES ON SCREEN MOUNT
  useEffect(() => {
  async function loadWorkspaceData() {
    if (!ticketId || isNaN(ticketId)) return;
    
    try {
      setIsLoading(true);

      // 1. Fetch the unified ticket data layer (Change port to 3001 if your Express server uses it!)
      const ticketResponse = await fetch(`http://localhost:3000/api/technician/workspace/${ticketId}`);
      
      if (ticketResponse.ok) {
        const resData = await ticketResponse.json();
        
        // 2. Hydrate the core vehicle and layout properties
        setTicket(resData.ticket);
        
        // 3. Extract the embedded notes directly from the ticket object itself
        if (resData.ticket && resData.ticket.notes) {
          setNotes(resData.ticket.notes);
        } else {
          setNotes([]);
        }
        

       if (resData.ticket.technician?.fullName) {
            setTechnician(resData.ticket.technician.fullName);
          } 
          // If your backend sent it as a flat string property like: ticket: { assignedTechnician: "Arjun R." }
          else if (resData.ticket.assignedTechnician) {
            setTechnician(resData.ticket.assignedTechnician);
          }       
        
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

    // Optimistic Update: make the pipeline text change instantly on click without delay
    setTicket((prev) => (prev ? { ...prev, status: newStatus } : null));

    try {
      await fetch(`${EXPRESS_API_BASE}/technician/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (error) {
      console.error("❌ Failed to patch pipeline position update:", error);
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
      createdAt: new Date().toISOString(),
    };
    setNotes((prev) => [...prev, freshMockNote]);

    try {
      await fetch(`http://localhost:3000/api/technician/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ technicianNotes: chipLabel }),
      });
    } catch (error) {
      console.error("❌ Failed to log chip note:", error);
    }
  };

  // 4. THE AUDIO PIPELINE: RECONNECTING TO YOUR TWO-STAGE GROQ CONTROLLER
  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      
      // Request active microphone streams from browser security window
      const streamHandle = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(streamHandle, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;

      // Collect raw data chunks as the technician speaks
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // When recording hits stop, immediately pack the data envelope and push over HTTP
      mediaRecorder.onstop = async () => {
        if (!ticketId) return;

        const completeAudioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        
        // Use Multipart form structures to handle binary file transportation over networks
        const dataEnvelope = new FormData();
        dataEnvelope.append("audio", completeAudioBlob, "briefing.webm");

        console.log("🎙️ Sending WebM audio blob straight to Groq pipeline...");

        try {
          const apiResponse = await fetch(
            `http://localhost:3000/api/technician/workspace/${ticketId}/notes/audio`,
            {
              method: "POST",
              body: dataEnvelope, // Next.js parses multi-part form boundary frames automatically
            }
          );

          if (apiResponse.ok) {
            const parsedJson = await apiResponse.json();
            if (parsedJson.success && parsedJson.note) {
              // Append your brand-new, dual-stage database note record directly into state array!
              setNotes((prev) => [...prev, parsedJson.note]);
              console.log("✨ Notes array updated successfully with database index.");
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
      // Turn off microphone track streams immediately so recording ring lights shut off
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  return {
    ticket,
    notes,
    isLoading,
    isRecording,
    technician,
    startRecording,
    stopRecording,
    changeStatus,
    addQuickChip,
    
  };
}