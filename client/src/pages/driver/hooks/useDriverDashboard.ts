import {
  getMyAssignments,
  markDelivered,
  markPickedUp,
  markReadyToPick,
  assignJob,
} from "@/services/driverService";
import { Garbage, DriverGarbageAction } from "@/types";
import { useEffect, useState } from "react";

export const useDriverDashboard = () => {
  const [assignments, setAssignments] = useState<Garbage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  const [success, setSuccess] = useState<string>("");
  // Fetch all assignments on mount
  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getMyAssignments();
      console.log("Fetched assignments:", data);
      setAssignments(data);
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  const assignGarbage = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await assignJob();
      setSuccess(result.message ? result.message : "Job assigned!");
      fetchAssignments();
      setTimeout(() => setSuccess(""), 4000);
    } catch (error: any) {
      console.log(error);
      setError(error.response?.data?.error || "Failed to assign job");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (
    garbageId: string,
    action: DriverGarbageAction
  ) => {
    try {
      setUpdatingId(garbageId);
      setError("");
      setSuccess("");

      switch (action) {
        case "ready_to_pick":
          await markReadyToPick(garbageId);
          setSuccess("Marked as ready to pick!");
          break;

        case "picked_up":
          await markPickedUp(garbageId);
          setSuccess("Marked as picked up!");
          break;

        case "delivered":
          await markDelivered(garbageId);
          setSuccess("Marked as delivered! Waiting for dealer acceptance.");
          break;
      }

      fetchAssignments();

      // Clear success message after 4 seconds
      setTimeout(() => setSuccess(""), 4000);
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  return {
    assignments,
    loading,
    error,
    success,
    updatingId,
    assignGarbage,
    handleStatusUpdate,
    fetchAssignments,
  };
};
