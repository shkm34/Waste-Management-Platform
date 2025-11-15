import { Garbage } from "./garbage.types"
import { User } from "./user.types"
import { GARBAGE_STATUS } from "@/utils"

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
  error?: string
}

export interface ApiResponseClaimWaste {
  success: boolean
  message?: string
  data?: {
    garbage: Garbage,
    driver: {
      _id: string,
      name: string,
      phone: number
    }
  }
  error?: string
}

// shape of the data on a successful response
export interface AcceptDeliveryData {
  garbage: Garbage; 
  transaction: {
    _id: string;
    amount: number;
    type: 'credit' | 'debit';
    description: string;
  };
  customerNewBalance: number;
}

export interface ApiResponseAcceptDelivery {
  success: boolean
  message?: string
  data?: AcceptDeliveryData,
  error?: string
}

export interface ApiError {
  success: false
  error: string
  stack?: string
}

export interface PaginatedResponse<T> {
  success: boolean;
  count: number;
  total?: number;
  page?: number;
  pages?: number;
  data: {
    [key: string]: T[];
  };
}

// for garbage deletion 
export interface SimpleResponse {
  success: boolean;
  message?: string;
  data? : {
    garbage: Garbage
  }
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    user: User;
    token: string;
  }
}

export type DriverGarbageAction =
  | typeof GARBAGE_STATUS.READY_TO_PICK
  | typeof GARBAGE_STATUS.PICKED_UP
  | typeof GARBAGE_STATUS.DELIVERED;
