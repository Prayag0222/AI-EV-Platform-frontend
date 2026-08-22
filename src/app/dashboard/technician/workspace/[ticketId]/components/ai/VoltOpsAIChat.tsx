"use client";

import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  ArrowLeft,
  Bot,
  ChevronRight,
  Sparkles,
  X,
} from "lucide-react";

import {
  sendAIMessage,
  getAIConversation,
} from "@/services/ai/ai.service";

import { AIChatConversation } from "./components/AIChatConversation";
import { AIChatInput } from "./components/AIChatInput";

import { useVoiceTranscription } from "./hooks/useVoiceTranscription";

import type {
  AIMessage,
  VoltOpsAIChatProps,
} from "./types/ai-chat.types";

function createMessageId() {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

export function VoltOpsAIChat({
  ticketId,
  vehicleName,
}: VoltOpsAIChatProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] =
    useState<AIMessage[]>([]);

  const [isLoadingHistory, setIsLoadingHistory] =
    useState(true);

  const [input, setInput] = useState("");

  const [isSending, setIsSending] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const messagesEndRef =
    useRef<HTMLDivElement | null>(null);

  const textareaRef =
    useRef<HTMLTextAreaElement | null>(null);

  const {
    isRecording,
    isTranscribing,
    error: voiceError,
    startRecording,
    stopRecording,
    clearError: clearVoiceError,
  } = useVoiceTranscription(
    (transcript) => {
      setInput((currentInput) => {
        if (!currentInput.trim()) {
          return transcript;
        }

        return `${currentInput.trim()} ${transcript}`;
      });
    }
  );

  /*
   * Load existing AI conversation
   */
  useEffect(() => {
    let cancelled = false;

    const loadConversation =
      async () => {
        setIsLoadingHistory(true);
        setError(null);

        try {
          const history =
            await getAIConversation(
              ticketId
            );

          if (cancelled) {
            return;
          }

          const restoredMessages: AIMessage[] =
            history.map(
              (message, index) => ({
                id: `history-${ticketId}-${index}`,
                role: message.role,
                content: message.content,
              })
            );

          setMessages(restoredMessages);
        } catch (err) {
          if (cancelled) {
            return;
          }

          setError(
            err instanceof Error
              ? err.message
              : "Unable to load previous AI conversation."
          );
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

  /*
   * Scroll to latest message
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isSending]);

  /*
   * Focus input when mobile AI opens
   */
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
  }, [isOpen]);

  /*
   * Combine normal AI errors + voice errors
   */
 

  const sendMessage = async () => {
    const trimmedMessage =
      input.trim();

    if (
      !trimmedMessage ||
      isSending ||
      isRecording ||
      isTranscribing
    ) {
      return;
    }

    setError(null);
    clearVoiceError();

    const userMessage: AIMessage = {
      id: createMessageId(),
      role: "user",
      content: trimmedMessage,
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setInput("");
    setIsSending(true);

    try {
      const assistantResponse =
        await sendAIMessage({
          ticketId,
          message: trimmedMessage,
        });

      const assistantMessage: AIMessage = {
        id: createMessageId(),
        role: "assistant",
        content: assistantResponse,
      };

      setMessages((previous) => [
        ...previous,
        assistantMessage,
      ]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while contacting VoltOps AI."
      );
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
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      void sendMessage();
    }
  };

  const clearError = () => {
    setError(null);
    clearVoiceError();
  };

  return (
    <>
      {/* =====================================================
          MOBILE LAUNCHER
      ===================================================== */}

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
              <Bot
                size={21}
                strokeWidth={1.8}
              />

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

      {/* =====================================================
          DESKTOP AI
      ===================================================== */}

      <div className="hidden lg:block">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
                <Bot
                  size={19}
                  strokeWidth={1.8}
                />

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

          <AIChatConversation
            messages={messages}
            isSending={isSending}
            error={
              error ||
              voiceError
            }
            messagesEndRef={
              messagesEndRef
            }
            onDismissError={
              clearError
            }
            desktop
          />

          <AIChatInput
            input={input}
            setInput={setInput}
            isSending={isSending}
            isRecording={
              isRecording
            }
            isTranscribing={
              isTranscribing
            }
            textareaRef={
              textareaRef
            }
            onSubmit={
              handleSubmit
            }
            onKeyDown={
              handleKeyDown
            }
            onSend={
              sendMessage
            }
            onStartVoice={
              startRecording
            }
            onStopVoice={
              stopRecording
            }
            desktop
          />
        </section>
      </div>

      {/* =====================================================
          MOBILE AI
      ===================================================== */}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex flex-col bg-[#FAFAF8] lg:hidden"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
          >
            <motion.header
              initial={{
                y: -12,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setIsOpen(false)
                  }
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
                onClick={() =>
                  setIsOpen(false)
                }
                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </motion.header>

            <AIChatConversation
              messages={messages}
              isSending={isSending}
              error={
                error ||
                voiceError
              }
              messagesEndRef={
                messagesEndRef
              }
              onDismissError={
                clearError
              }
            />

            <AIChatInput
              input={input}
              setInput={setInput}
              isSending={isSending}
              isRecording={
                isRecording
              }
              isTranscribing={
                isTranscribing
              }
              textareaRef={
                textareaRef
              }
              onSubmit={
                handleSubmit
              }
              onKeyDown={
                handleKeyDown
              }
              onSend={
                sendMessage
              }
              onStartVoice={
                startRecording
              }
              onStopVoice={
                stopRecording
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}