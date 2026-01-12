//  Socket.IO Event Payload Types

// ===== Garbage Related Types =====
export interface GarbageCreatedPayload {
  _id: string;
  wasteType: string;
  weight: number;
  equivalentPrice: number;
  originLocation: string;
  scheduledPickupDate: string;
  status: string;
  createdAt: string;
  customer: {
    name: string;
    location: string;
    phone: string;
  } | null;
}

export interface GarbageClaimedPayload {
  garbageId: string;
  timestamp: string;
}

export interface GarbageStatusChangedPayload {
  _id: string;
  status: string;
  updatedAt: string;
  claimedAt?: string | null;
  assignedAt?: string | null;
  readyAt?: string | null;
  pickedUpAt?: string | null;
  deliveredAt?: string | null;
}

export interface GarbageSubscribePayload {
  garbageId: string;
}

export interface GarbageSubscribedPayload {
  success: boolean;
  garbageId: string;
  room: string;
  message: string;
}

// ===== Notification Types =====

export interface NotificationPayload {
  type: string;
  message: string;
  timestamp: string;
  read: boolean;
  garbageId?: string;
  metadata?: Record<string, string>;
}

// ===== Dealer Types =====

export interface DealerJoinedMarketplacePayload {
  success: boolean;
  message: string;
  room: string;
}

export interface DealerLeftMarketplacePayload {
  success: boolean;
  message: string;
}

// ===== Error Type =====

export interface SocketErrorPayload {
  event: string;
  message: string;
}

// ===== Connection Status =====

export interface ConnectionStatus {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  socketId: string | null;
}

/**
 * Socket Event Map
 * Maps event names to their payload types
 */
export interface SocketEventMap {
  // Connection events
  connect: void;
  disconnect: (reason: string) => void;
  connect_error: (error: Error) => void;

  // Garbage events
  "garbage:created": GarbageCreatedPayload;
  "garbage:claimed": GarbageClaimedPayload;
  "garbage:statusChanged": GarbageStatusChangedPayload;
  "garbage:subscribed": GarbageSubscribedPayload;
  "garbage:unsubscribed": {
    success: boolean;
    garbageId: string;
    message: string;
  };

  // Dealer events
  "dealer:joinedMarketplace": DealerJoinedMarketplacePayload;
  "dealer:leftMarketplace": DealerLeftMarketplacePayload;

  // Notification events
  "notification:new": NotificationPayload;

  // Error events
  error: SocketErrorPayload;
}
