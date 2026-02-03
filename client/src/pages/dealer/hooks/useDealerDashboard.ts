import { useState, useEffect, useCallback } from "react";
import { Garbage } from "@/types";
import { getIncomingDeliveries, unclaimWaste } from "@/services/dealerService";
import { GARBAGE_STATUS } from "@/utils";
import { useSocketEvent } from "@/socket/useSocketEvent";
import { useSocketConnection } from "@/socket/SocketContext";
import { SOCKET_EVENTS } from "@/config/socketConstants";
import type { GarbageStatusChangedPayload, GarbageClaimedPayload } from "@/types/socket.types";

export const useDealerDashboard = () => {
  const [incomingDeliveries, setIncomingDeliveries] = useState<Garbage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Get socket connection status for debugging
  const { isConnected, socketId } = useSocketConnection();

  console.log("[useDealerDashboard] Rendering - Socket connected:", isConnected, "Socket ID:", socketId);

  const fetchDeliveries = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getIncomingDeliveries();
      setIncomingDeliveries(data);
      console.log("[useDealerDashboard] Fetched deliveries:", data.length);
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to load deliveries");
    } finally {
      setLoading(false);
    }
  }, []);

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

  // ========== Socket Event Handlers ==========

  // Handle garbage status change events
  const handleGarbageStatusChanged = useCallback((data: GarbageStatusChangedPayload) => {
    console.log("[useDealerDashboard] Socket event - garbage:statusChanged", data);
    
    setIncomingDeliveries((prevDeliveries) => {
      // Check if this garbage exists in our list
      const existingIndex = prevDeliveries.findIndex((d) => d._id === data._id);
      
      if (existingIndex !== -1) {
        // Update the existing delivery with new status
        const updatedDeliveries = [...prevDeliveries];
        updatedDeliveries[existingIndex] = {
          ...updatedDeliveries[existingIndex],
          status: data.status as Garbage['status'],
          claimedAt: data.claimedAt || updatedDeliveries[existingIndex].claimedAt,
          assignedAt: data.assignedAt || updatedDeliveries[existingIndex].assignedAt,
          readyAt: data.readyAt || updatedDeliveries[existingIndex].readyAt,
          pickedUpAt: data.pickedUpAt || updatedDeliveries[existingIndex].pickedUpAt,
          deliveredAt: data.deliveredAt || updatedDeliveries[existingIndex].deliveredAt,
        };
        console.log("[useDealerDashboard] Updated delivery status locally");
        return updatedDeliveries;
      }
      
      // If not found, refetch to get the latest data
      console.log("[useDealerDashboard] Delivery not found in local state, refetching...");
      fetchDeliveries();
      return prevDeliveries;
    });
  }, [fetchDeliveries]);

  // Handle garbage claimed events (when a delivery is claimed by this dealer)
  const handleGarbageClaimed = useCallback((data: GarbageClaimedPayload) => {
    console.log("[useDealerDashboard] Socket event - garbage:claimed", data);
    // Refetch to get the newly claimed delivery with full data
    fetchDeliveries();
  }, [fetchDeliveries]);

  // ========== Register Socket Event Listeners ==========
  useSocketEvent(SOCKET_EVENTS.GARBAGE_STATUS_CHANGED, handleGarbageStatusChanged);
  useSocketEvent(SOCKET_EVENTS.GARBAGE_CLAIMED, handleGarbageClaimed);

  // fetch on mount
  useEffect(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  // Log socket connection status changes
  useEffect(() => {
    console.log("[useDealerDashboard] Socket connection status changed - Connected:", isConnected);
  }, [isConnected]);

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
    isSocketConnected: isConnected,
    socketId,
  };
};
