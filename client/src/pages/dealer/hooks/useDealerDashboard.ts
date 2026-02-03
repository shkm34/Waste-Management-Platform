import { useState, useEffect } from "react";
import { Garbage } from "@/types";
import { getIncomingDeliveries, unclaimWaste } from "@/services/dealerService";
import { GARBAGE_STATUS } from "@/utils";

export const useDealerDashboard = () => {
  const [incomingDeliveries, setIncomingDeliveries] = useState<Garbage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  console.log("Dealerdashboard is rendering");
  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getIncomingDeliveries();
      setIncomingDeliveries(data);
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to load deliveries");
    } finally {
      setLoading(false);
    }
  };

  const handleUnclaimDeliveries = async (wasteId: string) => {
    try {
      setLoading(true);
      setError("");
      const data = await unclaimWaste(wasteId);
      fetchDeliveries();
      console.log(data);
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to load deliveries");
    } finally {
      setLoading(false);
    }
  };

  // fetch on mount
  useEffect(() => {
    fetchDeliveries();
  }, []);

  const stats = {
    totalIncoming: incomingDeliveries.length,

    pendingAcceptance: incomingDeliveries.filter(
      (d) => d.status === GARBAGE_STATUS.DELIVERED
    ).length,

    inTransit: incomingDeliveries.filter(
      (d) =>
        d.status === GARBAGE_STATUS.PICKED_UP ||
        d.status === GARBAGE_STATUS.READY_TO_PICK
    ).length,
  };

  return {
    incomingDeliveries,
    loading,
    error,
    stats,
    handleUnclaimDeliveries,
    fetchDeliveries,
  };
};
