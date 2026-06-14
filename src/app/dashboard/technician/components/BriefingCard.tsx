'use client';

import React, { ReactNode } from 'react';
import { Button } from "@/components/ui/Button"
import { LucideIcon } from "lucide-react";

interface BriefingCardProps {
  icon: LucideIcon;
  title: string;
  action: string;
  children: ReactNode;
}

export default function BriefingCard({ icon: Icon, title, action, children }: BriefingCardProps) {
  return (
    <section className="rounded-2xl border border-border/70 bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="size-4 text-muted-foreground" />
          <h2 className="text-sm  text-primary-text font-semibold">{title}</h2>
        </div>
        <Button variant="ghost" size="sm" className="h-7 px-2 text-[11px] text-muted-foreground">
          {action}
        </Button>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}