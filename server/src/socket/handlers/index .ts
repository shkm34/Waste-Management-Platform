import { Server as SocketIOServer, Socket } from "socket.io";
import { AuthenticatedSocket } from "../middlewares/socketAuth";
import { setupGarbageHandlers } from "./garbageHandlers";
import { setupDealerHandlers } from "./dealerHandlers";
// 1. User connects → Authentication middleware runs
// 2. If authenticated → 'connection' event fires
// 3. User info already attached to socket
// 4. Set up event listeners for this connection

export const setupSocketHandlers = (io: SocketIOServer): void => {
  io.on("connection", (socket: Socket) => {
    const authSocket = socket as AuthenticatedSocket;
    console.log(`\n New WebSocket connection:`);
    console.log(`   Socket ID: ${authSocket.id}`);
    console.log(`   User ID: ${authSocket.userId}`);
    console.log(`   Role: ${authSocket.userRole}`);
    console.log(`   Email: ${authSocket.userEmail}\n`);

    // AUTO-JOIN PERSONAL NOTIFICATION ROOM
    // every user gets a personal room for noti.
    // notification are always relevent to user - 
    // no need to subs/unsubs. to get notification.
    // controller will emit in these rooms
    // room name: "user-{userId}"
    if(authSocket.userId) {
       const personalRoom = `user-${authSocket.userId}`
      authSocket.join(personalRoom);
      
      
      console.log(`🔔 User joined personal notification room:`);
      console.log(`   Room: ${personalRoom}\n`);

      // notify successful connection
      socket.emit("notification:new", {
        type: "SYSTEM",
        message: "Connected to real-time notifications",
        timestamp: new Date().toISOString(),
      });
    }

    // REGISTER FEATURE HANDLERS
    setupGarbageHandlers(authSocket);
    setupDealerHandlers(authSocket);


    // Handle disconnection
    authSocket.on("disconnect", (reason: string) => {
      console.log(`\n Socket disconnected:`);
      console.log(`   Socket ID: ${authSocket.id}`);
     console.log(`   User: ${authSocket.userEmail} (${authSocket.userRole})`);
      console.log(`   Reason: ${reason}`);
      console.log(`   Was in rooms:`, Array.from(authSocket.rooms));
      console.log();
      
    });

    // HANDLE CONNECTION ERRORS

    socket.on("error", (error: Error) => {
      console.error(`Socket error for ${authSocket.userEmail}:`, error);
    });

  });

  console.log("✅ Socket event handlers registered");
};
