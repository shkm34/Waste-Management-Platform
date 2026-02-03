import { useSocketConnection } from "@/socket/SocketContext";

export const ConnectionStatus = () => {

    const { isConnected, isConnecting, error } = useSocketConnection()

    if (isConnecting) {
        return (
            <div style={{ padding: "8px", background: "#ff9800", color: "white" }}>
                🔄 Connecting...
            </div>
        )
    }

    if (error) {
        return (
            <div style={{ padding: "8px", background: "#f44336", color: "white" }}>
                ❌ Connection Error: {error}
            </div>
        )
    }

    if (isConnected) {
        return (
            <div style={{ padding: "8px", background: "#4caf50", color: "white" }}>
                ✅ Connected
            </div>
        )
    }

    return (
        <div style={{ padding: "8px", background: "#ccc", color: "#333" }}>
            ⚪ Not Connected
        </div>
    );
}