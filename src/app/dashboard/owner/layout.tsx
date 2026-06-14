"use client"
import React,{useState} from 'react';
import Sidebar from '@/components/Sidebar';
import AddCustomerModal from '@/components/AddCustomerModal';

interface OwnerLayoutProps {
  children: React.ReactNode;
}

export default function OwnerLayout({ children }: OwnerLayoutProps) {

const [isCustomerOpen, setIsCustomerOpen] = useState<boolean>(false);

  return (
    <div className="flex h-screen w-full bg-volt-background text-volt-primary overflow-hidden">
      
      {/* 🧭 PERMANENT LEFT SIDEBAR CONTROL PANEL */}
      <aside className="w-64 h-full bg-volt-surface border-r border-volt-container hidden md:block shrink-0">
        <Sidebar onAddCustomerClick={() => setIsCustomerOpen(true)} />
      </aside>

      {/* 🚀 DYNAMIC CONTENT VIEWPORT LAYER */}
      <main className="flex-1 h-full overflow-x-hidden overflow-y-auto flex flex-col">
        {children} {/* <-- This is exactly where page.tsx gets injected automatically! */}
      </main>

      <AddCustomerModal 
        isOpen={isCustomerOpen} 
        onClose={() => setIsCustomerOpen(false)} 
      />

    </div>
  );
}