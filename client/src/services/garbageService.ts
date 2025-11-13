import apiClient from "./api";
import {
    Garbage,
    CreateGarbageData,
    ApiResponse,
    PaginatedResponse,
    Transaction,
    SimpleResponse
} from "@/types";

// Create new waste listing

export const createGarbage = async (
    data: CreateGarbageData
): Promise<Garbage> => {
    const response = await apiClient.post<ApiResponse<{ garbage: Garbage }>>(
        "/garbage/create",
        data
    );
    return response.data.data!.garbage;
};

// delete created garbage
export const deleteGarbage = async (garbageId: string): Promise<SimpleResponse> =>{
    const response = await apiClient.delete<SimpleResponse>(`/garbage/${garbageId}/delete`)

    return response.data
}

// get customer waste listing
export const getMyWaste = async (): Promise<Garbage[]> => {
    const response = await apiClient.get<ApiResponse<{ garbage: Garbage[] }>>(
        "/garbage/my-waste"
    );
    return response.data.data!.garbage;
};

// get single garbage details
export const getGarbageById = async (id: string): Promise<Garbage> => {
    const response = await apiClient.get<ApiResponse<{ garbage: Garbage }>>(
        `/garbage/${id}`
    );
    return response.data.data!.garbage;
};

// get customer wallet balance
export const getWalletBalance = async (): Promise<number> => {
    const response = await apiClient.get<ApiResponse<{ balance: number }>>(
        "/transactions/balance"
    );
    return response.data.data!.balance;
};

// get customer transaction history
export const getMyTransactions = async (
    page: number = 1,
    limit: number = 5
) => {
    const response = await apiClient.get<PaginatedResponse<Transaction>>(
        `/transactions/my-transactions?page=${page}&limit=${limit}`
    );
    return response.data;
};
