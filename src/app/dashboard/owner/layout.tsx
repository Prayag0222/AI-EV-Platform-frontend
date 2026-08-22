"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import AddCustomerModal from "@/components/AddCustomerModal";
import { API_BASE } from "@/config/api";
import MobileBottomNav from "@/components/navigation/MobileBottomNav";

interface OwnerLayoutProps {
  children: React.ReactNode;
}

export default function OwnerLayout({ children }: OwnerLayoutProps) {
  const [isCustomerOpen, setIsCustomerOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/auth/me`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setUser(data.user))
      .catch(() => null);
  }, []);

  useEffect(() => {
    const openCustomerModal = () => setIsCustomerOpen(true);
    window.addEventListener("voltops:add-customer", openCustomerModal);
    return () => window.removeEventListener("voltops:add-customer", openCustomerModal);
  }, []);

  return (
   <div className="flex h-screen w-full bg-volt-background text-volt-primary overflow-hidden pb-24  lg:pb-0">
 
      {/* Sidebar — handles both desktop and mobile drawer internally */}
      <Sidebar
        user={user}
        onAddCustomerClick={() => setIsCustomerOpen(true)}
      />

      {/* Main content — pt-14 on mobile to clear the fixed top bar */}
      <main className="flex-1 h-full overflow-x-hidden overflow-y-auto flex flex-col pt-14 pb-24 md:pt-0">
        {children}
      </main>

      <MobileBottomNav />   

      <AddCustomerModal
        isOpen={isCustomerOpen}
        onClose={() => setIsCustomerOpen(false)}
      />
      
    </div>
  );
}
