"use client";

import React, { useState, useEffect } from "react";
import GlassCard from "@/components/GlassCard";
import TechButton from "@/components/TechButton";
import StatusChip from "@/components/StatusChip";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function EVRepairOSDashboard() {
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  
  const router = useRouter();
  const rawLogs = [
    "INITIATING DIAGNOSTIC PROTOCOL...",
    "CONNECTING TO VEHICLE [ID: EV-77A-902]... CONNECTED",
    "FETCHING KERNEL LOGS... [OK]",
    "ANALYZING INVERTER HARMONICS...",
    "MATCHING FOUND: PREDICTIVE FAILURE DETECTED (CONF: 89%)",
    "CRITICAL NODE COMPONENT: ROTOR_BEARING_A2",
    "RUNNING NEURAL NET SIMULATION...",
    "CALCULATING REMAINING USEFUL LIFE: 142 HOURS",
    "DISPATCHING AUTOMATED MAINTENANCE TICKET... DONE",
    "AWAITING OPERATOR CONFIRMATION..."
  ];

  // Simulated live diagnostic stream inside the cockpit terminal window
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < rawLogs.length) {
        setTerminalLogs((prev) => [...prev, `> ${rawLogs[index]}`]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 1200);
    return () => clearInterval(interval);
  }, );

  const signupHandler = () => {
    router.push("/signup");
  }


  return (
    <div className="relative space-y-8 pb-16 p-10 min-h-screen  md:bg-[url('/grid2.jpg')]  bg-contain bg-top bg-no-repeat  ">
     
      {/* HEADER NAVIGATION SHELL */}
      <header className="flex justify-between items-center  border-b border-white/5 pb-6">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 bg-neon-cyan shadow-[0_0_8px_#00dbe7] rounded-none" />
          <h1 className="font-display font-bold text-lg tracking-wider text-white uppercase">
            EV Repair Intelligence OS
          </h1>
        </div>
        <nav className="hidden md:flex items-center gap-8 font-mono text-xs  text-slate-400">
          <a href="#" className="hover:text-neon-cyan transition-colors">Platform</a>
          <a href="#" className="hover:text-neon-cyan transition-colors">About</a>
          <a href="/login" className="hover:text-neon-cyan transition-colors">Login</a>
          <TechButton onClick={signupHandler} variant="ghost">Sign Up</TechButton>
        </nav>
      </header>

      {/* HERO HERO SECTION MAP */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-4">
        <div className="lg:col-span-5 space-y-6">
          <StatusChip status="online" text="System Online V.2.4" />
          <h2 className="font-display font-bold text-4xl xl:text-5xl tracking-tight text-white uppercase leading-none">
            AI-Driven <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-neon-cyan to-neon-cyan-bright">
              Diagnostics
            </span>
          </h2>
          <p className="font-sans text-sm text-slate-400 leading-relaxed max-w-md">
            Advanced telemetry and predictive maintenance for the next generation of electric fleets. 
            Aerospace precision meets automotive intelligence.
          </p>
          <div className="flex gap-4">
            <TechButton variant="primary">Deploy System</TechButton>
            <TechButton variant="ghost">View Demo</TechButton>
          </div>
        </div>

        {/* SCOOTER TARGET GRAPHIC (Level 2 Matrix Card) */}
        <div className="lg:col-span-7">
          <GlassCard className="relative overflow-hidden min-h-95 flex flex-col justify-between border-neon-cyan/30">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-[10px] uppercase text-slate-500 block">Battery Health</span>
                <span className="font-display font-bold text-3xl text-emerald-go">98.4%</span>
              </div>
              <StatusChip status="optimal" text="Circuit Int. Optimal" />
            </div>
            
            {/* Holographic Wireframe Vector Container Placeholder */}
            <div className="my-4 flex justify-center items-center h-98 bg-radial from-neon-cyan/10 to-transparent rounded-[4px] relative">
              <div className="absolute inset-0 flex items-center justify-center border border-dashed border-neon-cyan/15 rounded-lg m-4">
                <Image 
                fill
                priority
                sizes="h-screen"
                src="/ev_landing.png" alt="Scooter Wireframe" className=" h-32 object-contain opacity-70 animate-pulse-slow" />
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* PRECISION DIAGNOSTICS THREE-COLUMN SUB-GRID */}
      <section className="space-y-4 mt-60">
        <h3 className="font-display font-semibold text-lg text-white uppercase tracking-wide">
          Precision Diagnostics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Telemetry Stream Bar Chart */}
          <GlassCard title="Telemetry Stream" subtitle="Sensors">
            <div className="h-28 flex items-end gap-2 pt-4">
              {[40, 65, 35, 90, 75, 50, 60, 45].map((height, i) => (
                <div key={i} className="flex-1 bg-obsidian-bright/40 rounded-sm h-full flex items-end">
                  <div 
                    style={{ height: `${height}%` }}
                    className={`w-full rounded-sm transition-all duration-500 ${
                      height > 80 ? "bg-emerald-go shadow-emerald-glow/30" : "bg-neon-cyan/70"
                    }`}
                  />
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Card 2: Segmented Circular Diagnostic Progress Bar Gauge */}
          <GlassCard title="Battery Matrix" subtitle="Charging_Full">
            <div className="h-28 flex flex-col items-center justify-center relative">
              <div className="w-24 h-24 rounded-full border-4 border-dashed border-emerald-go/30 flex items-center justify-center animate-[spin_40s_linear_infinite]">
                <div className="w-16 h-16 rounded-full border-2 border-neon-cyan/40" />
              </div>
              <div className="absolute text-center">
                <span className="font-display font-bold text-xl text-white block">88%</span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500">Capacity</span>
              </div>
            </div>
          </GlassCard>

          {/* Card 3: Active Telemetry Fault Tracking Log */}
          <GlassCard title="Active Faults" subtitle="Warning">
            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between items-center bg-obsidian-floor p-2 rounded-[4px] border-l-2 border-orange-500">
                <span className="text-white">INV-892 TEMP ERROR</span>
                <span className="text-orange-400 text-[10px]">48MS AGO</span>
              </div>
              <div className="flex justify-between items-center bg-obsidian-floor p-2 rounded-[4px] border-l-2 border-emerald-go">
                <span className="text-slate-400">MOT-ALIGN-OK</span>
                <span className="text-emerald-go text-[10px]">RESOLVED</span>
              </div>
              <div className="flex justify-between items-center bg-obsidian-floor p-2 rounded-[4px] border-l-2 border-neon-cyan">
                <span className="text-slate-400">SENS-CAL-DONE</span>
                <span className="text-neon-cyan text-[10px]">SYSTEM</span>
              </div>
            </div>
          </GlassCard>

        </div>
      </section>

      {/* INTELLIGENCE LAYER & LIVE TERMINAL FEED */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">
        
        {/* Real-time Streaming Command Console */}
        <div className="lg:col-span-7 ">
          <div className="bg-obsidian-floor border  border-white/10 rounded-[4px] p-4 font-mono text-xs h-60 overflow-y-auto scrollbar-none space-y-2 shadow-inner  bg-linear-to-t from-black to-transparent">
            {terminalLogs.map((log, index) => (
              <div 
                key={index} 
                className={`${log.includes("CRITICAL") || log.includes("FAILURE") ? "text-orange-400  font-bold " : "text-neon-cyan/90"}`}
              >
                {log}
              </div>
            ))}
            <div className="w-2 h-4 bg-neon-cyan animate-pulse inline-block" />
          </div>
        </div>

        {/* Intelligence Layer Functional Context */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-4">
          <div className="flex items-center gap-2 text-neon-cyan">
            <span className="font-mono text-sm">✦</span>
            <h3 className="font-display font-semibold text-xl text-white uppercase tracking-wide">
              Intelligence Layer
            </h3>
          </div>
          <p className="font-sans text-xs text-slate-400 leading-relaxed">
            Our proprietary AI backend doesn&aposl;t just report errors; it anticipates them. By analyzing micro-anomalies in electrical signatures, the OS predicts component degradation before critical failure.
          </p>
          <ul className="space-y-2 font-mono text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <span className="text-emerald-go">✔</span> Real-time spectral analysis of motor currents
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-go">✔</span> Thermal runaway prediction models
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-go">✔</span> Automated part procurement API integration
            </li>
          </ul>
        </div>
      </section>

      {/* FOOTER CANVAS */}
      <footer className="border-t border-white/5 pt-8 mt-12 flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-[10px] text-slate-500">
        <div>
          <p>© 2026 EV REPAIR INTELLIGENCE OS. FRONTIER AUTOMOTIVE PROTOCOL ENABLED.</p>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-white">SYSTEM STATUS</a>
          <a href="#" className="hover:text-white">API DOCUMENTATION</a>
          <a href="#" className="hover:text-white">PRIVACY</a>
          <span className="text-emerald-go font-bold animate-pulse">● ALL SYSTEMS NOMINAL</span>
        </div>
      </footer>

    </div>
  );
}