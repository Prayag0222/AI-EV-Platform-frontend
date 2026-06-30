"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import AddCustomerModal from "@/components/AddCustomerModal";

const API = process.env.NEXT_PUBLIC_API_URL;

interface OwnerLayoutProps {
  children: React.ReactNode;
}

export default function OwnerLayout({ children }: OwnerLayoutProps) {
  const [isCustomerOpen, setIsCustomerOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    fetch(`${API}/auth/me`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setUser(data.user))
      .catch(() => null);
  }, []);

  return (
    <div className="flex h-screen w-full bg-volt-background text-volt-primary overflow-hidden">

      {/* Sidebar — handles both desktop and mobile drawer internally */}
      <Sidebar
        user={user}
        onAddCustomerClick={() => setIsCustomerOpen(true)}
      />

      {/* Main content — pt-14 on mobile to clear the fixed top bar */}
      <main className="flex-1 h-full overflow-x-hidden overflow-y-auto flex flex-col pt-14 md:pt-0">
        {children}
      </main>

      <AddCustomerModal
        isOpen={isCustomerOpen}
        onClose={() => setIsCustomerOpen(false)}
      />
    </div>
  );
}