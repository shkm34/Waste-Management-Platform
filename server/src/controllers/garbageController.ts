import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Garbage from "../models/Garbage";
import User from "../models/User";
import { calculatePrice } from "../utils/calculatePrice";
import { AppError, asyncHandler } from "../middleware/errorMiddleware";
import { DRIVER_STATUS, GARBAGE_STATUS, USER_ROLES } from "../config/constants";
import mongoose from "mongoose";

// create new waste
export const createGarbage = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        const { wasteType, weight, location, scheduledPickupDate } = req.body;

        // validate required fields
        if (!wasteType || !weight || !location || !scheduledPickupDate) {
            return next(new AppError(400, "Please provide all required fields"));
        }

        // validate pickup date is not in past
        const pickupDate = new Date(scheduledPickupDate);
        if (pickupDate < new Date()) {
            return next(new AppError(400, "Pickup date cannot be in past"));
        }

        // calculate
        const equivalentPrice = calculatePrice(wasteType, weight);

        const garbage = await Garbage.create({
            wasteType,
            weight,
            equivalentPrice,
            customerId: req.user!._id,
            status: GARBAGE_STATUS.AVAILABLE,
            originLocation: location,
            scheduledPickupDate: pickupDate,
        });
        res.status(201).json({
            success: true,
            message: "Waste listing created successfully",
            data: { garbage },
        });
    }
);

// Get available Garbage Marketplace for dealers

export const getMarketplace = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        // find dealer to get its waste type
        const dealer = await User.findById(req.user!._id);

        // validate if dealer has selected his waste type
        if (!dealer || !dealer.dealerTypes || dealer.dealerTypes.length === 0) {
            return next(new AppError(400, "Dealer types not configured"));
        }

        // find garbage available matching dealer waste type
        const availableGarbage = await Garbage.find({
            status: GARBAGE_STATUS.AVAILABLE,
            wasteType: { $in: dealer.dealerTypes },
        })
            .populate("customerId", "name email phone location")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: availableGarbage.length,
            data: { garbage: availableGarbage },
        });
    }
);

// Dealer claims waste from marketplace
// route: POST /api/garbage/:id/claim
// private for dealer only

export const claimGarbage = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        const garbageId = new mongoose.Types.ObjectId(req.params.id);

        // find garbage
        const selectedGarbage = await Garbage.findById(garbageId);

        // check if no garbage
        if (!selectedGarbage) {
            return next(new AppError(404, "Garbage Not Found"));
        }

        // check if selected garbage not already claimed
        //  or status is not available
        if (selectedGarbage.status !== GARBAGE_STATUS.AVAILABLE) {
            return next(new AppError(401, "This waste has already been claimed"));
        }

        // check if dealer accept the selected wasteType
        const dealer = await User.findById(req.user!._id);
        const hasCompatibleWasteType = dealer?.dealerTypes?.includes(
            selectedGarbage.wasteType
        );
        if (!hasCompatibleWasteType) {
            return next(
                new AppError(400, "Your facility does not accept this waste type")
            );
        }

        // update garbage with dealer info
        selectedGarbage.dealerId = new mongoose.Types.ObjectId(dealer?._id);
        selectedGarbage.destinationLocation = dealer?.location;
        selectedGarbage.status = GARBAGE_STATUS.CLAIMED;
        selectedGarbage.claimedAt = new Date();


        // assign driver if any available
        const availableDriver = await User.find({
            role: USER_ROLES.DRIVER,
            driverStatus: DRIVER_STATUS.AVAILABLE,
        });

        if (availableDriver.length === 0) {
            return next(
                new AppError(
                    503,
                    "No drivers available at the moment. Please try again later"
                )
            );
        }

        // select a random driver
        const randomIndex = Math.floor(Math.random() * availableDriver.length);
        const selectedDriver = availableDriver[randomIndex];

        // Assign driver
        selectedGarbage.driverId = selectedDriver._id as any;
        selectedGarbage.status = GARBAGE_STATUS.ASSIGNED;
        selectedGarbage.assignedAt = new Date();


        // Update driver status to busy
        selectedDriver.driverStatus = DRIVER_STATUS.BUSY;
        await selectedDriver.save();

        await selectedGarbage.save();

        // populate the ObjectId field details
        await selectedGarbage.populate([
            { path: "customerId", select: "name email phone location" },
            { path: "driverId", select: "name email phone" },
        ]);

        res.status(200).json({
            success: true,
            message: "Waste claimed successfully. Driver assigned.",
            data: {
                selectedGarbage,
                assignedDriver: {
                    _id: selectedDriver._id,
                    name: selectedDriver.name,
                    phone: selectedDriver.phone,
                },
            },
        });
    }
);

