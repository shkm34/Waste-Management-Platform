import { useState } from "react";
import {
  formatCurrency,
} from "../../../utils";
import { acceptDelivery } from "@/services/dealerService";

export const useDealerDashboard = (onAccepted?: () => void) => {
  const [acceptingId, setAcceptingId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [open, setOpen] = useState(false);

  // Set acceptingId state for grabage dealer choosed to accept
  // open confirm modal for confirmation of action
  const startAction = (garbageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAcceptingId(garbageId);
    setOpen(true);
  };

  const handleAcceptDelivery = async (garbageId: string) => {
    if (!garbageId) {
      setSuccess("");
      setLoading(false);
      setError("No delivery selected");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const result = await acceptDelivery(garbageId);
      setSuccess(
        `Delivery accepted! Customer has been credited ${formatCurrency(
          result.customerNewBalance
        )}.`
      );

      // close modal and clear selection
      setOpen(false);
      setAcceptingId("");

      // inform parent to refresh
      onAccepted?.();

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(""), 5000);
    } catch (error: any) {
      console.error("Accept Delivery Error:", error);
      setError(error.message || "Failed to accept delivery");
    } finally {
      setLoading(false);
    }
  };

  return {
    startAction,
    handleAcceptDelivery,
    loading,
    success,
    error,
    open,
    setOpen,
    acceptingId,
  };
};
