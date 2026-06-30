"use client";

import { Battery, Save, Thermometer } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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

  const [batteryPackSerial, setBatteryPackSerial] = useState(
    vehicle.batteryPackSerial || ""
  );

  const [batteryCapacity, setBatteryCapacity] = useState(
    vehicle.batteryCapacity || ""
  );

  const [batterySoh, setBatterySoh] = useState(
    vehicle.batterySoh?.toString() || ""
  );

  const [batteryCycles, setBatteryCycles] = useState(
    vehicle.batteryCycles?.toString() || ""
  );

  const [batteryTemp, setBatteryTemp] = useState(
    vehicle.batteryTemp || ""
  );

  const [healthScore, setHealthScore] = useState(
    vehicle.healthScore?.toString() || ""
  );

  const handleSave = async () => {
    setIsSaving(true);

    await onSave({
      batteryPackSerial,
      batteryCapacity,
      batterySoh: batterySoh ? Number(batterySoh) : null,
      batteryCycles: batteryCycles ? Number(batteryCycles) : null,
      batteryTemp,
      healthScore: healthScore ? Number(healthScore) : null,
    });

    setIsSaving(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Battery className="h-5 w-5" />
          Battery Information
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <Input
          placeholder="Battery Pack Serial"
          value={batteryPackSerial}
          onChange={(e) => setBatteryPackSerial(e.target.value)}
        />

        <Input
          placeholder="Battery Capacity"
          value={batteryCapacity}
          onChange={(e) => setBatteryCapacity(e.target.value)}
        />

        <Input
          type="number"
          placeholder="Battery SOH (%)"
          value={batterySoh}
          onChange={(e) => setBatterySoh(e.target.value)}
        />

        <Input
          type="number"
          placeholder="Battery Cycles"
          value={batteryCycles}
          onChange={(e) => setBatteryCycles(e.target.value)}
        />

        <Input
          placeholder="Battery Temperature"
          value={batteryTemp}
          onChange={(e) => setBatteryTemp(e.target.value)}
        />

        <Input
          type="number"
          placeholder="Health Score"
          value={healthScore}
          onChange={(e) => setHealthScore(e.target.value)}
        />

        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Battery Information"}
        </Button>
      </CardContent>
    </Card>
  );
}