// Get customer all created waste list -
// Private: customer only
export const getMyGarbage = asyncHandler(
    async (req: AuthRequest, res: Response, _next: NextFunction) => {
        const myId = req.user!._id;

        const myGarbage = await Garbage.find({ customerId: myId })
            .populate([
                { path: "driverId", select: "name phone location" },
                { path: "dealerId", select: "name phone location" },
            ])
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: myGarbage.length,
            data: { garbage: myGarbage },
        });
    }
);

// Get driver all assigned pickups
// Private: driver only
export const getMyAssignments = asyncHandler(
    async (req: AuthRequest, res: Response, _next: NextFunction) => {
        const myId = req.user!._id;

        const assignedGarbage = await Garbage.find({
            driverId: myId,
            status: {
                $in: [
                    GARBAGE_STATUS.ASSIGNED,
                    GARBAGE_STATUS.PICKED_UP,
                    GARBAGE_STATUS.READY_TO_PICK,
                ],
            },
        })
            .populate([
                { path: "customerId", select: "name phone location" },
                { path: "dealerId", select: "name phone location" },
            ])
            .sort({ scheduledPickupDate: 1 });

        res.status(200).json({
            success: true,
            count: assignedGarbage.length,
            data: { assignedGarbage },
        });
    }
);

// get dealer"s all deliveries
// private: dealer only
export const getDealerDeliveries = asyncHandler(
    async (req: AuthRequest, res: Response, _next: NextFunction) => {
        const myId = req.user!._id

        const allDeliveries = await Garbage.find({
            dealerId: myId,
            status: {
                $in: [
                    GARBAGE_STATUS.ASSIGNED,
                    GARBAGE_STATUS.READY_TO_PICK,
                    GARBAGE_STATUS.PICKED_UP,
                    GARBAGE_STATUS.ACCEPTED,
                    GARBAGE_STATUS.DELIVERED
                ]
            }
        }).populate([
            { path: 'customerId', select: 'name, phone, location' },
            { path: 'driverId', select: 'name phone location' }
        ])

        res.status(200).json(
            {
                success: true,
                count: allDeliveries,
                data: { deliveries: allDeliveries }
            }
        )
    }
)

// get single garbage details
// private: for customer, driver, dealer
export const getGarbageById = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        const garbageId = req.params.id
        const garbage = await Garbage.findById(garbageId)
            .populate('customerId', 'name email phone location')
            .populate('driverId', 'name email phone driverStatus')
            .populate('dealerId', 'name email phone location dealerType')


        if (!garbage) {
            return next(new AppError(404, 'GarbageNot Found'))
        }

        // check authorization - if user has authority to see garbage
        // users can see only garbage they are involved in
        const userId = req.user!._id
        const isAuthorized =
            garbage.customerId?._id.toString() === userId ||
            garbage.dealerId?._id.toString() === userId ||
            garbage.driverId?._id.toString() === userId

        if (!isAuthorized) {
            return next(new AppError(403, 'Not aUthorized to view this garbage'))
        }

        res.status(200).json(
            {
                success: true,
                data: { garbage }
            }
        )
    }

)
