import * as garbageService from "@/services/garbageService";
import { Garbage } from "@/types";
import { useEffect, useState } from "react";
import { GARBAGE_STATUS } from "@/utils";
import { deleteGarbage } from "@/services/garbageService";

export const useCustomerDashboard = () => {
  const [garbage, setGarbage] = useState<Garbage[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [wasteData, walletData] = await Promise.all([
        garbageService.getMyWaste(),
        garbageService.getWalletBalance(),
      ]);
      setGarbage(wasteData);
      setWalletBalance(walletData);
    } catch (error: any) {
      setError(error.response.data.error || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const onCancelWaste = async (id: string) => {
    try {
      setLoading(true);
      setError("");
      await deleteGarbage(id);
      fetchData();
    } catch (error: any) {
      setError(error.response.data.error || "Error deleting waste");
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalWasteCreated: garbage.length,
    pendingPickups: garbage.filter(
      (w) =>
        w.status === GARBAGE_STATUS.AVAILABLE ||
        w.status === GARBAGE_STATUS.CLAIMED ||
        w.status === GARBAGE_STATUS.ASSIGNED
    ).length,
    completed: garbage.filter((w) => w.status === GARBAGE_STATUS.ACCEPTED)
      .length,
  };
  return { garbage, stats, walletBalance, error, loading, onCancelWaste };
};
