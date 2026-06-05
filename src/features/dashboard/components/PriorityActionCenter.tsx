import React from 'react';
import { AlertTriangle, Wrench, Users, Clock } from 'lucide-react';
import { PriorityActionCard, ActionCardType } from '@/types/dashboard';

// 1. Defining the Component Props interface
interface PriorityActionCenterProps {
  cards: PriorityActionCard[];
}

// 2. Creating a standalone lookup engine for our icons
const iconMap: Record<ActionCardType, React.ComponentType<{ className?: string }>> = {
  urgent: AlertTriangle,
  parts: Wrench,
  capacity: Users,
  warning: Clock,
};

export default function PriorityActionCenter({ cards }: PriorityActionCenterProps) {
  return (
    <div className="w-full">
      {/* SECTION HEADER LABELED BY GEIST FONT */}
      <h3 className="font-display text-lg font-semibold tracking-wide text-volt-primary mb-6">
        Priority Action Center
      </h3>
      
      {/* 2x2 RESPONSIVE ARCHITECTURAL LAYOUT GRID */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {cards.map((card) => {
          // Dynamically fetch the correct icon component based on the card type
          const IconComponent = iconMap[card.type];
          
          return (
            <div 
              key={card.id} 
              className="flex flex-col justify-between p-6 bg-volt-surface border border-volt-container rounded-container shadow-[0_4px_6px_-1px_rgba(30,41,59,0.02),0_2px_4px_-2px_rgba(30,41,59,0.01)] hover:border-volt-secondary/30 transition-all duration-200"
            >
              {/* TOP ROW: ICON + HIGHLIGHTED COUNT BADGE */}
              <div className="flex items-start justify-between">
                <div className={`p-2 rounded-volt ${
                  card.type === 'urgent' ? 'bg-red-50 text-volt-terracotta' :
                  card.type === 'parts' ? 'bg-teal-50 text-volt-secondary' :
                  card.type === 'capacity' ? 'bg-amber-50 text-amber-800' : 'bg-slate-50 text-slate-500'
                }`}>
                  <IconComponent className="h-5 w-5 stroke-[1.75]" />
                </div>
                
                {/* Micro Chip Badge wrapper */}
                <span className={`font-display font-semibold text-xs tracking-wider px-2.5 py-1 rounded-volt ${
                  card.type === 'urgent' ? 'bg-red-50 text-volt-terracotta' :
                  card.type === 'capacity' ? 'bg-volt-sand text-amber-900' : 'bg-slate-100 text-slate-700'
                }`}>
                  {card.count}
                </span>
              </div>

              {/* BOTTOM ROW: TEXT SUMMARY DATA */}
              <div className="mt-6">
                <h4 className="font-display text-base font-semibold text-volt-primary">
                  {card.title}
                </h4>
                <p className="mt-1 font-sans text-sm text-slate-500 leading-normal">
                  {card.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}