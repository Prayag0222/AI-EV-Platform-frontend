import React from "react";

interface TechButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
  children: React.ReactNode;
}

export default function TechButton({ variant = "primary", children, className = "", ...props }: TechButtonProps) {
  const baseStyle = "px-6 py-2.5 font-mono text-xs uppercase tracking-wider rounded-[4px] transition-all duration-200 cursor-pointer font-semibold";
  const styles = {
    primary: "bg-neon-cyan text-obsidian hover:bg-neon-cyan-bright hover:shadow-[0_0_15px_rgba(0,219,231,0.6)]",
    ghost: "border border-neon-cyan/40 bg-neon-cyan/5 text-neon-cyan hover:border-neon-cyan hover:bg-neon-cyan/10"
  };

  return (
    <button className={`${baseStyle} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}