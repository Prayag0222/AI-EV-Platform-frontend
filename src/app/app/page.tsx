"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/services/auth";

export default function AppEntryPage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { user } = await getCurrentUser();

        if (user.role === "OWNER") {
          router.replace("/dashboard/owner");
          return;
        }

        if (user.role === "TECHNICIAN") {
          router.replace("/dashboard/technician");
          return;
        }

        router.replace("/login");
      } catch {
        router.replace("/login");
      }
    };

    checkAuth();
  }, [router]);

  return null;
}