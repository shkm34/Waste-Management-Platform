
import { claimWaste, getMarketplace } from "@/services/dealerService";
import { useEffect, useState } from "react";
import { Garbage } from "@/types";

export const useMarketplace = () => {
    const [availableWaste, setAvailableWaste] = useState<Garbage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);


    // load all waste on mount
  useEffect(() => {
    fetchMarketplace();
  }, []);

  const fetchMarketplace = async () => {
    try {
      setError("");
      setLoading(true);
      const allWaste = await getMarketplace();
      setAvailableWaste(allWaste);
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to load marketplace");
    } finally {
      setLoading(false);
    }
  };

    const startAction = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setOpen(true);
  };

  //
  const handleConfirm = async (id: string) => {
   
    try {
      setLoading(true);
      await claimWaste(id);
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || "Failed to claim waste";

      if (errorMsg.includes("No drivers available")) {
        setError(
          "⚠️ No drivers available at the moment. Please try again later or contact support."
        );
      } else if (errorMsg.includes("already been claimed")) {
        setError("This waste has already been claimed by another dealer.");
        await fetchMarketplace(); // Refresh to remove from list
      } else if (errorMsg.includes("not accept this waste type")) {
        setError("Your facility is not configured to accept this waste type.");
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return {
    availableWaste,
    loading,
    error,
    open,
    setOpen,
    startAction,
    handleConfirm}
}