"use client";

import { Cpu, Save, Settings } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface MotorControllerPanelProps {
  vehicle: any;
  onSave: (updates: Record<string, unknown>) => Promise<boolean>;
}

export function MotorControllerPanel({
  vehicle,
  onSave,
}: MotorControllerPanelProps) {
  const [isSaving, setIsSaving] = useState(false);

  const [motorSerial, setMotorSerial] = useState(
    vehicle.motorSerial || ""
  );

  const [motorType, setMotorType] = useState(
    vehicle.motorType || ""
  );

  const [motorNotes, setMotorNotes] = useState(
    vehicle.motorNotes || ""
  );

  const [controllerSerial, setControllerSerial] = useState(
    vehicle.controllerSerial || ""
  );

  const [controllerVersion, setControllerVersion] = useState(
    vehicle.controllerVersion || ""
  );

  const [controllerNotes, setControllerNotes] = useState(
    vehicle.controllerNotes || ""
  );

  const handleSave = async () => {
    setIsSaving(true);

    await onSave({
      motorSerial,
      motorType,
      motorNotes,
      controllerSerial,
      controllerVersion,
      controllerNotes,
    });

    setIsSaving(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Motor & Controller
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Cpu className="h-4 w-4" />
            <h3 className="font-semibold">
              Motor
            </h3>
          </div>

          <div className="space-y-3">
            <Input
              placeholder="Motor Serial"
              value={motorSerial}
              onChange={(e) => setMotorSerial(e.target.value)}
            />

            <Input
              placeholder="Motor Type"
              value={motorType}
              onChange={(e) => setMotorType(e.target.value)}
            />

            <Input
              placeholder="Motor Notes"
              value={motorNotes}
              onChange={(e) => setMotorNotes(e.target.value)}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Settings className="h-4 w-4" />
            <h3 className="font-semibold">
              Controller
            </h3>
          </div>

          <div className="space-y-3">
            <Input
              placeholder="Controller Serial"
              value={controllerSerial}
              onChange={(e) => setControllerSerial(e.target.value)}
            />

            <Input
              placeholder="Controller Version"
              value={controllerVersion}
              onChange={(e) => setControllerVersion(e.target.value)}
            />

            <Input
              placeholder="Controller Notes"
              value={controllerNotes}
              onChange={(e) => setControllerNotes(e.target.value)}
            />
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Motor & Controller"}
        </Button>
      </CardContent>
    </Card>
  );
}