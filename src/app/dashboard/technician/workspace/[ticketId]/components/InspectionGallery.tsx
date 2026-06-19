// src/app/technician/workspace/[ticketId]/components/InspectionGallery.tsx
"use client";

import React from "react";
import { Camera, Plus, Battery, Gauge, Activity, Zap, ThermometerSun } from "lucide-react";

export function InspectionGallery() {
  // Define the 5 high-priority diagnostic zones from your layout specification
  const zones = [
    { 
      label: "Battery Pack", 
      bgStyle: "from-teal-500/5 to-emerald-500/5 text-teal-700 border-teal-100/70", 
      icon: <Battery className="h-6 w-6" strokeWidth={1.8} /> 
    },
    { 
      label: "Controller", 
      bgStyle: "from-amber-500/5 to-orange-500/5 text-amber-700 border-amber-100/70", 
      icon: <Gauge className="h-6 w-6" strokeWidth={1.8} /> 
    },
    { 
      label: "Motor", 
      bgStyle: "from-slate-500/5 to-slate-600/5 text-slate-700 border-slate-200/70", 
      icon: <Activity className="h-6 w-6" strokeWidth={1.8} /> 
    },
    { 
      label: "Connector", 
      bgStyle: "from-emerald-500/5 to-teal-500/5 text-emerald-700 border-emerald-100/70", 
      icon: <Zap className="h-6 w-6" strokeWidth={1.8} /> 
    },
    { 
      label: "Damage Spec", 
      bgStyle: "from-red-500/5 to-amber-500/5 text-red-600 border-red-100/70", 
      icon: <ThermometerSun className="h-6 w-6" strokeWidth={1.8} /> 
    },
  ];

  const handleCameraCapture = () => {
    console.log("📸 Initializing native hardware system camera capture layer...");
    // Wire up future device media streams safely here
  };

  return (
    <section className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-5 font-sans">
      
      {/* Component Header Block */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-base font-bold tracking-tight text-slate-900 font-display">
            Inspection Photos
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Tap an image block to review or attach assets with local hardware.
          </p>
        </div>
        
        <button 
          onClick={handleCameraCapture}
          className="h-9 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
        >
          <Camera className="h-3.5 w-3.5" /> Capture Photo
        </button>
      </div>

      {/* Expensive Aspect-Ratio Responsive Picture Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {zones.map((zone, index) => (
          <button
            key={index}
            className="group relative aspect-[4/3] rounded-xl bg-slate-50 border border-slate-200/60 overflow-hidden hover:border-slate-400 transition-all text-left"
          >
            {/* Subtle light background gradient depth match */}
            <div className={`absolute inset-0 bg-gradient-to-br ${zone.bgStyle}`} />
            
            {/* Central Soft Silhouette Graphic */}
            <div className="absolute inset-0 grid place-items-center opacity-70 group-hover:scale-105 group-hover:opacity-100 transition-all">
              {zone.icon}
            </div>

            {/* Bottom Label Overlay */}
            <div className="absolute bottom-0 inset-x-0 p-2.5 bg-gradient-to-t from-slate-900/40 via-slate-900/10 to-transparent">
              <span className="text-[10px] font-bold text-white tracking-wide uppercase">
                {zone.label}
              </span>
            </div>
          </button>
        ))}

        {/* Tail Dynamic Block: Upload Append Button Trigger */}
        <button className="aspect-[4/3] rounded-xl border border-dashed border-slate-300 bg-slate-50/40 grid place-items-center text-slate-400 hover:text-slate-600 hover:border-slate-400 transition-all">
          <div className="flex flex-col items-center gap-1 text-center">
            <Plus className="h-4 w-4" />
            <span className="text-[10px] font-bold tracking-wide uppercase">Add Slot</span>
          </div>
        </button>
      </div>

    </section>
  );
}