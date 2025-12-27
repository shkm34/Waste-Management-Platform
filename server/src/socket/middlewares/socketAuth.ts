import { Server as SocketIOServer, Socket } from "socket.io";
import jwt  from "jsonwebtoken";
import { JWT_SECRET } from "../../config/constants";
import User from "../../models/User";

// Define structure of JWT payload

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

// extend socket type for custom propertise
export interface AuthenticatedSocket extends Socket {
  userId: string;
  userEmail: string;
  userRole: string;
}

// Socket authentication middleware
// flow :- client connets io() -> server extracts token from handshake
// -> verify JWT -> attach user info to socket for handler use
// --> accept or reject connection

export const setupSocketAuthentication = (io: SocketIOServer): void => {
  io.use(async (socket: Socket, next) => {
    try {
      // extract token from handshake auth
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Authentication error: Token not provided"));
      }

      // verify JWT token
      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

      // verify if user still exist in DB
      // case: when user is deleted but token still valid
      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }

      // attach user info to socket instance
      // -> available for all event handler

      (socket as AuthenticatedSocket).userId = decoded.userId;
      (socket as AuthenticatedSocket).userRole = decoded.role;
      (socket as AuthenticatedSocket).userEmail = decoded.email;

      console.log(`Socket authenticated: ${user.name} (${user.role})`);

      // allow connect go further
      next();
    } catch(error) {
      // JWT verification failed or other error
      console.error("Socket authentication failed:", error);
      next(new Error("Authentication error: Invalid token"));
    }
  });
};
