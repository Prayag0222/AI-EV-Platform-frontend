import { useEffect, useState } from "react";
import { VehicleWorkspaceData } from "../types/workspaceTypes";

export function useVehicleWorkspace(vehicleId: number | null) {
  const [workspace, setWorkspace] = useState<VehicleWorkspaceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notice, setNotice] = useState("");

 

  useEffect(() => {
    if (!vehicleId) return;

    const fetchWorkspace = async () => {
      try {

        
        // setIsLoading(true);

        const response = await fetch(
          `http://localhost:3000/api/vehicles/vehicle/workspace/${vehicleId}`
        );

        const data = await response.json();


        

        if (data.success) {
          setWorkspace(data);
        } else {
          setNotice("Failed to load vehicle workspace.");
        }
      } catch (error) {
        console.error("Vehicle workspace fetch error:", error);
        setNotice("Network error while loading workspace.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkspace();
  }, [vehicleId]);

  const updateVehicleWorkspace = async (
    updates: Record<string, unknown>
  ) => {
    if (!vehicleId) return false;

    try {
      const response = await fetch(
        `http://localhost:3000/api/vehicles/vehicle/workspace/${vehicleId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updates)
        }
      );

      const data = await response.json();

      if (data.success) {
  const refreshedResponse = await fetch(
    `http://localhost:3000/api/vehicles/vehicle/workspace/${vehicleId}`
  );

  const refreshedData = await refreshedResponse.json();

  if (refreshedData.success) {
    setWorkspace(refreshedData);
  }

  return true;
}

      return false;
    } catch (error) {
      console.error("Vehicle workspace update error:", error);
      return false;
    }
  };

  return {
    workspace,
    isLoading,
    notice,
    setNotice,
    updateVehicleWorkspace
  };
}