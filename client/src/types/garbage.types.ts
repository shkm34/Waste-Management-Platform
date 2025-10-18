import { Location } from "./user.types";

export type WasteType = 'ewaste' | 'plastic' | 'PET';

export type GarbageStatus =
    | 'available'
    | 'claimed'
    | 'assigned'
    | 'ready_to_pick'
    | 'picked_up'
    | 'delivered'
    | 'accepted';

export interface Garbage {
    _id: string;
    wasteType: WasteType;
    weight: number;
    equivalentPrice: number;

    customerId: string | {
        _id: string;
        name: string;
        phone: string;
        location: Location;
    };

    driverId?: string | {
        _id: string;
        name: string;
        phone: string;
        location: Location;
    };

    dealerId: string | {
        _id: string;
        name: string;
        phone: string;
        location: Location;
    };

    status: GarbageStatus

    originLocation: Location
    destinationLocation?: Location

    scheduledPickupDate: string;

    claimedAt?: string;
    assignedAt?: string;
    readyAt?: string;
    pickedUpAt?: string;
    deliveredAt?: string;
    acceptedAt?: string;

    createdAt: string;
    updatedAt: string;
}

export interface CreateGarbageData {
    wasteType: WasteType,
    weight: number,
    location: Location,
    scheduledPickupDate: string
}