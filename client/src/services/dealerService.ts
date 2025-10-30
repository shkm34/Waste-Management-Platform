import apiClient from "./api";
import { Garbage, ApiResponse, ApiResponseClaimWaste } from "@/types";


//get marketplace - available waste for dealer
export const getMarketplace = async(): Promise<Garbage[]>=>{
    const response = await apiClient.get<ApiResponse<{garbage: Garbage[]}>>(
        '/garbage/marketplace'
    )
    return response.data.data!.garbage
}

// dealer claims waste from marketplace
export const claimWaste = async(garbageId: string): Promise<any>=>{
    const response = await apiClient.post<ApiResponseClaimWaste>(
        `/garbage/${garbageId}/claim`
    )
    return response.data.data
}

// get incoming waste for dealer
export const getIncomingDeliveries = async(): Promise<Garbage[]>=>{
    const response = await apiClient.get<ApiResponse<{deliveries: Garbage[]}>>(
        '/garbage/incoming'
    )
    return response.data.data!.deliveries
}

// Accept delivered waste
export const acceptDelivery = async(garbageId: string): Promise<any>=>{
    const response = await apiClient.post<ApiResponseClaimWaste>(
        `/garbage/${garbageId}/accept`
    )
    return response.data.data
}


