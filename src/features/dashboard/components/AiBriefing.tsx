import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { AIBriefing } from '@/types/dashboard';

// 1. Defining the contract for what data this specific component requires
interface AiBriefingProps {
  data: AIBriefing;
}

export default function AiBriefing({ data }: AiBriefingProps) {
  return (
    <div className="flex flex-col">
      {/* 🏷️ SECTION LABEL */}
      <h3 className="font-display text-lg font-semibold tracking-wide text-volt-primary mb-6">
        AI Briefing
      </h3>
      
      {/* 🌌 THE LUXURY LUXURY DARK CANVAS CONTAINER */}
      <div className="flex-1 p-8 bg-volt-darkCard text-white rounded-container flex flex-col justify-between shadow-lg relative overflow-hidden group min-h-95">
        
        {/* ✨ STEP 2: SUBTLE BACKGROUND GLOW (AMBIENT LIGHT EFFECT) */}
        <div className="absolute -top-10 -right-10 h-40 w-40 bg-volt-secondary/20 rounded-full blur-3xl pointer-events-none transition-transform duration-700 group-hover:scale-125" />
        
        {/* 🧠 UPPER SECTION: INSIGHT AND TEXT CONTENT */}
        <div>
          {/* Sparkles Badge Label */}
          <div className="flex items-center gap-2 text-volt-secondary">
            <Sparkles className="h-4 w-4 fill-current text-teal-400 stroke-[1.5]" />
            <span className="font-display text-xs font-semibold tracking-widest uppercase text-teal-400">
              System Insight
            </span>
          </div>
          
          {/* Main Large Editorial Core text */}
          <p className="mt-6 font-display text-xl font-medium tracking-tight leading-relaxed text-slate-100">
            {data.insight} <span className="text-teal-400 font-semibold">{data.metricIncrease}</span>
          </p>

          {/* 🔍 STEP 3: HIGH-STAKES FOCUS BOX (MOST AFFECTED MODEL) */}
          <div className="mt-8 p-4 bg-slate-800/40 border border-slate-700/50 rounded-volt backdrop-blur-sm">
            <span className="font-display text-[10px] font-bold tracking-widest uppercase text-slate-400 block">
              Most Affected Model
            </span>
            <div className="font-display text-lg font-semibold text-white mt-1">
              {data.mostAffectedModel}
            </div>
          </div>
        </div>

        {/* 🎯 LOWER SECTION: PT-6 ACTION BUTTON ACTION ANCHOR */}
        <div className="mt-8 pt-6 border-t border-slate-800/60 flex flex-col gap-3">
          <span className="font-sans text-xs text-slate-400">
            Recommended action:
          </span>
          
          {/* Interactive Link Trigger */}
          <button className="flex items-center justify-between text-left font-display text-sm font-medium text-teal-400 group-hover:text-teal-300 transition-colors w-full cursor-pointer">
            <span>{data.recommendedAction}</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 stroke-[2]" />
          </button>
        </div>

      </div>
    </div>
  );
}