
import { AuthenticatedSocket } from "../middlewares/socketAuth";
import Garbage from "../../models/Garbage";

// Garbage-specific event handlers
// purpose: Allow users to subscribe to updates for specific waste
// items

// Events handled:
//  - garbage:subscribe - Join room for specific garbage updates
//  - garbage:unsubscribe - Leave room

// * @param io - Socket.IO server instance
// * @param socket - Individual authenticated socket connection

export const setupGarbageHandlers = (
    socket: AuthenticatedSocket
): void => {
    socket.on("garbage:subscribe", async ({ garbageId }) => {
        try {
            // validate input
            if (!garbageId) {
                socket.emit("error", {
                    event: "garbage:subscribe",
                    message: "Garbage ID is required",
                });
                return;
            }

            // validate DB
            const garbage = await Garbage.findById(garbageId);

            if (!garbage) {
                socket.emit("error", {
                    event: "garbage:subscribe",
                    message: "Garbage not found",
                });
                return;
            }

            // Authorize user
            const isCustomer = garbage.customerId?.toString() === socket.userId;
            const isDriver = garbage.driverId?.toString() === socket.userId;
            const isDealer = garbage.dealerId?.toString() === socket.userId;

            if (!isCustomer && !isDriver && !isDealer) {
                socket.emit("error", {
                    event: "garbage:subscribe",
                    message: "Unauthorized: You are not associated with this waste item",
                });
                return;
            }

            // join the the garbage specific room
            const room = `garbage-${garbageId}`;
            socket.join(room);

            console.log(`User subscribed to garbage updates:`);
            console.log(`   User: ${socket.userEmail} (${socket.userRole})`);
            console.log(`   Garbage ID: ${garbageId}`);
            console.log(`   Room: ${room}`);

            // Acknowledgement
            socket.emit("garbage:subscribe", {
                success: true,
                garbageId,
                room,
                message: "Subscribed to waste updates",
            });
        } catch (error) {
            console.error("Error in garbage:subscribe:", error);
            socket.emit("error", {
                event: "garbage:subscribe",
                message: "Failed to subscribe to garbage updates",
            });
        }
    });

    // Unsubscribe for garbage updates
    // when user navigates away from garbage details page

    socket.on("garbage:unsubscribe", ({ garbageId }) => {
        if (!garbageId) return

        const room = `garbage-${garbageId}`;
        socket.leave(room);

        console.log(`User unsubscribed from garbage:`);
        console.log(`   User: ${socket.userEmail}`);
        console.log(`   Garbage ID: ${garbageId}`);

        // Acknowledgement
        socket.emit("garbage:unsubscribed", {
            success: true,
            garbageId,
            message: "Unsubscribed from waste updates",
        });
    })
};
