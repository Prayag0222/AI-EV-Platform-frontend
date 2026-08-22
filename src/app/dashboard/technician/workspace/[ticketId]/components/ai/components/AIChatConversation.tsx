"use client";

import { Bot, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import type {
  ChatConversationProps,
} from "../types/ai-chat.types";

export function AIChatConversation({
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
      {messages.length === 1 && !isSending && (
        <div className="mb-6 flex items-center gap-2 px-1">
          <Sparkles
            size={13}
            className="text-slate-400"
          />

          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            Repair context loaded
          </p>
        </div>
      )}

      <div className="space-y-4">
        {messages.map((message) => {
          const isUser =
            message.role === "user";

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
                isUser
                  ? "justify-end"
                  : "justify-start"
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
                    <Bot
                      size={13}
                      className="text-slate-500"
                    />

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

        {isSending && (
          <motion.div
            initial={{
              opacity: 0,
              y: 6,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="flex justify-start"
          >
            <div className="rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[0, 120, 240].map(
                    (delay) => (
                      <span
                        key={delay}
                        className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"
                        style={{
                          animationDelay: `${delay}ms`,
                        }}
                      />
                    )
                  )}
                </div>

                <span className="text-[10px] font-semibold text-slate-400">
                  Analyzing repair context...
                </span>
              </div>
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{
                opacity: 0,
                y: 5,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: 5,
              }}
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
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}