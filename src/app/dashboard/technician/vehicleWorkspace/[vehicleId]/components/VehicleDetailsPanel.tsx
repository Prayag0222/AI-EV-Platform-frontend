"use client";

import { useState } from "react";
import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
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

  const [vehicleModel, setVehicleModel] = useState(
    vehicle.vehicleModel || ""
  );

  const [vin, setVin] = useState(
    vehicle.vin || ""
  );

  const [manufacturer, setManufacturer] = useState(
    vehicle.manufacturer || ""
  );

  const [modelYear, setModelYear] = useState(
    vehicle.modelYear?.toString() || ""
  );

  const [odometer, setOdometer] = useState(
    vehicle.odometer || ""
  );

  const handleSave = async () => {
    setIsSaving(true);

    await onSave({
      vehicleModel,
      vin,
      manufacturer,
      modelYear: modelYear
        ? Number(modelYear)
        : null,
      odometer,
    });

    setIsSaving(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Vehicle Details
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <Input
          placeholder="Vehicle Model"
          value={vehicleModel}
          onChange={(e) =>
            setVehicleModel(e.target.value)
          }
        />

        <Input
          placeholder="VIN"
          value={vin}
          onChange={(e) =>
            setVin(e.target.value)
          }
        />

        <Input
          placeholder="Manufacturer"
          value={manufacturer}
          onChange={(e) =>
            setManufacturer(e.target.value)
          }
        />

        <Input
          type="number"
          placeholder="Model Year"
          value={modelYear}
          onChange={(e) =>
            setModelYear(e.target.value)
          }
        />

        <Input
          placeholder="Odometer"
          value={odometer}
          onChange={(e) =>
            setOdometer(e.target.value)
          }
        />

        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full"
        >
          <Save className="mr-2 h-4 w-4" />
          {isSaving
            ? "Saving..."
            : "Save Vehicle Details"}
        </Button>
      </CardContent>
    </Card>
  );
}