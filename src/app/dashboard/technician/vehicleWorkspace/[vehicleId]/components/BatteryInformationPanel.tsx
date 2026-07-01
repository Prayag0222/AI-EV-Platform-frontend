"use client";

import { useState } from "react";
import {
  Battery,
  Activity,
  RotateCw,
  Thermometer,
  Save,
  Cpu,
} from "lucide-react";

import { Button } from "@/components/ui/button_temp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface BatteryInformationPanelProps {
  vehicle: any;
  onSave: (updates: Record<string, unknown>) => Promise<boolean>;
}

export function BatteryInformationPanel({
  vehicle,
  onSave,
}: BatteryInformationPanelProps) {
  const [isSaving, setIsSaving] = useState(false);

  // No useEffect intentionally.
  const [batteryPackSerial, setBatteryPackSerial] = useState(
    vehicle?.batteryPackSerial ?? ""
  );

  const [batteryCapacity, setBatteryCapacity] = useState(
    vehicle?.batteryCapacity ?? ""
  );

  const [batterySoh, setBatterySoh] = useState(
    vehicle?.batterySoh?.toString() ?? ""
  );

  const [batteryCycles, setBatteryCycles] = useState(
    vehicle?.batteryCycles?.toString() ?? ""
  );

  const [batteryTemp, setBatteryTemp] = useState(
    vehicle?.batteryTemp?.toString() ?? ""
  );

  const [healthScore, setHealthScore] = useState(
    vehicle?.healthScore?.toString() ?? ""
  );

  const handleSave = async () => {
    setIsSaving(true);

    try {
      await onSave({
        batteryPackSerial: batteryPackSerial || null,
        batteryCapacity: batteryCapacity || null,
        batterySoh: batterySoh ? Number(batterySoh) : null,
        batteryCycles: batteryCycles ? Number(batteryCycles) : null,
        batteryTemp: batteryTemp || null,
        healthScore: healthScore ? Number(healthScore) : null,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="border-b bg-slate-50/70">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Battery className="h-5 w-5 text-indigo-600" />
          Battery Information
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5 p-5">
        <div className="grid gap-5">

          <div>
            <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <Cpu className="h-3.5 w-3.5" />
              Battery Pack Serial
            </label>

            <Input
              value={batteryPackSerial}
              placeholder="BAT-72V-000123"
              onChange={(e) => setBatteryPackSerial(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <Battery className="h-3.5 w-3.5" />
              Battery Capacity
            </label>

            <Input
              value={batteryCapacity}
              placeholder="72V 40Ah"
              onChange={(e) => setBatteryCapacity(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <Activity className="h-3.5 w-3.5" />
                SOH (%)
              </label>

              <Input
                type="number"
                min={0}
                max={100}
                value={batterySoh}
                placeholder="95"
                onChange={(e) => setBatterySoh(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <RotateCw className="h-3.5 w-3.5" />
                Cycles
              </label>

              <Input
                type="number"
                value={batteryCycles}
                placeholder="320"
                onChange={(e) => setBatteryCycles(e.target.value)}
              />
            </div>

          </div>

          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <Thermometer className="h-3.5 w-3.5" />
                Temperature
              </label>

              <Input
                value={batteryTemp}
                placeholder="34°C"
                onChange={(e) => setBatteryTemp(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <Activity className="h-3.5 w-3.5" />
                Health Score
              </label>

              <Input
                type="number"
                min={0}
                max={100}
                value={healthScore}
                placeholder="91"
                onChange={(e) => setHealthScore(e.target.value)}
              />
            </div>

          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="h-11 w-full"
        >
          <Save className="mr-2 h-4 w-4" />

          {isSaving
            ? "Saving Battery Information..."
            : "Save Battery Information"}
        </Button>
      </CardContent>
    </Card>
  );
}