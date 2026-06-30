import { API_BASE } from "@/config/api";

export interface UpdateOperationStatusPayload {
  ticketId: number;
  status: string;
}

export async function updateOperationStatus({
 ticketId,
  status,
}: UpdateOperationStatusPayload) {
  const response = await fetch(
    `${API_BASE}/technician/workspace/${ticketId}/status`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
       newStatus:status,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Failed to update operation."
    );
  }

  return data;
}