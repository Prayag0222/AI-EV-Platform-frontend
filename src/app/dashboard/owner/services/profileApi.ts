const API_URL =
  process.env.NEXT_PUBLIC_API_URL

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: string;
  shopName: string | null;
  shopAddress: string | null;
  gstNumber: string | null;
  shopPhone: string | null;
}

export async function getProfile() {
  const response = await fetch(
    `${API_URL}/profile/me`,
    {
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load profile");
  }

  return data as Profile;
}

export async function updateProfile(payload: {
  name?: string;
  shopName?: string;
  shopAddress?: string;
  gstNumber?: string;
  shopPhone?: string;
}) {
  const response = await fetch(
    `${API_URL}/profile/me`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update profile");
  }

  return data;
}