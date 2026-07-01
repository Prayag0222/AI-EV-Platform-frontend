"use client";

import { useState } from "react";
import {
  Car,
  Hash,
  Factory,
  Calendar,
  Gauge,
  Save,
} from "lucide-react";

import { Button } from "@/components/ui/button_temp";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface VehicleDetailsPanelProps {
  vehicle: any;
  onSave: (updates: Record<string, unknown>) => Promise<boolean>;
}

export function VehicleDetailsPanel({
  vehicle,
  onSave,
}: VehicleDetailsPanelProps) {
  const [isSaving, setIsSaving] = useState(false);

  // Intentionally no useEffect.
  const [vehicleModel, setVehicleModel] = useState(
    vehicle?.vehicleModel ?? ""
  );

  const [vin, setVin] = useState(
    vehicle?.vin ?? ""
  );

  const [manufacturer, setManufacturer] = useState(
    vehicle?.manufacturer ?? ""
  );

  const [modelYear, setModelYear] = useState(
    vehicle?.modelYear?.toString() ?? ""
  );

  const [odometer, setOdometer] = useState(
    vehicle?.odometer?.toString() ?? ""
  );

  const handleSave = async () => {
    setIsSaving(true);

    try {
      await onSave({
        vehicleModel: vehicleModel || null,
        vin: vin || null,
        manufacturer: manufacturer || null,
        modelYear: modelYear ? Number(modelYear) : null,
        odometer: odometer || null,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="border-b bg-slate-50/70">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Car className="h-5 w-5 text-indigo-600" />
          Vehicle Details
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5 p-5">
        <div>
          <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <Car className="h-3.5 w-3.5" />
            Vehicle Model
          </label>

          <Input
            placeholder="Ather 450X"
            value={vehicleModel}
            onChange={(e) => setVehicleModel(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <Hash className="h-3.5 w-3.5" />
            Vehicle VIN
          </label>

          <Input
            placeholder="VIN Number"
            value={vin}
            onChange={(e) => setVin(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <Factory className="h-3.5 w-3.5" />
            Manufacturer
          </label>

          <Input
            placeholder="Manufacturer"
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <Calendar className="h-3.5 w-3.5" />
              Model Year
            </label>

            <Input
              type="number"
              placeholder="2025"
              value={modelYear}
              onChange={(e) => setModelYear(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <Gauge className="h-3.5 w-3.5" />
              Odometer
            </label>

            <Input
              placeholder="12540 km"
              value={odometer}
              onChange={(e) => setOdometer(e.target.value)}
            />
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="h-11 w-full"
        >
          <Save className="mr-2 h-4 w-4" />

          {isSaving
            ? "Saving Vehicle Details..."
            : "Save Vehicle Details"}
        </Button>
      </CardContent>
    </Card>
  );
}