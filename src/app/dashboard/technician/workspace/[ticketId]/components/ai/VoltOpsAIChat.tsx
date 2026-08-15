"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Bot,
  ChevronRight,
  Loader2,
  MessageSquare,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { sendAIMessage,getAIConversation } from "@/services/ai/ai.service";

interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface VoltOpsAIChatProps {
  ticketId: number;
  vehicleName?: string;
}

function createMessageId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function VoltOpsAIChat({
  ticketId,
  vehicleName,
}: VoltOpsAIChatProps) {
  const [isOpen, setIsOpen] = useState(false);

 const [messages, setMessages] = useState<AIMessage[]>([]);
const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
  let cancelled = false;

  const loadConversation = async () => {
    setIsLoadingHistory(true);
    setError(null);

    try {
      const history = await getAIConversation(ticketId);

      if (cancelled) {
        return;
      }

      const restoredMessages: AIMessage[] =
        history.map((message, index) => ({
          id: `history-${ticketId}-${index}`,
          role: message.role,
          content: message.content,
        }));

      setMessages(restoredMessages);
    } catch (err) {
      if (cancelled) {
        return;
      }

      const message =
        err instanceof Error
          ? err.message
          : "Unable to load previous AI conversation.";

      setError(message);
    } finally {
      if (!cancelled) {
        setIsLoadingHistory(false);
      }
    }
  };

  void loadConversation();

  return () => {
    cancelled = true;
  };
}, [ticketId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isSending]);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        textareaRef.current?.focus();
      });
    }
  }, [isOpen]);

  const sendMessage = async () => {
    const trimmedMessage = input.trim();

    if (!trimmedMessage || isSending) {
      return;
    }

    setError(null);

    const userMessage: AIMessage = {
      id: createMessageId(),
      role: "user",
      content: trimmedMessage,
    };

    setMessages((previous) => [...previous, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      const assistantResponse = await sendAIMessage({
        ticketId,
        message: trimmedMessage,
      });

      const assistantMessage: AIMessage = {
        id: createMessageId(),
        role: "assistant",
        content: assistantResponse,
      };

      setMessages((previous) => [...previous, assistantMessage]);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong while contacting VoltOps AI.";

      setError(message);
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    await sendMessage();
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <>
      {/* =========================================================
          MOBILE AI LAUNCHER
         ========================================================= */}

      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => {
            clearError();
            setIsOpen(true);
          }}
          className="group relative flex w-full items-center justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left shadow-sm transition-all duration-200 active:scale-[0.99]"
          aria-label="Open VoltOps AI"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm">
              <Bot size={21} strokeWidth={1.8} />

              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-slate-900">
                  VoltOps AI
                </p>

                <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-700">
             Repair context loaded. 
                </span>
              </div>

              <p className="mt-0.5 truncate text-xs font-medium text-slate-400">
              Ask about the vehicle, diagnosis,
measurements, symptoms, or next steps.
              </p>
            </div>
          </div>

          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-transform duration-200 group-active:translate-x-0.5">
            <ChevronRight size={17} />
          </div>
        </button>
      </div>

      {/* =========================================================
          DESKTOP AI PANEL
         ========================================================= */}

      <div className="hidden lg:block">
        <DesktopAIChat
          ticketId={ticketId}
          vehicleName={vehicleName}
          messages={messages}
          input={input}
          setInput={setInput}
          isSending={isSending}
          error={error}
          textareaRef={textareaRef}
          messagesEndRef={messagesEndRef}
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
          onSend={sendMessage}
        />
      </div>

      {/* =========================================================
          MOBILE FULLSCREEN AI
         ========================================================= */}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex flex-col bg-[#FAFAF8] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Mobile Header */}
            <motion.header
              initial={{ y: -12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-600 transition-colors hover:bg-slate-100 active:scale-95"
                  aria-label="Close AI"
                >
                  <ArrowLeft size={20} />
                </button>

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white">
                  <Bot size={18} />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate text-sm font-bold text-slate-900">
                      VoltOps AI
                    </h2>

                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </div>

                  <p className="truncate text-[10px] font-medium text-slate-400">
                    {vehicleName
                      ? `Working with ${vehicleName}`
                      : "Repair assistant"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </motion.header>

            {/* Mobile Conversation */}
            <ChatConversation
              messages={messages}
              isSending={isSending}
              error={error}
              messagesEndRef={messagesEndRef}
              onDismissError={clearError}
            />

            {/* Mobile Input */}
            <ChatInput
              input={input}
              setInput={setInput}
              isSending={isSending}
              textareaRef={textareaRef}
              onSubmit={handleSubmit}
              onKeyDown={handleKeyDown}
              onSend={sendMessage}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* =============================================================
   DESKTOP CHAT
   ============================================================= */

interface DesktopAIChatProps {
  ticketId: number;
  vehicleName?: string;
  messages: AIMessage[];
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  isSending: boolean;
  error: string | null;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  onKeyDown: (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => void;
  onSend: () => Promise<void>;
}

function DesktopAIChat({
  vehicleName,
  messages,
  input,
  setInput,
  isSending,
  error,
  textareaRef,
  messagesEndRef,
  onSubmit,
  onKeyDown,
  onSend,
}: DesktopAIChatProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
            <Bot size={19} strokeWidth={1.8} />

            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">
                VoltOps AI
              </h2>

              <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-700">
                Online
              </span>
            </div>

            <p className="mt-0.5 truncate text-[11px] font-medium text-slate-400">
              {vehicleName
                ? `Repair intelligence · ${vehicleName}`
                : "Repair intelligence for this ticket"}
            </p>
          </div>

          <Sparkles
            size={16}
            className="shrink-0 text-slate-300"
          />
        </div>
      </div>

      <ChatConversation
        messages={messages}
        isSending={isSending}
        error={error}
        messagesEndRef={messagesEndRef}
        onDismissError={() => undefined}
        desktop
      />

      <ChatInput
        input={input}
        setInput={setInput}
        isSending={isSending}
        textareaRef={textareaRef}
        onSubmit={onSubmit}
        onKeyDown={onKeyDown}
        onSend={onSend}
        desktop
      />
    </section>
  );
}

/* =============================================================
   CONVERSATION
   ============================================================= */

interface ChatConversationProps {
  messages: AIMessage[];
  isSending: boolean;
  error: string | null;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  onDismissError: () => void;
  desktop?: boolean;
}

function ChatConversation({
  messages,
  isSending,
  error,
  messagesEndRef,
  onDismissError,
  desktop = false,
}: ChatConversationProps) {
  return (
    <div
      className={
        desktop
          ? "h-[440px] overflow-y-auto bg-[#FAFAF8] px-4 py-4"
          : "min-h-0 flex-1 overflow-y-auto bg-[#FAFAF8] px-4 py-5"
      }
    >
      {/* Intro */}
      {messages.length === 1 && !isSending && (
        <div className="mb-6 flex items-center gap-2 px-1">
          <Sparkles size={13} className="text-slate-400" />

          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            Repair context loaded
          </p>
        </div>
      )}

      <div className="space-y-4">
        {messages.map((message) => {
          const isUser = message.role === "user";

          return (
            <motion.div
              key={message.id}
              initial={{
                opacity: 0,
                y: 8,
                scale: 0.99,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              transition={{
                duration: 0.22,
              }}
              className={`flex ${
                isUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={
                  isUser
                    ? "max-w-[84%] rounded-2xl rounded-br-md bg-slate-950 px-4 py-3 text-sm leading-6 text-white shadow-sm"
                    : "max-w-[90%] rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm"
                }
              >
                {!isUser && (
                  <div className="mb-2 flex items-center gap-1.5">
                    <Bot size={13} className="text-slate-500" />

                    <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                      VoltOps AI
                    </span>
                  </div>
                )}

                <p className="whitespace-pre-wrap break-words">
                  {message.content}
                </p>
              </div>
            </motion.div>
          );
        })}

        {/* Thinking State */}
        {isSending && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"
                    style={{ animationDelay: "120ms" }}
                  />
                  <span
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"
                    style={{ animationDelay: "240ms" }}
                  />
                </div>

                <span className="text-[10px] font-semibold text-slate-400">
                  Analyzing repair context...
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-medium leading-5 text-red-700">
                {error}
              </p>

              <button
                type="button"
                onClick={onDismissError}
                className="shrink-0 text-[10px] font-bold text-red-600 underline"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

/* =============================================================
   INPUT
   ============================================================= */

interface ChatInputProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  isSending: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  onKeyDown: (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => void;
  onSend: () => Promise<void>;
  desktop?: boolean;
}

function ChatInput({
  input,
  setInput,
  isSending,
  textareaRef,
  onSubmit,
  onKeyDown,
  onSend,
  desktop = false,
}: ChatInputProps) {
  return (
    <div
      className={
        desktop
          ? "border-t border-slate-100 bg-white p-3"
          : "shrink-0 border-t border-slate-200 bg-white px-3 pb-[max(12px,env(safe-area-inset-bottom))] pt-3"
      }
    >
      <form onSubmit={onSubmit}>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2 transition-colors focus-within:border-slate-300 focus-within:bg-white focus-within:shadow-sm">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={onKeyDown}
            disabled={isSending}
            rows={desktop ? 2 : 2}
            placeholder="Ask about this repair..."
            className="max-h-32 min-h-[48px] w-full resize-none bg-transparent px-2 py-1 text-sm font-medium leading-6 text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
          />

          <div className="flex items-center justify-between gap-2 px-1 pt-1">
            <div className="flex items-center gap-1.5">
              <MessageSquare
                size={13}
                className="text-slate-300"
              />

              <span className="text-[9px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                Repair context active
              </span>
            </div>

            <button
              type="button"
              onClick={() => void onSend()}
              disabled={!input.trim() || isSending}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm transition-all duration-200 hover:bg-slate-800 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
              aria-label="Send message"
            >
              {isSending ? (
                <Loader2
                  size={16}
                  className="animate-spin"
                />
              ) : (
                <Send size={16} />
              )}
            </button>
          </div>
        </div>

        <p className="mt-2 px-1 text-[9px] font-medium text-slate-400">
          Enter to send · Shift + Enter for a new line
        </p>
      </form>
    </div>
  );
}