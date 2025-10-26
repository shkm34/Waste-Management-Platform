import * as authService from "../services/authService";
import { LoginData, RegisterData, User } from "@/types";
import { useEffect, useState, createContext, ReactNode } from "react";

// Context Created
interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (data: LoginData) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}
export const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    loading: true,
    login: async () => { },
    register: async () => { },
    logout: () => { },
    isAuthenticated: false,
});

// Context Provider
interface AuthProviderProps {
    children: ReactNode;
}
export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    //Inilialize auth states from localStorage on mount
    useEffect(() => {
        const initAuth = async () => {
            try {
                const storedToken = localStorage.getItem("token");
                const storedUser = localStorage.getItem("user");

                if (storedToken && storedUser) {
                    setToken(storedToken);

                    // Verify token is still valid by fetching current user
                    // if token is invalid and getCurrentUser gives error-
                    // clear both states and localStorage
                    try {
                        const currentUser = await authService.getCurrentUser();
                        setUser(currentUser);
                        localStorage.setItem("user", JSON.stringify(currentUser));
                    } catch (error) {
                        console.error("Token validation Failed", error);
                        setToken(null);
                        setUser(null);
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                    }
                }
            } catch (error) {
                console.error("Auth initialization error:", error);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const register = async (data: RegisterData): Promise<void> => {
        try {
            const response = await authService.register(data);

            console.log(response)

            // update state after sucessful register
            setToken(response.token);
            setUser(response.user);

            // persist to localStorage
            localStorage.setItem("token", response.token);
            localStorage.setItem("user", JSON.stringify(response.user));
        } catch (error) {
            console.error("Registration Error:", error);
            throw error;
        }
    };

    const login = async (data: LoginData): Promise<void> => {
        try {
            const response = await authService.login(data);

            // update state after sucessful login
            setToken(response.token);
            setUser(response.user);

            // persist to localStorage
            localStorage.setItem("token", response.token);
            localStorage.setItem("user", JSON.stringify(response.user));
        } catch (error) {
            console.error("Login Error:", error);
            throw error;
        }
    };

    const logout = (): void => {
        setToken(null);
        setUser(null);
        // already removing localStorage item in authService
        authService.logout();
    };

    const isAuthenticated = !!token && !!user;

    const value: AuthContextType = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
};
