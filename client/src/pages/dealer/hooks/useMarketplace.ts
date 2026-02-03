import { claimWaste, getMarketplace } from "@/services/dealerService";
import { useEffect, useState, useCallback } from "react";
import { Garbage } from "@/types";
import { useSocket, useSocketConnection } from "../../../socket/SocketContext";
import { useSocketEvent } from "../../../socket/useSocketEvent";
import { SOCKET_EVENTS } from "../../../config/socketConstants";
import { GarbageCreatedPayload } from "../../../types/socket.types";

export const useMarketplace = () => {
  const [availableWaste, setAvailableWaste] = useState<Garbage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const socket = useSocket(); // get socket from context
  // Use isConnected from context state - this is properly reactive unlike socket?.connected
  const { isConnected, socketId } = useSocketConnection();

  console.log("[useMarketplace] Socket status - isConnected:", isConnected, "socketId:", socketId);

  // ===== JOIN MARKETPLACE ROOM =====
  const joinMarketplace = useCallback(() => {
    if (!socket || !isConnected) {
      console.log("[useMarketplace] Cannot join - socket not ready. socket:", !!socket, "isConnected:", isConnected);
      return;
    }

    socket.emit(SOCKET_EVENTS.DEALER_JOIN_MARKETPLACE);
    console.log("📦 Joining dealer marketplace...");
  }, [socket, isConnected]);

  // ===== LEAVE MARKETPLACE ROOM =====
  const leaveMarketplace = useCallback(() => {
    if (!socket || !isConnected) {
      console.log("[useMarketplace] Cannot leave - socket not ready");
      return;
    }

    socket.emit(SOCKET_EVENTS.DEALER_LEAVE_MARKETPLACE);
    console.log("📦 Leaving dealer marketplace...");
    setIsJoined(false);
  }, [socket, isConnected]);

  // ===== HANDLE MARKETPLACE JOIN CONFIRMATION =====
  useSocketEvent(SOCKET_EVENTS.DEALER_JOINED_MARKETPLACE, () => {
    setIsJoined(true);
    console.log("✅ Successfully joined marketplace room");
  });

  // ===== HANDLE MARKETPLACE LEAVE CONFIRMATION =====
  useSocketEvent(SOCKET_EVENTS.DEALER_LEFT_MARKETPLACE, () => {
    setIsJoined(false);
    console.log("✅ Successfully left marketplace room");
  });

  // ===== HANDLE NEW GARBAGE CREATED =====
  useSocketEvent(
    SOCKET_EVENTS.GARBAGE_CREATED,
    useCallback((newGarbage) => {
      console.log("📦 New garbage created:", newGarbage);

      // add new garbage to available waste list
      setAvailableWaste((prev) => {
        // prevent dupplicate- in case multiple dupli. listner
        const exist = prev.some((item) => item._id === newGarbage._id);

        if (exist) return prev;

        return [newGarbage, ...prev];
      });
    }, []),
  );

  // ===== HANDLE GARBAGE CLAIMED BY ANY DEALER =====
  useSocketEvent(
    SOCKET_EVENTS.GARBAGE_CLAIMED,
    useCallback((data) => {
      console.log("📦 Garbage claimed:", data.garbageId);

      // remove from list
      setAvailableWaste((prev) =>
        prev.filter((item) => item._id !== data.garbageId),
      );
    }, []),
  );

  const fetchMarketplace = useCallback(async () => {
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
  }, []);

  // Setup: Fetch initial data + Join room
  useEffect(() => {
    console.log("[useMarketplace] useEffect running - isConnected:", isConnected);
    // Fetch existing marketplace data
    fetchMarketplace();

    if (!isConnected) {
      console.log("[useMarketplace] Socket not connected yet, waiting...");
      return;
    }

    // Join marketplace room for real-time updates
    console.log("[useMarketplace] Socket connected, joining marketplace room...");
    joinMarketplace();

    // Cleanup: Leave room on unmount
    return () => {
      leaveMarketplace();
    };
  }, [fetchMarketplace, joinMarketplace, leaveMarketplace, isConnected]);


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
          "⚠️ No drivers available at the moment. Please try again later or contact support.",
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
    handleConfirm,
  };
};
