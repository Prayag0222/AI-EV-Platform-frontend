export async function registerPWA() {
  if (typeof window === "undefined") return;

  if (!("serviceWorker" in navigator)) return;

  try {
    const registration = await navigator.serviceWorker.register("/sw.js");

    console.log("✅ Service Worker Registered", registration);
  } catch (error) {
    console.error("❌ Service Worker Registration Failed", error);
  }
}