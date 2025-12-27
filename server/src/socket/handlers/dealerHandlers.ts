import { AuthenticatedSocket } from "../middlewares/socketAuth";
import { USER_ROLES } from "../../config/constants";
// dealer specific event handler
// manages dealer connection to marketpalce updates
// dealer- joinMarketplace | leaveMarketplace

export const setupDealerHandlers = (
  socket: AuthenticatedSocket
): void => {
  socket.on("dealer:joinMarketplace", () => {
    //security check: only dealer can join
    if (socket.userRole !== USER_ROLES.DEALER) {
      socket.emit("error", {
        event: "dealer:joinMarketplace",
        message: "Unauthorized: Only dealers can access marketplace",
      });
      return
    }

    // join the marketplace room
    socket.join("dealer-marketplace")

    console.log(`Dealer joined marketplace:`);
    console.log(`   User: ${socket.userEmail}`);
    console.log(`   Socket ID: ${socket.id}`);

    // ackowledge successful join
     socket.emit("dealer:joinedMarketplace", {
      success: true,
      message: "Connected to marketplace updates",
      room: "dealer-marketplace",
    });
  });

  socket.on("dealer:leaveMarketplace", ()=>{
    socket.leave("dealer-marketplace")

    console.log(`Dealer left marketplace:`);
    console.log(`   User: ${socket.userEmail}`);
    console.log(`   Socket ID: ${socket.id}`);

    socket.emit("dealer:leftMarketplace", {
      success: true,
      message: "Disconnected from marketplace updates",
    })
  })
};
