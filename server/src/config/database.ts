import mongoose from "mongoose";

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    await mongoose.connect(mongoURI);

    console.log("✓ MongoDB connected successfully");
    console.log(`  Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error("✗ MongoDB connection failed:", error);
    process.exit(1);
  }
};

/**
 * Handle database connection events
 */

export const setupDatabaseEvents = (): void => {
  mongoose.connection.on("error", (error) => {
    console.error("MongoDB connection error:", error);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected. Attempting to reconnect...");
  });

  mongoose.connection.on("reconnected", () => {
    console.log("MongoDB reconnected successfully");
  });

  // shutdown on signal interrupt
  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("MongoDB connection closed due to app termination");
    process.exit(0);
  });
};
