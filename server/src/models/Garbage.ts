import mongoose, { Schema, Model } from "mongoose";
import { IGarbageDocument } from "../types/garbage.types";
import { WASTE_TYPES, GARBAGE_STATUS } from "../config/constants";

// Location sub-schema for origin and destination
// embedded

const LocationSchema = new Schema(
    {
        address: {
            type: String,
            required: [true, "Address is required"],
            trim: true,
        },
        latitude: {
            type: Number,
            min: -90,
            max: 90,
        },
        longitude: {
            type: Number,
            min: -180,
            max: 180,
        },
    },
    { _id: false }
);

// Garbage Schema

const GarbageSchema = new Schema<IGarbageDocument>(
    {
        wasteType: {
            type: String,
            required: [true, "Waste type is required"],
            enum: {
                values: Object.values(WASTE_TYPES),
                message: "{VALUE} is not valid waste type",
            },
        },
        weight: {
            type: Number,
            required: [true, "Weight is Required"],
            min: [0.1, "Weight must be at least 0.1kg"],
            max: [1000, "Weight cannot exceed 1000 kg"],
        },
        equivalentPrice: {
            type: Number,
            required: [true, "Price must be calculated"],
            min: [0, "Price cannot be negative"],
        },

        // Refrence to User collection
        customerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Customer ID is required"],
        },
        driverId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        dealerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        status: {
            type: String,
            required: true,
            enum: {
                values: Object.values(GARBAGE_STATUS),
                message: "{VALUE} is not a valid status",
            },
            default: GARBAGE_STATUS.AVAILABLE,
        },

        // Embedded locations
        originLocation: {
            type: LocationSchema,
            required: [true, "Origin location is required"],
        },
        destinationLocation: {
            type: LocationSchema,
            default: null,
        },

        scheduledPickupDate: {
            type: Date,
            required: [true, "Scheduled pickup date is required"],
        },

        // Timestamps for each status
        claimedAt: Date,
        assignedAt: Date,
        readyAt: Date,
        pickedUpAt: Date,
        deliveredAt: Date,
        acceptedAt: Date,
    },
    {
        timestamps: true,
    }
);


// Indexing
GarbageSchema.index({ status: 1 }); // Filter by status (most common)
GarbageSchema.index({ customerId: 1 }); // Customer's waste list
GarbageSchema.index({ driverId: 1 }); // Driver's assignments
GarbageSchema.index({ dealerId: 1 }); // Dealer's incoming
GarbageSchema.index({ status: 1, WasteType: 1 }); // Marketplace filtering
GarbageSchema.index({ dealerId: 1, status: 1 }); // Dealer's incoming by status


const Garbage: Model<IGarbageDocument> = mongoose.model<IGarbageDocument>(
    'Garbage',
    GarbageSchema
)

export default Garbage