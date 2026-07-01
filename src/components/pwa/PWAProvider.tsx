"use client";

import { useEffect } from "react";
import { registerPWA } from "@/lib/pwa/pwa";

export default function PWAProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    console.log("✅ PWAProvider Mounted");
    registerPWA();
  }, []);

  return <>{children}</>;
}