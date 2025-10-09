import dotenv from "dotenv";
import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import { connectDatabase, setupDatabaseEvents } from "./config/database";
import { PORT, CLIENT_URL, NODE_ENV } from "./config/constants";
import { errorHandler } from './middleware/errorMiddleware';

dotenv.config();

const app: Application = express();

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

// Start Server
const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();
    setupDatabaseEvents();
    app.listen(PORT, () => {
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