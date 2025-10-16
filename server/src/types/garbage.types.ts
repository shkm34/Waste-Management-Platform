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
    driverId: Types.ObjectId
    dealerId: Types.ObjectId

    status: 'available' | 'claimed' | 'assigned' | 'ready_to_pick' | 'picked_up' | 'delivered' | 'accepted'

    originLocation: IGarbageLocation
    destinationLocation?: IGarbageLocation

    scheduledPickupDate: Date

    claimedAt?: Date
    assignedAt?: Date
    readyAt?: Date
    pickedUpAt?: Date
    deliveredAt?: Date
    acceptedAt?: Date
}

export interface IGarbageDocument extends IGarbage, Document {
    //_id: string
    createdAt: Date
    updatedAt: Date
}