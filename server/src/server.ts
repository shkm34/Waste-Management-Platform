import dotenv from "dotenv";
import http from "http";
import path from "path";
import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import { initializeSocketServer } from "./socket/socketServer"; 
import { setupSocketAuthentication} from "../src/socket/middlewares/socketAuth"; 
import { setupSocketHandlers } from "./socket/handlers/index ";
import { AuthenticatedSocket } from "./socket/middlewares/socketAuth";

import { connectDatabase, setupDatabaseEvents } from "./config/database";
import { PORT, CLIENT_URL, NODE_ENV } from "./config/constants";
import { errorHandler } from './middleware/errorMiddleware';
import authRoutes from './routes/authRoutes';
import garbageRoutes from './routes/garbageRoutes';
import transactionRoutes from './routes/transactionRoutes';

dotenv.config();

const app: Application = express();

// Create HTTP server from Express app
const httpServer = http.createServer(app);

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true, // Allow cookies if needed
  })
);

// Body Parser - Parse JSON request bodie
app.use(express.json());

// URL Encoded - Parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Log each request to the console
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Serve static test page (development only)
if (NODE_ENV === "development") {
  app.use(express.static(path.join(__dirname, "../public")));
  
  app.get("/test", (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../public/socket-test.html"));
  });
}

// Routes //

// Health check route
app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    environment: NODE_ENV,
    time: new Date().toISOString(),
  });
});

// Debug endpoint: View active rooms and connections
app.get('/api/socket-debug', (_req: Request, res: Response) => {
  const sockets = Array.from(io.sockets.sockets.values());
  
  const connections = sockets.map((s) => {
    const authSocket = s as AuthenticatedSocket;
    return {
      socketId: s.id,
      userId: authSocket.userId,
      role: authSocket.userRole,
      email: authSocket.userEmail,
      rooms: Array.from(s.rooms),
    };
  });

  res.json({
    success: true,
    data: {
      totalConnections: sockets.length,
      connections,
    },
  });
});

// API route
app.use('/api/auth', authRoutes);
app.use('/api/garbage', garbageRoutes);
app.use('/api/transactions', transactionRoutes);

app.get('/api/socket-status', (_req: Request, res: Response) => {
  const sockets = io.sockets.sockets;
  const connectedSockets = Array.from(sockets.values()).map((s) => {
    const authSocket = s as AuthenticatedSocket;
    return {
      socketId: s.id,
      userId: authSocket.userId,
      role: authSocket.userRole,
      email: authSocket.userEmail,
    };
  });

  res.json({
    success: true,
    data: {
      totalConnections: sockets.size,
      connections: connectedSockets,
    },
  });
});




app.post('/debug-body', (req, res) => {
  console.log('headers:', req.headers);
  console.log('body (raw):', req.body);
  res.json({ ok: true, body: req.body });
});

// Root route
app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "Waste Management Platform API",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      garbage: "/api/garbage",
      users: "/api/users",
      transactions: "/api/transactions",
    },
  });
});


// 404 error handling
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  });
});

app.use(errorHandler);

// initialize socket.io server
const io = initializeSocketServer(httpServer)
// setup socket authentication middleware
setupSocketAuthentication(io);
// setup socket handlers
setupSocketHandlers(io);


// Start Server
const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();
    setupDatabaseEvents();
    httpServer.listen(PORT, () => {
      console.log("\n" + "=".repeat(50));
      console.log("🚀 Waste Management Platform - Backend");
      console.log("=".repeat(50));
      console.log(`Environment: ${NODE_ENV}`);
      console.log(`Server: http://localhost:${PORT}`);
      console.log(`Health: http://localhost:${PORT}/api/health`);
      console.log("=".repeat(50) + "\n");
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
export { httpServer, io } // export for socket.io integration