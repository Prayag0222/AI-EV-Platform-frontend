"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";


function TicketRow({ model, issue, status, statusColor, delay }: {
  model: string; issue: string; status: string; statusColor: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.45, ease: "easeOut" }}
      className="flex items-center justify-between py-3 border-b border-black/[0.05] last:border-0 group">
      <div className="flex items-center gap-3">
        {/* EV bolt icon */}
        <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-slate-200 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
        </div>
        <div>
          <p className="text-[13px] font-semibold text-slate-800 leading-none mb-0.5">{model}</p>
          <p className="text-[11px] text-slate-400">{issue}</p>
        </div>
      </div>
      <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${statusColor}`}>{status}</span>
    </motion.div>
  );
}


// ── Main ─────────────────────────────────────────────────────────────────────
export default function HeroSection() {
  const router = useRouter();

  return (
    <>
      <style>{`
        @keyframes ping { 75%,100%{transform:scale(2);opacity:0} }
        @keyframes float-card { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
      `}</style>

      <section className="relative bg-[#F8F7F4] overflow-hidden">

        {/* ── Subtle grid texture ── */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, #00000008 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

        {/* ── Top accent line ── */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

        {/* ── Navbar ── */}
        <header className="relative z-50 flex items-center justify-between px-8 md:px-14 py-5 border-b border-black/[0.07] bg-[#F8F7F4]/80"
          style={{ backdropFilter: "blur(12px)" }}>
          <div className="flex items-center gap-2.5">
            {/* Logo mark */}
            <div className="h-7 w-7 rounded-lg bg-[#111] flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <span className="text-[15px] font-bold text-slate-900 tracking-tight">VoltOps</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-[13px] text-slate-500">
            {["Features", "How It Works", "Pricing"].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`}
                className="hover:text-slate-900 transition-colors">{item}</a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/login")}
              className="text-[13px] text-slate-500 hover:text-slate-900 transition-colors px-4 py-2">
              Sign in
            </button>
            <button onClick={() => router.push("/signup")}
              className="text-[13px] font-medium bg-[#111] text-white px-5 py-2.5 rounded-lg hover:bg-black transition-colors shadow-sm">
              Get started →
            </button>
          </div>
        </header>

        {/* ── Hero body ── */}
        <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-14 pt-20 pb-28
                        grid lg:grid-cols-[1fr_1.05fr] gap-16 items-center">

          {/* ── LEFT: Copy ── */}
          <div>
           

            {/* Headline */}
            <div className="overflow-hidden mb-1">
              <motion.h1 initial={{ y: "110%" }} animate={{ y: 0 }}
                transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-[clamp(2.8rem,6vw,4.6rem)] font-black text-[#0D0D0D] leading-[0.9] tracking-[-0.035em]">
                Your Workshop
              </motion.h1>
            </div>
            <div className="overflow-hidden mb-1">
              <motion.h1 initial={{ y: "110%" }} animate={{ y: 0 }}
                transition={{ duration: 0.75, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="text-[clamp(2.8rem,6vw,4.5rem)] font-black text-[#0D0D0D] leading-[0.9] tracking-[-0.035em]">
                Has a Memory.
              </motion.h1>
            </div>
            <div className="overflow-hidden">
              <motion.h1 initial={{ y: "110%" }} animate={{ y: 0 }}
                transition={{ duration: 0.75, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
                className="text-[clamp(2.8rem,6vw,4.5rem)] font-black leading-[1.2] tracking-[-0.035em]"
                style={{ color: "#6B7280" }}>
                Now It Thinks.
              </motion.h1>
            </div>

            {/* Body */}
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-8 text-[16px] text-slate-500 leading-[1.75] max-w-md">
              VoltOps connects every repair, technician, part and customer into
              one intelligent system — so your workshop gets faster with every job it completes.
            </motion.p>

            

            {/* CTAs */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.82, duration: 0.5 }}
              className="mt-8 flex flex-wrap items-center gap-4">
              <button onClick={() => router.push("/signup")}
                className="bg-[#111] text-white text-[14px] font-semibold px-7 py-3.5 rounded-xl
                           hover:bg-black transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                sign in
              </button>
            
            </motion.div>

            
          </div>

          {/* ── RIGHT: Dashboard panel ── */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden lg:block"
            style={{ animation: "float-card 6s ease-in-out infinite" }}>

            {/* Glow */}
            <div className="absolute -inset-8 bg-gradient-to-br from-slate-200/50 via-transparent to-slate-100/30 rounded-3xl blur-2xl" />

            {/* Main card */}
            <div className="relative bg-white rounded-2xl border border-black/[0.08] shadow-2xl overflow-hidden">

              {/* Window bar */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-black/[0.06] bg-slate-50/60">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400/70" />
                  <div className="h-3 w-3 rounded-full bg-amber-400/70" />
                  <div className="h-3 w-3 rounded-full bg-emerald-400/70" />
                </div>
                <div className="flex items-center gap-2 bg-white border border-black/[0.07] rounded-md px-3 py-1">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  <span className="text-[11px] text-slate-400">app.voltops.io</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[11px] text-slate-400">Live</span>
                </div>
              </div>

              <div className="flex">
                {/* Sidebar */}
                <div className="w-44 border-r border-black/[0.05] p-3 bg-slate-50/40">
                  <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest px-2 mb-2">Workspace</p>
                  {[
                    { label: "Dashboard", icon: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", active: true },
                    { label: "Repair Tickets", icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2", active: false },
                    { label: "Customers", icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", active: false },
                    { label: "Inventory", icon: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z", active: false },
                    { label: "AI Diagnostics", icon: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 6v4l3 3", active: false },
                  ].map(({ label, icon, active }) => (
                    <div key={label}
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg mb-0.5 cursor-default ${active ? "bg-white shadow-sm border border-black/[0.06]" : "hover:bg-white/60"}`}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                        className={active ? "text-slate-800" : "text-slate-400"}>
                        <path d={icon} />
                      </svg>
                      <span className={`text-[12px] ${active ? "font-semibold text-slate-800" : "text-slate-500"}`}>{label}</span>
                    </div>
                  ))}
                </div>

                {/* Main panel */}
                <div className="flex-1 p-4 min-w-0">
                  {/* KPI row */}
                  <div className="grid grid-cols-3 gap-2.5 mb-4">
                    {[
                      { label: "Open", value: "24", color: "text-slate-800", bg: "bg-slate-50" },
                      { label: "In Progress", value: "11", color: "text-amber-600", bg: "bg-amber-50" },
                      { label: "Done Today", value: "7", color: "text-emerald-600", bg: "bg-emerald-50" },
                    ].map((k) => (
                      <div key={k.label} className={`${k.bg} rounded-xl p-3 border border-black/[0.04]`}>
                        <p className={`text-xl font-black ${k.color}`}>{k.value}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{k.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Ticket list */}
                  <div className="bg-slate-50/60 rounded-xl border border-black/[0.05] px-3 pt-2 pb-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Live Queue</p>
                      <span className="text-[10px] text-slate-400">3 active</span>
                    </div>
                    <TicketRow model="Ather 450X" issue="Battery BMS fault" status="AI Diagnosing"
                      statusColor="bg-blue-50 text-blue-600 border border-blue-100" delay={0.7} />
                    <TicketRow model="Ola S1 Pro" issue="Charging port failure" status="In Progress"
                      statusColor="bg-amber-50 text-amber-600 border border-amber-100" delay={0.82} />
                    <TicketRow model="TVS iQube" issue="Regen brake calibration" status="Awaiting Parts"
                      statusColor="bg-slate-100 text-slate-500 border border-slate-200" delay={0.94} />
                  </div>

                  {/* AI insight card */}
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1, duration: 0.5 }}
                    className="mt-2.5 bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100 rounded-xl p-3">
                    <div className="flex items-start gap-2.5">
                      <div className="h-6 w-6 rounded-lg bg-violet-100 flex items-center justify-center shrink-0 mt-0.5">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-violet-600">
                          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-violet-700">AI Insight</p>
                        <p className="text-[11px] text-violet-600 mt-0.5 leading-relaxed">
                                                  AI Insight

                          Similar issue found in 4 previous repair tickets.
                          Recommended checks:
                          • Battery balancing status
                          • Controller temperature logs
                          • Charging connector continuity
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Floating badge — top right */}
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.4, type: "spring" }}
              className="absolute -top-4 -right-4 bg-white border border-black/[0.08] rounded-xl px-3 py-2 shadow-lg flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
                </svg>
              </div>
              <div>
                <p className="text-[12px] font-bold text-slate-800">40% faster</p>
                <p className="text-[10px] text-slate-400">avg. diagnosis time</p>
              </div>
            </motion.div>

            {/* Floating badge — bottom left */}
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.35, duration: 0.4, type: "spring" }}
              className="absolute -bottom-4 -left-4 bg-white border border-black/[0.08] rounded-xl px-3 py-2 shadow-lg flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-violet-50 flex items-center justify-center">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-violet-500">
                  <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <div>
                <p className="text-[12px] font-bold text-slate-800">AI matched</p>
                <p className="text-[10px] text-slate-400">14k repair logs</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

       

      </section>
    </>
  );
}