import apiClient from "./api";
import { LoginData, RegisterData, User, AuthResponse} from "@/types";

// Register new user
export const register = async(data: RegisterData): Promise<{user: User, token: string}>=>{
    const response = await apiClient.post<AuthResponse>('/auth/register', data)

    return response.data.data
}

export const login = async(data: LoginData): Promise<{user: User, token: string}>=>{
    const response = await apiClient.post('/auth/login', data)
    return response.data.data
}

export const getCurrentUser = async() => {
    const response = await apiClient.get('/auth/me')
    return response.data.data!.user
}

export const logout = (): void=>{
    localStorage.removeItem('token')
    localStorage.removeItem('user');
}