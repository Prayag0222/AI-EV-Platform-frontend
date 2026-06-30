"use client";

import { useState } from "react";
import {
  Cpu,
  Settings,
  Save,
  Cog,
  FileText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

  // No useEffect intentionally.
  const [motorSerial, setMotorSerial] = useState(
    vehicle?.motorSerial ?? ""
  );

  const [motorType, setMotorType] = useState(
    vehicle?.motorType ?? ""
  );

  const [motorNotes, setMotorNotes] = useState(
    vehicle?.motorNotes ?? ""
  );

  const [controllerSerial, setControllerSerial] = useState(
    vehicle?.controllerSerial ?? ""
  );

  const [controllerVersion, setControllerVersion] = useState(
    vehicle?.controllerVersion ?? ""
  );

  const [controllerNotes, setControllerNotes] = useState(
    vehicle?.controllerNotes ?? ""
  );

  const handleSave = async () => {
    setIsSaving(true);

    try {
      await onSave({
        motorSerial: motorSerial || null,
        motorType: motorType || null,
        motorNotes: motorNotes || null,
        controllerSerial: controllerSerial || null,
        controllerVersion: controllerVersion || null,
        controllerNotes: controllerNotes || null,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="border-b bg-slate-50/70">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Cpu className="h-5 w-5 text-indigo-600" />
          Motor & Controller
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 p-5">
        {/* Motor */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-indigo-600" />
            <h3 className="font-semibold text-slate-900">
              Motor Information
            </h3>
          </div>

          <div className="grid gap-4">
            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <Cog className="h-3.5 w-3.5" />
                Motor Serial
              </label>

              <Input
                value={motorSerial}
                placeholder="MTR-001245"
                onChange={(e) => setMotorSerial(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <Cpu className="h-3.5 w-3.5" />
                Motor Type
              </label>

              <Input
                value={motorType}
                placeholder="BLDC Hub Motor"
                onChange={(e) => setMotorType(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <FileText className="h-3.5 w-3.5" />
                Motor Notes
              </label>

              <Input
                value={motorNotes}
                placeholder="Inspection notes..."
                onChange={(e) => setMotorNotes(e.target.value)}
              />
            </div>
          </div>
        </section>

        <div className="border-t" />

        {/* Controller */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-indigo-600" />
            <h3 className="font-semibold text-slate-900">
              Controller Information
            </h3>
          </div>

          <div className="grid gap-4">
            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <Settings className="h-3.5 w-3.5" />
                Controller Serial
              </label>

              <Input
                value={controllerSerial}
                placeholder="CTRL-001245"
                onChange={(e) =>
                  setControllerSerial(e.target.value)
                }
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <Cpu className="h-3.5 w-3.5" />
                Firmware Version
              </label>

              <Input
                value={controllerVersion}
                placeholder="v2.4.1"
                onChange={(e) =>
                  setControllerVersion(e.target.value)
                }
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <FileText className="h-3.5 w-3.5" />
                Controller Notes
              </label>

              <Input
                value={controllerNotes}
                placeholder="Inspection notes..."
                onChange={(e) =>
                  setControllerNotes(e.target.value)
                }
              />
            </div>
          </div>
        </section>

        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="h-11 w-full"
        >
          <Save className="mr-2 h-4 w-4" />

          {isSaving
            ? "Saving Motor & Controller..."
            : "Save Motor & Controller"}
        </Button>
      </CardContent>
    </Card>
  );
}