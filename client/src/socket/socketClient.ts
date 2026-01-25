import io from "socket.io-client";
type ClientSocket = ReturnType<typeof io>
import { SOCKET_CONFIG } from "../config/socketConstants";

let socket: ClientSocket | null = null;

/**
 * Create and connect socket with authentication token
 * Returns the socket instance
 */

export const connectSocket = (authToken: string): ClientSocket => {
    // disconnect old socket if exist
    if (socket?.connected) {
        if (SOCKET_CONFIG.debug) {
            console.log("🔌 Disconnecting old socket before new connection");
        }
        socket.disconnect()
    }

    // create new socket with auth token
    socket = io(SOCKET_CONFIG.url, {
        ...SOCKET_CONFIG.options,
        auth: {
            token: authToken
        }
    })

    // ====== Debug logging ======

    if (SOCKET_CONFIG.debug) {
        socket.on("connect", () => {
            console.log("✅ Socket connected:", socket?.id);
        });

        socket.on("disconnect", (reason: string) => {
            console.log("❌ Socket disconnected:", reason);
        });

        socket.on("connect_error", (error: Error) => {
            console.error("❌ Connection error:", error.message);
        });
    }

    // ====== ======

    return socket
}

/**
 * Disconnect socket and clean up
 */

export const disconnectSocket = () => {
    if(socket){
        if (SOCKET_CONFIG.debug) {
      console.log("🔌 Disconnecting socket");
    }
        socket.disconnect()
        socket = null
    }
}

/**
 * Get current socket instance
 */

export const getSocket = (): ClientSocket | null => {
    return socket
}

