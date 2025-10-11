export const PORT = process.env.PORT || 5000;

export const NODE_ENV = process.env.NODE_ENV || "development";

export const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

export const JWT_SECTRET = process.env.JWT_SECTRET || "fallback-secret";

export const JWT_EXPIRE = process.env.JWT_EXPIRE || "30d";

// Status Value for garbage collection

export const GARBAGE_STATUS = {
  AVAILABLE: "available",
  CLAIMED: "claimed",
  ASSIGNED: "assigned",
  READY_TO_PICK: "ready_to_pick",
  PICKED_UP: "picked-up",
  DELIVERED: "delivered",
  ACCEPTED: "accepted",
} as const;

// User roles
export const USER_ROLES = {
  CUSTOMER: "customer",
  DRIVER: "driver",
  DEALER: "dealer",
} as const;

// Waste types
export const WASTE_TYPES = {
  EWASTE: "ewaste",
  PLASTIC: "plastic",
  PET: "PET",
} as const;

// Driver status
export const DRIVER_STATUS = {
  AVAILABLE: "available",
  BUSY: "busy",
  OFFLINE: "offline",
} as const;

// Transaction types
export const TRANSACTION_TYPES = {
  CREDIT: "credit",
  DEBIT: "debit",
} as const;
