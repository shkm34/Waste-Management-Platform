import { User } from "./user.types"

export interface ApiResponse<T> {
    success: boolean
    message?: string
    data?: T
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
    data:{
        user: User;
        token: string;
    }
}
