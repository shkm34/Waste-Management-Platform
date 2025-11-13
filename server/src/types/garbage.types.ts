import {Document, Types} from 'mongoose'

export interface IGarbageLocation {
    address: string
    latitude?: number
    longitude?: number
}

export interface IGarbage {
    wasteType: 'ewaste' | 'plastic' | 'PET'
    weight: number
    equivalentPrice: number

    customerId: Types.ObjectId
    driverId: Types.ObjectId | null
    dealerId: Types.ObjectId | null

    status: 'available' | 'claimed' | 'assigned' | 'ready_to_pick' | 'picked_up' | 'delivered' | 'accepted'

    originLocation: IGarbageLocation
    destinationLocation?: IGarbageLocation | null

    scheduledPickupDate: Date

    claimedAt?: Date | null
    assignedAt?: Date | null
    readyAt?: Date | null
    pickedUpAt?: Date | null
    deliveredAt?: Date | null
    acceptedAt?: Date | null
}

export interface IGarbageDocument extends IGarbage, Document {
    //_id: string
    createdAt: Date
    updatedAt: Date
}