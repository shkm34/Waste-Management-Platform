import { Server as SocketIOServer } from "socket.io";
import { AuthenticatedSocket } from "../middlewares/socketAuth";

// 1. User connects → Authentication middleware runs
// 2. If authenticated → 'connection' event fires
// 3. User info already attached to socket
// 4. Set up event listeners for this connection

export const setupSocketHandlers = (io: SocketIOServer): void => {
  io.on("connection", (socket) => {
    const authSocket = socket as AuthenticatedSocket;
    console.log(`\n New WebSocket connection:`);
    console.log(`   Socket ID: ${authSocket.id}`);
    console.log(`   User ID: ${authSocket.userId}`);
    console.log(`   Role: ${authSocket.userRole}`);
    console.log(`   Email: ${authSocket.userEmail}\n`);

    // Handle disconnection
    authSocket.on("disconnect", (reason: string) => {
      console.log(`\n Socket disconnected:`);
      console.log(`   Socket ID: ${authSocket.id}`);
      console.log(`   User: ${authSocket.userEmail}`);
      console.log(`   Reason: ${reason}\n`);
      
    });

  });

  console.log("✅ Socket event handlers registered");
};
