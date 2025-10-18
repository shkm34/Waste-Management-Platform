import express from "express";
import { USER_ROLES } from "../config/constants";
import {
    createGarbage,
    getMarketplace,
    claimGarbage,
    getGarbageById,
    getMyGarbage,
    getMyAssignments,
    getDealerDeliveries,
    markReadyToPick,
    markPickedUp,
    markDelivered,
    acceptDelivery,
} from "../controllers/garbageController";
import { protect, authorize } from "../middleware/authMiddleware";

const router = express.Router();

// customer routes
router.post("/create", protect, authorize([USER_ROLES.CUSTOMER]), createGarbage);
router.get("/my-waste", protect, authorize([USER_ROLES.CUSTOMER]), getMyGarbage);

// Dealer routes
router.get("/marketplace", protect, authorize([USER_ROLES.DEALER]), getMarketplace);
router.get("/incoming", protect, authorize([USER_ROLES.DEALER]), getDealerDeliveries);
router.post("/:id/claim", protect, authorize([USER_ROLES.DEALER]), claimGarbage);
router.patch("/:id/accept", protect, authorize([USER_ROLES.DEALER]), acceptDelivery);

// Driver routes
router.get("/my-assignments", protect, authorize([USER_ROLES.DRIVER]), getMyAssignments);
router.patch("/:id/ready-to-pick", protect, authorize([USER_ROLES.DRIVER]), markReadyToPick);
router.patch("/:id/picked-up", protect, authorize([USER_ROLES.DRIVER]), markPickedUp);
router.patch("/:id/delivered", protect, authorize([USER_ROLES.DRIVER]), markDelivered)

// Common Routes (all authenticated users)
router.get("/:id", protect, getGarbageById);

export default router;
