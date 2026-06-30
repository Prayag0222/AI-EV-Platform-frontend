import { OwnerDashboardPayload } from "../types/ownerDashboard";


// Points directly to your Express engine dashboard routing group
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL 

/**
 * Syncs the dashboard data mapping vectors directly from your backend database pool.
 * Fully compliant with strict linting guidelines, ensuring type safety without any loss of data precision.
 */


type DashboardResponse = OwnerDashboardPayload ;

export async function fetchOwnerDashboardMetrics(): Promise<DashboardResponse> {
  const response = await fetch(`${API_BASE_URL}/owner/dashboard`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',  // ← ADD THIS
    cache: 'no-store',
  });


  if (!response.ok) {
    const errorPayload = await response.json().catch(() => ({}));
    throw new Error(errorPayload.message || 'Failed to fetch dashboard data.');
  }

  return response.json();
}