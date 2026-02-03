import { ConnectionStatus } from "@/types/socket.types";
import { ReactNode, useCallback, useState, createContext, useContext } from "react";
import { connectSocket, disconnectSocket, getSocket } from "./socketClient";
import type { Socket } from "socket.io-client";

type ClientSocket = Socket | null;;

console.log("[SocketContext] module loaded — runtime:", typeof window === "undefined" ? "server" : "browser");

// === Define Socket Context value ===

interface SocketContextValue {
  socket: ClientSocket | null;
  connectionStatus: ConnectionStatus;
  connect: (token: string) => void;
  disconnect: () => void;
}

// === Create Context ===
const SocketContext = createContext<SocketContextValue | undefined>(undefined);

// === Socket Provider ===
interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<ClientSocket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    isConnected: false,
    isConnecting: false,
    error: null,
    socketId: null,
  });

  /**
   * Connect to socket server with authentication token
   * calling this after user login
   */
  const connect = useCallback((token: string) => {
    setConnectionStatus((prev) => ({
      ...prev,
      isConnecting: true,
      error: null,
    }));

    try {
      // create socket connection
      const newSocket = connectSocket(token);
      setSocket(newSocket);
      console.log("connect socket call ho raha", socket)

      // Listen for connection status change
      newSocket.on("connect", () => {
        setConnectionStatus({
          isConnected: true,
          isConnecting: false,
          error: null,
          socketId: newSocket.id ?? null,
        });
      });

      newSocket.on("disconnect", (reason: string) => {
        setConnectionStatus({
          isConnected: false,
          isConnecting: false,
          error: reason,
          socketId: null,
        });
      });

      newSocket.on("connect_error", (error: Error) => {
        setConnectionStatus({
          isConnected: false,
          isConnecting: false,
          error: error.message,
          socketId: null,
        });
      });
    } catch (error: any) {
      setConnectionStatus({
        isConnected: false,
        isConnecting: false,
        error: error ? error.message : "Connection failed",
        socketId: null,
      });
    }
  }, []);

  const disconnect = useCallback(() => {
    disconnectSocket()
    setSocket(null)
    setConnectionStatus({
      isConnected: false,
      isConnecting: false,
      error: null,
      socketId: null
    })
  }, [])

  const value: SocketContextValue = {
    socket,
    connectionStatus,
    connect,
    disconnect
  }

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
};


// ===== Custom Hook to use Context =====


/**
 * Hook to access socket context
 * To be used inside SocketProvider component
 */

export const useSocketContext = (): SocketContextValue=>{
  const context = useContext(SocketContext)
  console.log("context socket", context)

  if(context == undefined){
    throw new Error("useSocketContext must be used within SocketProvider");
  }

  return context
}

/**
 * Simple hook to get just the socket instance
 * Returns null if not connected
 */

export const useSocket = ()=>{
  const {socket} = useSocketContext()
  return socket
}

export const useSocketConnection = () => {
  const {connectionStatus, connect, disconnect} = useSocketContext()
console.log("socket", connectionStatus)
  return {
    ...connectionStatus,
    connect,
    disconnect,
  }
}

