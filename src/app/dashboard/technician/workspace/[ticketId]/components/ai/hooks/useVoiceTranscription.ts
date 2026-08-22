"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { API_BASE } from "@/config/api";

import type {
  UseVoiceTranscriptionReturn,
} from "../types/ai-chat.types";

interface TranscriptionResponse {
  success: boolean;
  transcript?: string;
  error?: string;
}

export function useVoiceTranscription(
  onTranscript: (transcript: string) => void
): UseVoiceTranscriptionReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef =
    useRef<MediaRecorder | null>(null);

  const audioChunksRef =
    useRef<Blob[]>([]);

  const microphoneStreamRef =
    useRef<MediaStream | null>(null);

  /*
   * AUDIO → TEXT
   *
   * This is declared first because
   * startRecording() uses it.
   */
  const transcribeAudio = useCallback(
    async (audioBlob: Blob) => {
      setIsTranscribing(true);
      setError(null);

      try {
        const formData = new FormData();

        formData.append(
          "audio",
          audioBlob,
          "voice-input.webm"
        );

        const response = await fetch(
          `${API_BASE}/ai/transcribe`,
          {
            method: "POST",
            credentials: "include",
            body: formData,
          }
        );

        const data =
          (await response.json()) as TranscriptionResponse;

        if (!response.ok || !data.success) {
          throw new Error(
            data.error ||
              "Voice transcription failed."
          );
        }

        const transcript =
          data.transcript?.trim();

        if (!transcript) {
          throw new Error(
            "No speech could be detected."
          );
        }

        onTranscript(transcript);
      } catch (error) {
        console.error(
          "❌ Voice transcription error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to transcribe voice input."
        );
      } finally {
        setIsTranscribing(false);
        audioChunksRef.current = [];
      }
    },
    [onTranscript]
  );

  /*
   * START RECORDING
   */
  const startRecording = useCallback(
    async () => {
      try {
        setError(null);
        audioChunksRef.current = [];

        if (
          !navigator.mediaDevices?.getUserMedia
        ) {
          throw new Error(
            "Microphone recording is not supported by this browser."
          );
        }

        if (!window.MediaRecorder) {
          throw new Error(
            "Audio recording is not supported by this browser."
          );
        }

        const stream =
          await navigator.mediaDevices.getUserMedia(
            {
              audio: true,
            }
          );

        microphoneStreamRef.current =
          stream;

        const recorder =
          new MediaRecorder(stream);

        recorder.ondataavailable = (
          event: BlobEvent
        ) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(
              event.data
            );
          }
        };

        recorder.onerror = () => {
          setError(
            "Audio recording failed."
          );

          setIsRecording(false);
        };

        recorder.onstop = async () => {
          const audioBlob = new Blob(
            audioChunksRef.current,
            {
              type:
                recorder.mimeType ||
                "audio/webm",
            }
          );

          stream
            .getTracks()
            .forEach((track) =>
              track.stop()
            );

          microphoneStreamRef.current =
            null;

          mediaRecorderRef.current =
            null;

          if (audioBlob.size === 0) {
            setError(
              "No audio was recorded."
            );

            return;
          }

          await transcribeAudio(
            audioBlob
          );
        };

        mediaRecorderRef.current =
          recorder;

        recorder.start();

        setIsRecording(true);
      } catch (error) {
        console.error(
          "❌ Voice recording error:",
          error
        );

        setIsRecording(false);

        setError(
          error instanceof Error
            ? error.message
            : "Could not access the microphone."
        );
      }
    },
    [transcribeAudio]
  );

  /*
   * STOP RECORDING
   */
  const stopRecording = useCallback(() => {
    const recorder =
      mediaRecorderRef.current;

    if (!recorder) {
      return;
    }

    if (recorder.state !== "inactive") {
      recorder.stop();
    }

    setIsRecording(false);
  }, []);

  /*
   * CLEAR ERROR
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /*
   * CLEANUP
   */
  useEffect(() => {
    return () => {
      const recorder =
        mediaRecorderRef.current;

      if (
        recorder &&
        recorder.state !== "inactive"
      ) {
        recorder.stop();
      }

      microphoneStreamRef.current
        ?.getTracks()
        .forEach((track) =>
          track.stop()
        );
    };
  }, []);

  return {
    isRecording,
    isTranscribing,
    error,

    startRecording,
    stopRecording,

    clearError,
  };
}