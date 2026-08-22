"use client";

import {
  Loader2,
  MessageSquare,
  Mic,
  Send,
  Square,
} from "lucide-react";

import type {
  ChatInputProps,
} from "../types/ai-chat.types";

export function AIChatInput({
  input,
  setInput,
  isSending,
  isRecording,
  isTranscribing,
  textareaRef,
  onSubmit,
  onKeyDown,
  onSend,
  onStartVoice,
  onStopVoice,
  desktop = false,
}: ChatInputProps) {
  const voiceDisabled =
    isSending || isTranscribing;

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
            onChange={(event) =>
              setInput(event.target.value)
            }
            onKeyDown={onKeyDown}
            disabled={isSending || isTranscribing}
            rows={2}
            placeholder={
              isRecording
                ? "Listening..."
                : isTranscribing
                  ? "Transcribing..."
                  : "Ask about this repair..."
            }
            className="max-h-32 min-h-[48px] w-full resize-none bg-transparent px-2 py-1 text-sm font-medium leading-6 text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
          />

          <div className="flex items-center justify-between gap-2 px-1 pt-1">
            <div className="flex items-center gap-1.5">
              <MessageSquare
                size={13}
                className="text-slate-300"
              />

              <span className="text-[9px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                {isRecording
                  ? "Listening"
                  : isTranscribing
                    ? "Transcribing"
                    : "Repair context active"}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Voice */}
              <button
                type="button"
                onClick={() => {
                  if (isRecording) {
                    onStopVoice();
                  } else {
                    void onStartVoice();
                  }
                }}
                disabled={voiceDisabled}
                className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all ${
                  isRecording
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                } disabled:cursor-not-allowed disabled:opacity-50`}
                aria-label={
                  isRecording
                    ? "Stop voice recording"
                    : "Start voice recording"
                }
              >
                {isTranscribing ? (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                ) : isRecording ? (
                  <Square size={15} />
                ) : (
                  <Mic size={16} />
                )}
              </button>

              {/* Send */}
              <button
                type="button"
                onClick={() => void onSend()}
                disabled={
                  !input.trim() ||
                  isSending ||
                  isRecording ||
                  isTranscribing
                }
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

          {isRecording && (
            <div className="mt-2 flex items-center gap-2 px-2 pb-1 text-[10px] font-semibold text-red-500">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
              Recording voice input...
            </div>
          )}

          {isTranscribing && (
            <div className="mt-2 flex items-center gap-2 px-2 pb-1 text-[10px] font-semibold text-slate-500">
              <Loader2
                size={12}
                className="animate-spin"
              />
              Converting voice to text...
            </div>
          )}
        </div>

        <p className="mt-2 px-1 text-[9px] font-medium text-slate-400">
          Enter to send · Shift + Enter for a new line
        </p>
      </form>
    </div>
  );
}