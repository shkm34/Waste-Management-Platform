import { Garbage } from "./garbage.types"
import { User } from "./user.types"

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

export interface ApiResponseAcceptDelivery {
  success: boolean
  message?: string
  data?: {
    garbage: Garbage,
    transaction: {
      _id: string,
      amount: number,
      type: 'credit' | 'debit',
      description: string
    },
    customerNewBalance: number,
  },
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

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    user: User;
    token: string;
  }
}
