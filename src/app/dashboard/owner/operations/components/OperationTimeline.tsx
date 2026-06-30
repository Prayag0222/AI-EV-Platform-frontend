'use client';

import {
  CheckCircle2,
  Clock3,
  Package,
  Stethoscope,
  Truck,
  Wrench,
} from 'lucide-react';

interface OperationTimelineProps {
  currentStatus: string;
}

const STEPS = [
  {  key: "DIAGNOSING",
    label: "DIAGNOSING", icon: Stethoscope },
  { key: "IN_SERVICE",
    label: "IN SERVICE", icon: Wrench },
  {  key: "RESOLVED",
    label: "RESOLVED", icon: CheckCircle2 },
  {  key: "DELIVERED",
    label: "DELIVERED", icon: Truck },
];

export default function OperationTimeline({
  currentStatus,
}: OperationTimelineProps) {
  const activeIndex = STEPS.findIndex(
    step =>
      step.key ===
      currentStatus
  );

  return (
    <div className="rounded-2xl border border-[rgba(9,20,38,.08)] bg-white p-5">

      <p className="mb-5 text-[11px] font-bold uppercase tracking-widest text-sec-text">
        Repair Progress
      </p>

      <div className="space-y-4">

        {STEPS.map((step, index) => {
          const Icon = step.icon;

          const completed = index <= activeIndex;

          const last = index === STEPS.length - 1;

          return (
            <div
              key={step.key}
              className="flex gap-4"
            >
              <div className="flex flex-col items-center">

                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition
                  ${
                    completed
                      ? 'bg-volt-secondary text-white'
                      : 'bg-volt-container text-sec-text'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>

                {!last && (
                  <div
                    className={`mt-1 h-8 w-[2px]
                    ${
                      index < activeIndex
                        ? 'bg-volt-secondary'
                        : 'bg-gray-200'
                    }`}
                  />
                )}

              </div>

              <div className="pt-2">

                <p
                  className={`text-sm font-semibold
                  ${
                    completed
                      ? 'text-volt-primary'
                      : 'text-sec-text'
                  }`}
                >
                  {step.label}
                </p>

                {index === activeIndex && (
                  <p className="mt-1 text-xs text-volt-secondary">
                    Current Status
                  </p>
                )}

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}