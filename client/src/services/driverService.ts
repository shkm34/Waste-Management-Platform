import apiClient from "./api";
import { Garbage, ApiResponse } from "../types";

/**
 * Get driver's assigned pickups
 */

export const getMyAssignments = async (): Promise<Garbage[]> => {
  const response = await apiClient.get<ApiResponse<{ assignedGarbage: Garbage[] }>>(
    "/garbage/my-assignments"
  );
  console.log("API Response:", response.data);
  return response.data.data!.assignedGarbage;
};

/**
 * Update status to ready to pick
 */

export const markReadyToPick = async (garbageId: string): Promise<Garbage> => {
  const response = await apiClient.patch<ApiResponse<{ garbage: Garbage }>>(
    `/garbage/${garbageId}/ready-to-pick`
  );
  return response.data.data!.garbage;
};

/**
 * Update status to picked up
 */

export const markPickedUp = async (garbageId: string): Promise<Garbage> => {
  const response = await apiClient.patch<ApiResponse<{ garbage: Garbage }>>(
    `/garbage/${garbageId}/picked-up`
  );
  return response.data.data!.garbage;
};

/**
 * Update status to delivered
 */

export const markDelivered = async (garbageId: string): Promise<Garbage> => {
  const response = await apiClient.patch<ApiResponse<{ garbage: Garbage }>>(
    `/garbage/${garbageId}/delivered`
  );
  return response.data.data!.garbage;
};
