import { OwnerDashboardPayload } from "../types/ownerDashboard";

// Points directly to your Express engine dashboard routing group
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * Syncs the dashboard data mapping vectors directly from your backend database pool.
 * Fully compliant with strict linting guidelines, ensuring type safety without any loss of data precision.
 */
export async function fetchOwnerDashboardMetrics(): Promise<OwnerDashboardPayload> {
  const response = await fetch(`${API_BASE_URL}/owner/dashboard`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    // Allows immediate updates when refreshing the manager dashboard panel
    cache: 'no-store', 
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => ({}));
    throw new Error(
      errorPayload.message || 'Failed to establish synchronization link with VoltOps database streams.'
    );
  }

  

  return response.json();
}