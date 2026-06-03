import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

export default function GlassCard({ children, className = "", title, subtitle }: GlassCardProps) {
  return (
    <div className={`glass-active rounded-[4px] p-6 transition-all duration-300 hover:shadow-cyan-glow/10 ${className}`}>
      {title && (
        <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
          <h3 className="font-mono text-xs uppercase tracking-widest text-slate-400">{title}</h3>
          {subtitle && <span className="font-mono text-xs text-neon-cyan">{subtitle}</span>}
        </div>
      )}
      {children}
    </div>
  );
}