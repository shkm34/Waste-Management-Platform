// Socket.io client configurations

export const SOCKET_CONFIG = {
  // Server URL from environment or fallback
  url: import.meta.env.VITE_SOCKET_URL || "http://localhost:5000",

  // Connection options
  options: {
    // Don't connect immediately - wait for auth token
    autoConnect: import.meta.env.VITE_SOCKET_AUTO_CONNECT === "true" || false,

    // fallback to polling
    transports: ["websocket", "polling"],

    // Reconnection settings
    reconnection: true,
    reconnectionDelay: 1000, // Start with 1s delay
    reconnectionDelayMax: 5000, // Max 5s delay
    reconnectionAttempts: 5, // Try 5 times before giving up

    // Timeout settings
    timeout: 20000, // 20s connection timeout
  },

  // Enable debug logs in development
  debug: import.meta.env.VITE_SOCKET_DEBUG === "true",
};

export const SOCKET_EVENTS = {
  // Connection events
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  CONNECT_ERROR: "connect_error",
  RECONNECT: "reconnect",
  RECONNECT_ATTEMPT: "reconnect_attempt",
  RECONNECT_FAILED: "reconnect_failed",

  // Dealer events
  DEALER_JOIN_MARKETPLACE: "dealer:joinMarketplace",
  DEALER_LEAVE_MARKETPLACE: "dealer:leaveMarketplace",
  DEALER_JOINED_MARKETPLACE: "dealer:joinedMarketplace",
  DEALER_LEFT_MARKETPLACE: "dealer:leftMarketplace",

  // Garbage events
  GARBAGE_CREATED: "garbage:created",
  GARBAGE_CLAIMED: "garbage:claimed",
  GARBAGE_STATUS_CHANGED: "garbage:statusChanged",
  GARBAGE_SUBSCRIBE: "garbage:subscribe",
  GARBAGE_UNSUBSCRIBE: "garbage:unsubscribe",
  GARBAGE_SUBSCRIBED: "garbage:subscribed",
  GARBAGE_UNSUBSCRIBED: "garbage:unsubscribed",

  // Notification events
  NOTIFICATION_NEW: "notification:new",

  // Error event
  ERROR: "error",
} as const;

// Helpers to generate room name
export const SOCKET_ROOMS = {
  dealerMarketplace: () => "dealer-marketplace",
  driverQueue: () => "driver-queue",
  garbage: (garbageId: string) => `garbage-${garbageId}`,
  user: (userId: string) => `user-${userId}`,
} as const;
