import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { API_URL } from "@/utils";

// create axios instance with base url and header type
const apiClient: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000
})

// Request Interceptor - adds JWT token to every response
// 1st function: on Fullfilled
// 2nd function: on Rejected
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // get token from localstorage
        const token = localStorage.getItem('token')

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    (error: AxiosError) => {
        return Promise.reject(error)
    }
)

// Response Interceptor
// 1st function: on Fullfilled - response is returned
// 2nd function: on Rejected - Global errors are handled
apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response
    },
    (error: AxiosError) => {
        if (error.response) {
            const status = error.response.status

            switch (status) {
                case 401:
                    // request was unauthenticated
                    // clear token from localStorage
                    // redirect user to login
                    localStorage.removeItem('token')
                    localStorage.removeItem('user')
                    window.location.href = '/login'
                    break

                case 403:
                    // Forbibben: do not have sufficient 
                    // permission
                    console.error('Access Forbidden')
                    break

                case 404:
                    // Not Found - requested endpoint 
                    // do not exist on server
                    console.error('Resource Not Found')
                    break

                case 500:
                    // Internal Server Error
                    console.error('Server Error')
                    break

                default:
                    console.error('Request failed:', error.response.data)
            }
        } else if (error.request) {
            console.log('Request made but no response received')
        } else {
            console.error('Request setup error:', error.message)
        }

        return Promise.reject(error)
    }
)

export default apiClient