'use client';

import { CheckCircle } from 'lucide-react';

interface EmptyOperationStateProps {
  title: string;
  description: string;
}

export default function EmptyOperationState({
  title,
  description,
}: EmptyOperationStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[rgba(9,20,38,0.08)] bg-white py-20">

      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-volt-container">
        <CheckCircle className="h-5 w-5 text-volt-secondary" />
      </div>

      <h3 className="text-sm font-bold text-volt-primary">
        {title}
      </h3>

      <p className="mt-1 text-center text-xs text-sec-text">
        {description}
      </p>

    </div>
  );
}