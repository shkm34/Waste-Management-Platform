import { Server as SocketIOServer } from "socket.io";

// Reusable emitter functions for socket events
// centralizes event emission logic

// EMIT NEW GARBAGE TO MARKETPLACE
// @param io - Socket.IO server instance
// @param garbage - new garbage object created
export const emitGarbageCreated = (io: SocketIOServer, garbage: any): void => {
  const payload = {
    _id: garbage._id,
    wasteType: garbage.wasteType,
    weight: garbage.weight,
    equivalentPrice: garbage.equivalentPrice,
    status: garbage.status,
    originLocation: garbage.originLocation,
    scheduledPickupDate: garbage.scheduledPickupDate,
    createdAt: garbage.createdAt,
    // populated customer data if available
    customer: garbage.customerId
      ? {
          name: garbage.customerId.name,
          location: garbage.customerId.location,
          phone: garbage.customerId.phone,
        }
      : null,
  };
  io.to("dealer-marketplace").emit("garbage:created", payload);

  console.log(`Emitted garbage:created to dealer-marketplace`);
  console.log(`   Garbage ID: ${garbage._id}`);
  console.log(`   Type: ${garbage.wasteType}`);
};

// EMIT GARBAGE STATUS CHANGE TO SUBSCRIBED USERS
export const emitGarbageStatusChanged = (
  io: SocketIOServer,
  garbageId: string,
  updatedGarbage: any
): void => {
  const payload = {
     _id: updatedGarbage._id,
    status: updatedGarbage.status,
    updatedAt: new Date().toISOString(),
    // relevant timestamps
    claimedAt: updatedGarbage.claimedAt,
    assignedAt: updatedGarbage.assignedAt,
    readyAt: updatedGarbage.readyAt,
    pickedUpAt: updatedGarbage.pickedUpAt,
    deliveredAt: updatedGarbage.deliveredAt,
  }

  const room = `garbage-${garbageId}`
  io.to(room).emit("garbage:statusChanged", payload);

  console.log(`📡 Emitted garbage:statusChanged to ${room}`);
  console.log(`   Status: ${updatedGarbage.status}`);
}

// EMIT GARBAGE CLAIMED EVENT
// remove this garbage from marketplace
export const emitGarbageClaimed = (
  io: SocketIOServer,
  garbageId: string
): void => {
  io.to("dealer-marketplace").emit("garbage:claimed", {
    garbageId,
    timestamp: new Date().toISOString(),
  });

  console.log(`📡 Emitted garbage:claimed to dealer-marketplace`);
  console.log(`   Garbage ID: ${garbageId}`);
}

// SEND PERSONAL NOTIFICATION TO SPECIFIC USER
export const emitNotificationToUser = (
  io: SocketIOServer,
  userId: string,
  notification: {
    type: string;
    message: string;
    garbageId?: string;
    metadata?: any;
  }
): void => {
  const payload = {
    ...notification,
    timestamp: new Date().toISOString(),
    read: false,
  };

  const room = `user-${userId}`;
  io.to(room).emit("notification:new", payload);

  console.log(`Emitted notification:new to ${room}`);
  console.log(`   Type: ${notification.type}`);
  console.log(`   Message: ${notification.message}`);
};