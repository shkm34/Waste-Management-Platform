import apiClient from "./api";
import { Garbage, ApiResponse, ApiResponseClaimWaste, ApiResponseAcceptDelivery, AcceptDeliveryData, SimpleResponse } from "@/types";


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

// dealer unclaims waste
export const unclaimWaste = async(garbageId: string): Promise<SimpleResponse>=>{
    const response = await apiClient.patch<SimpleResponse>(
        `/garbage/${garbageId}/unclaim`
    )
    return response.data
}

// get incoming waste for dealer
export const getIncomingDeliveries = async(): Promise<Garbage[]>=>{
    const response = await apiClient.get<ApiResponse<{deliveries: Garbage[]}>>(
        '/garbage/incoming'
    )
    return response.data.data!.deliveries
}

// Accept delivered waste
export const acceptDelivery = async(garbageId: string): Promise<AcceptDeliveryData>=>{
    const response = await apiClient.patch<ApiResponseAcceptDelivery>(
        `/garbage/${garbageId}/accept`
    )
    const apiData = response.data;
    // Check for success and existence of data
  if (apiData.success && apiData.data) {
    return apiData.data; // Return the data on success
  } else {
    // Throw error if success is false or data is missing
    throw new Error(apiData.message || apiData.error || 'An unknown error occurred.');
  }
}


