import {Socket, Server as SocketIOServer} from "socket.io";
import { Server as HTTPServer} from "http";
import { CLIENT_URL } from "../config/constants";

// type defination for socket server
export interface AuthenticationSocket extends Socket {
    userId?: string;
    userRole?: string;
    userEmail?: string;
}

//**
// Initialize Socket.IO server 
// @params httpServer - HTTPserver instance from express
// @returns Configured Socket.IO server instance
//  */
export const initializeSocketServer = (httpServer: HTTPServer): SocketIOServer => {
    const io = new SocketIOServer(httpServer, {
        cors: {
            origin: CLIENT_URL,
            methods: ["GET", "POST"],
            credentials: true,
        },

        // Connection options
        pingTimeout: 60000,
        pingInterval: 25000,

        transports: ["websocket", "polling"], // long polling as fallback

    })

    console.log("Socket.IO server initialized")

    return io;
}