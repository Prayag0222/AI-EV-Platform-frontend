import type React from "react";

export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface VoltOpsAIChatProps {
  ticketId: number;
  vehicleName?: string;
}

export interface ChatInputProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  isSending: boolean;

  isRecording: boolean;
  isTranscribing: boolean;

  textareaRef: React.RefObject<HTMLTextAreaElement | null>;

  onSubmit: (
    event: React.FormEvent<HTMLFormElement>
  ) => Promise<void>;

  onKeyDown: (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => void;

  onSend: () => Promise<void>;

  onStartVoice: () => Promise<void>;
  onStopVoice: () => void;

  desktop?: boolean;
}

export interface ChatConversationProps {
  messages: AIMessage[];
  isSending: boolean;
  error: string | null;

  messagesEndRef: React.RefObject<HTMLDivElement | null>;

  onDismissError: () => void;

  desktop?: boolean;
}

export interface UseVoiceTranscriptionReturn {
  isRecording: boolean;
  isTranscribing: boolean;
  error: string | null;

  startRecording: () => Promise<void>;
  stopRecording: () => void;

  clearError: () => void;
}