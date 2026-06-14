'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, StopCircle, Save, Loader2, AlertCircle } from 'lucide-react';

interface VoiceNotesProps {
  ticketId: string | string[] | undefined;
  onNoteAdded: () => void;
}

export default function VoiceNotesModule({ ticketId, onNoteAdded }: VoiceNotesProps) {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Cleanup microphone on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    audioChunksRef.current = [];
    setErrorMessage('');
    setAudioBlob(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlobObject = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlobObject);
        
        // Stop all audio tracks to turn off the physical microphone light
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access denied or error:", err);
      setErrorMessage("Could not access microphone. Please check your browser permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const saveAudioNote = async () => {
    if (!audioBlob) return;
    setIsProcessing(true);
    setErrorMessage('');

    try {
      const targetId = Array.isArray(ticketId) ? ticketId[0] : ticketId;
      
      // 🚀 SENIOR INSIGHT: Since we are sending a FILE, we use FormData instead of JSON
      const formData = new FormData();
      formData.append('audio', audioBlob, 'diagnostic_audio.webm');

      const response = await fetch(`http://localhost:3000/api/technician/workspace/${targetId}/notes/audio`, {
        method: 'POST',
        body: formData, // Browser automatically sets 'multipart/form-data' header
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      setAudioBlob(null);
      onNoteAdded(); 
    } catch (e) {
      console.error("Failed to upload audio file:", e);
      setErrorMessage("Failed to process and transcribe audio note on the server.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          AI Voice Assistant (File Mode)
        </p>
        {isRecording && (
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-red-500 font-bold uppercase animate-pulse">Recording</span>
            <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
          </div>
        )}
      </div>

      {/* Visual Status Container */}
      <div className="min-h-[60px] p-3 bg-slate-50 rounded-xl text-xs text-slate-500 flex items-center justify-center border border-transparent">
        {isRecording && "Listening smoothly... Take your time, pauses are allowed."}
        {!isRecording && audioBlob && "Audio captured successfully! Ready to process."}
        {!isRecording && !audioBlob && "Tap the mic to record your diagnostic brief."}
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl text-xs">
          <AlertCircle className="size-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="flex gap-2">
        {!isRecording ? (
          <button 
            onClick={startRecording} 
            type="button"
            disabled={isProcessing}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl font-bold transition-all hover:bg-slate-800 disabled:bg-slate-200"
          >
            <Mic className="size-5" /> Start Briefing
          </button>
        ) : (
          <button 
            onClick={stopRecording} 
            type="button"
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500 text-white rounded-xl font-bold transition-all hover:bg-red-600"
          >
            <StopCircle className="size-5" /> Stop & Lock Audio
          </button>
        )}
        
        {audioBlob && !isRecording && (
          <button 
            onClick={saveAudioNote} 
            disabled={isProcessing}
            type="button"
            className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold transition-all hover:bg-emerald-700 disabled:bg-emerald-200 flex items-center justify-center"
          >
            {isProcessing ? (
              <Loader2 className="animate-spin size-5" />
            ) : (
              <div className="flex items-center gap-2">
                <Save className="size-5" />
                <span className="text-sm">Transcribe with AI</span>
              </div>
            )}
          </button>
        )}
      </div>
    </div>
  );
}