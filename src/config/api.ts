const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error(
    "NEXT_PUBLIC_API_URL is missing"
  );
}

export const API_BASE = apiUrl;