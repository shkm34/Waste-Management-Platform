import io from "socket.io-client";
import { SOCKET_CONFIG } from "../config/socketConstants";

type ClientSocket = ReturnType<typeof io>;

class SocketService {
    private socket: ClientSocket | null = null;
    private token: string | null = null;

    public getSocket(): ClientSocket | null {
        return this.socket;
    }

    // if socket is connected
    public isConnected(): boolean {
        return this.socket?.connected ?? false;
    }

    // If already connected with same token, return existing
    public connect(authToken: string): ClientSocket {
        if (this.socket?.connected && this.token === authToken) {
            if (SOCKET_CONFIG.debug) {
                console.log("Socket already connected, reusing connection");
            }
            return this.socket;
        }

        // Disconnect old connection if exist
        if (this.socket) {
            if (SOCKET_CONFIG.debug) {
                console.log("Disconnecting old socket before new connection");
            }
            this.socket.disconnect();
        }

        // store token
        this.token = authToken

        // create new socket connection
        this.socket = io(SOCKET_CONFIG.url, {
            ...SOCKET_CONFIG.options,
            auth: {
                token: authToken
            }
        })

        // Setup event listeners for debugging
        if (SOCKET_CONFIG.debug) {
            this.setupDebugListeners();
        }

        if (SOCKET_CONFIG.debug) {
            console.log("Socket connection initiated");
        }

        return this.socket!;
    }

    // Disconnect from server
    // Cleanup on logout or unmount
    public disconnect(): void {
        if (this.socket) {
            if (SOCKET_CONFIG.debug) {
                console.log("🔌 Disconnecting socket");
            }
            this.socket.disconnect();
            this.socket = null;
            this.token = null;
        }
    }

    /**
     * Setup debug event listeners
     * 
     * Logs connection events for development
     */

    private setupDebugListeners(): void {
        if (!this.socket) return;

        this.socket.on("connect", () => {
            console.log("✅ Socket connected:", this.socket?.id);
        });

        this.socket.on("disconnect", (reason: string) => {
            console.log("❌ Socket disconnected:", reason);
        });

        this.socket.on("connect_error", (error) => {
            console.error("❌ Connection error:", error.message);
        });

        this.socket.on("reconnect", (attemptNumber: number) => {
            console.log(`🔄 Reconnected after ${attemptNumber} attempts`);
        });

        this.socket.on("reconnect_attempt", (attemptNumber: number) => {
            console.log(`🔄 Reconnection attempt ${attemptNumber}...`);
        });

        this.socket.on("reconnect_failed", () => {
            console.error("❌ Reconnection failed after max attempts");
        });
    }
}

export const socketService = new SocketService();
