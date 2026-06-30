'use client';

import { ChevronDown } from 'lucide-react';

interface OperationStatusDropdownProps {
  value: string;
  role: 'OWNER' | 'TECHNICIAN';
  onChange: (status: string) => void;
}

const OWNER_STATUS = [
  'PENDING',
  'DIAGNOSING',
  'IN_SERVICE',
  'RESOLVED',
  'DELIVERED',
];

const TECHNICIAN_STATUS = [
  'DIAGNOSING',
  'IN_SERVICE',
  'RESOLVED',
];

export default function OperationStatusDropdown({
  value,
  role,
  onChange,
}: OperationStatusDropdownProps) {




  const options =
    role === 'OWNER'
      ? OWNER_STATUS
      : TECHNICIAN_STATUS;

  return (
    <div className="space-y-2">

      <label className="text-[11px] font-bold uppercase tracking-widest text-sec-text">
        Repair Status
      </label>

      <div className="relative">

        <select
          value={value}
            onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-[rgba(9,20,38,.08)] bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-volt-secondary"
        >
          {options.map((item) => (
            <option
              key={item}
              value={item}
            >
              {item}
            </option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-sec-text" />

      </div>

    </div>
  );
}