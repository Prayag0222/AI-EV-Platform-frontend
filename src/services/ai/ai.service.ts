import { API_BASE } from "@/config/api";

export interface AIMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AIChatRequest {
  ticketId: number;
  message: string;
}

export interface AIChatResponse {
  success: boolean;
  response: string;
}

export interface AIConversationResponse {
  success: boolean;
  messages: AIMessage[];
}

export async function sendAIMessage({
  ticketId,
  message,
}: AIChatRequest): Promise<string> {
  const response = await fetch(`${API_BASE}/ai/chat`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ticketId,
      message,
    }),
  });

  if (!response.ok) {
    let errorMessage = "Unable to reach VoltOps AI.";

    try {
      const errorData = await response.json();

      if (typeof errorData?.message === "string") {
        errorMessage = errorData.message;
      }

      if (typeof errorData?.error === "string") {
        errorMessage = errorData.error;
      }
    } catch {
      // Keep fallback message.
    }

    throw new Error(errorMessage);
  }

  const data: AIChatResponse = await response.json();

  if (!data.success || typeof data.response !== "string") {
    throw new Error("VoltOps AI returned an invalid response.");
  }

  return data.response;
}

export async function getAIConversation(
  ticketId: number
): Promise<AIMessage[]> {
  const response = await fetch(
    `${API_BASE}/ai/chat/${ticketId}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    let errorMessage =
      "Unable to load the AI conversation.";

    try {
      const errorData = await response.json();

      if (typeof errorData?.message === "string") {
        errorMessage = errorData.message;
      }

      if (typeof errorData?.error === "string") {
        errorMessage = errorData.error;
      }
    } catch {
      // Keep fallback message.
    }

    throw new Error(errorMessage);
  }

  const data: AIConversationResponse =
    await response.json();

  if (
    !data.success ||
    !Array.isArray(data.messages)
  ) {
    throw new Error(
      "VoltOps AI returned an invalid conversation."
    );
  }

  return data.messages;
}