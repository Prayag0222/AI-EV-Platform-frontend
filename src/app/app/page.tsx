"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/services/auth";
import { useState } from "react";
import AppLoadingScreen from "@/components/loading/AppLoadingScreen";


export default function AppEntryPage() {
  const router = useRouter();
  const [loading,setLoading] = useState<boolean>(true)

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
      finally{
        setLoading(false)
      }
    };

    checkAuth();
  }, [router]);

 if (loading) {
  return <AppLoadingScreen />;
}

return null;;
}