"use client";
import {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';

interface userSession {
    id:string;
    email:string;
    role:'OWNER' | 'TECHNICIAN';
}

export default function OwnerDashboard() {


    const router = useRouter();
    const [user, setUser] = useState<userSession | null>(null);
    const[loading,setLoading] = useState(true);


    useEffect(()=>{
        const verifySession = async ()=>{
            try{
                const response = await fetch('http://localhost:3000/api/auth/me',
                    {method:"GET",
                        credentials:"include"
                    });

                    const data = await response.json();

                    // strict 2 role guardrail validationn check 
                    if (response.ok && (data.user.role === 'OWNER' || data.user.role === 'TECHNICIAN')) {
                        setUser(data.user);
                    }else{
                        //if token fails kick them out 
                        console.warn('⚠️ Access Denied: Invalid session or insufficient privileges.');
                        alert('Access Denied. Please log in with appropriate credentials.');
                        router.push('/login'

                        )
                    }
            } catch(error){
                console.error('Session verification failed:', error);
                router.push('/login');

            } finally {setLoading(false)}
        }
        verifySession();
    },[router]);

    if(loading){
        return(
            <div className="min-h-screen bg-[#121416] flex items-center justify-center text-[#c0c9c1] font-tech text-sm">
        ⚡ INITIALIZING PLATFORM TELEMETRY GRID...
            </div>
        );
    }


    return (
    <div className="min-h-screen bg-[#121416] text-white p-6 font-body selection:bg-[#a1d1b4]/20">
        <div className="max-w-6xl mx-auto space-y-6">
        {/* ─── MASTER PLATFORM NAVIGATION HEADER ─── */}
        <header className="flex items-center justify-between border-b border-[#333537]/50 pb-5">
            <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#a1d1b4] text-3xl">
                electric_bolt
            </span>
            <h1 className="font-headline text-xl font-bold tracking-tight">
                AI-EV CORE
            </h1>
            </div>
            <div className="bg-[#1e2022] border border-[#333537] px-4 py-2 rounded-xl flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#a1d1b4] animate-pulse" />
            <span className="font-tech text-xs text-[#c0c9c1] tracking-wide">
                {user?.email}
            </span>
            </div>
        </header>

        {/* ─── CONDITIONAL LAYOUT CONTROL TOWER ─── */}
        {user?.role === "OWNER" ? (
          /* 👑 OWNER EXECUTIVE OVERVIEW INTERFACE */
        <main className="space-y-6 animate-fade-in">
            <div className="p-1 border border-dashed border-[#a1d1b4]/30 rounded-2xl">
            <div className="bg-[#1e2022] border border-[#333537] p-8 rounded-xl space-y-2">
                <span className="font-tech text-xs text-[#a1d1b4] tracking-widest font-bold">
                OPERATOR PRIVILEGES: MASTER LEVEL
                </span>
                <h2 className="font-headline text-3xl font-black tracking-tight text-white">
                Owner Operations Center
                </h2>
                <p className="text-[#c0c9c1] text-sm max-w-xl">
                    Welcome to the control center. You have complete global
                    read/write visibility across charging nodes, financial logs,
                    and active fleet ticket states.
                </p>
            </div>
            </div>

            {/* Micro Grid Panels for Owner */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#1e2022] border border-[#333537] p-5 rounded-xl">
                <p className="font-tech text-xs text-[#c0c9c1] uppercase tracking-wider">
                    Financial Revenue Grid
                </p>
                <p className="text-2xl font-headline font-bold mt-2 text-[#a1d1b4]">
                    $14,842.50
                </p>
            </div>
            <div className="bg-[#1e2022] border border-[#333537] p-5 rounded-xl">
                <p className="font-tech text-xs text-[#c0c9c1] uppercase tracking-wider">
                    Connected EV Stations
                </p>
                <p className="text-2xl font-headline font-bold mt-2 text-white">
                    12 Nodes Online
                </p>
                </div>
            </div>
            </main>
        ) : (
          /* 🛠️ TECHNICIAN MAINTENANCE LOGS INTERFACE */
            <main className="space-y-6 animate-fade-in">
            <div className="p-1 border border-dashed border-[#c0c9c1]/20 rounded-2xl">
                <div className="bg-[#1e2022] border border-[#333537] p-8 rounded-xl space-y-2">
                <span className="font-tech text-xs text-[#c0c9c1] tracking-widest font-bold">
                    OPERATOR PRIVILEGES: MAINTENANCE BAY
                </span>
                <h2 className="font-headline text-3xl font-black tracking-tight text-white">
                    Technician Work Environment
                </h2>
                <p className="text-[#c0c9c1] text-sm max-w-xl">
                    Station diagnostic terminal active. Use this console to
                    evaluate system hardware fault codes, service queue tickets,
                    and asset repair manifests.
                </p>
                </div>
            </div>

            {/* Micro Grid Panels for Technician */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#1e2022] border border-[#333537] p-5 rounded-xl">
                <p className="font-tech text-xs text-[#c0c9c1] uppercase tracking-wider">
                    Assigned Repair Tickets
                </p>
                <p className="text-2xl font-headline font-bold mt-2 text-[#a1d1b4]">
                    4 Urgent Faults
                </p>
                </div>
                <div className="bg-[#1e2022] border border-[#333537] p-5 rounded-xl">
                <p className="font-tech text-xs text-[#c0c9c1] uppercase tracking-wider">
                    System Temperature Core
                </p>
                <p className="text-2xl font-headline font-bold mt-2 text-white">
                    42°C Optimal
                </p>
                </div>
            </div>
            </main>
        )}
        </div>
    </div>
    );
}