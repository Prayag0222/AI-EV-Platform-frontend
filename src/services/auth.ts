import { toast } from "react-toastify";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json(); // ← read ONCE only

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }
const user = data.user
  if(data.user.role === 'OWNER' && !data.user.shopId){
    
  toast.warn("Please set up your shop first.")
  return { user, setShowShopModal: true }
  }
  

  // ← remove the shop fetch from here entirely
  // shop check is handled by dashboard page via 403 modal

  return data; // data has hasShop, shopId, role etc.
}

export async function getCurrentUser() {
  const response = await fetch(`${API_URL}/auth/me`, {
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unauthorized");
  }

  return data;
}

export async function logout() {
  await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}

export async function createShop(shopName:string,shopPhone:string,gstNumber:string,shopAddress:string) {

  const response = await fetch(`${API_URL}/shop/create`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ shopName, shopPhone, gstNumber, shopAddress }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Shop creation failed");
  }

  return data;
}