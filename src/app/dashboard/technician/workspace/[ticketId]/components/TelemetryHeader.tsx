import React from 'react';

// We define the type for the data this component needs
interface TelemetryHeaderProps {
  vehicleModel: string;
  customerName: string;
}

export default function TelemetryHeader({ vehicleModel, customerName }: TelemetryHeaderProps) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
      <p className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest">
        Telemetry Snapshot
      </p>
      <h2 className="text-xl font-bold text-slate-800 leading-tight">
        {vehicleModel}
      </h2>
      <p className="text-sm text-slate-500 mt-0.5">
        Owner: {customerName}
      </p>
    </div>
  );
}