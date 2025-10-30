import { WasteType } from "@/types";

export const API_URL = import.meta.env.VITE_API_URL ||
 'http://localhost:5000/api';

 export const WASTE_TYPES = {
    EWASTE: 'ewaste',
  PLASTIC: 'plastic',
  PET: 'PET',
} as const;

export const WASTE_TYPE_LABELS: Record<string, string> = {
  ewaste: 'E-Waste',
  plastic: 'Plastic',
  PET: 'PET Bottles',
};

export const PRICE_PER_KG: Record<WasteType, number> = {
    ewaste: 39,
    plastic: 25,
    PET: 33,
  };

export const GARBAGE_STATUS = {
  AVAILABLE: 'available',
  CLAIMED: 'claimed',
  ASSIGNED: 'assigned',
  READY_TO_PICK: 'ready_to_pick',
  PICKED_UP: 'picked_up',
  DELIVERED: 'delivered',
  ACCEPTED: 'accepted',
} as const;

export const STATUS_LABELS: Record<string, string> = {
  available: 'Available',
  claimed: 'Claimed',
  assigned: 'Assigned',
  ready_to_pick: 'Ready to Pick',
  picked_up: 'Picked Up',
  delivered: 'Delivered',
  accepted: 'Completed',
};

export const STATUS_COLORS: Record<string, string> = {
  available: 'bg-green-100 text-green-800',
  claimed: 'bg-blue-100 text-blue-800',
  assigned: 'bg-purple-100 text-purple-800',
  ready_to_pick: 'bg-yellow-100 text-yellow-800',
  picked_up: 'bg-orange-100 text-orange-800',
  delivered: 'bg-indigo-100 text-indigo-800',
  accepted: 'bg-gray-100 text-gray-800',
};


export const USER_ROLES = {
  CUSTOMER: 'customer',
  DRIVER: 'driver',
  DEALER: 'dealer',
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  CUSTOMER_DASHBOARD: '/customer/dashboard',
  DRIVER_DASHBOARD: '/driver/dashboard',
  DEALER_DASHBOARD: '/dealer/dashboard',
  DEALER_MARKETPLACE: '/dealer/dashboard/marketplace',
  GET_GARBAGE_BY_ID: '/garbage/:id',
  GET_GARBAGE_PATH: (id: string) => `/garbage/${id}`
};