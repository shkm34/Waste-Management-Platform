import { Request, Response, NextFunction } from "express";
import { AppError } from "./errorMiddleware";
import { verifyToken } from "../utils/generateToken";
import User from "../models/User";

//  Extend Express Request to include user property
export interface AuthRequest extends Request {
  user?: {
    _id: string;
    email: string;
    role: string;
  };
}

// protect Middleware: check if req  is authorized, token exists, verify token,
// if user exists, attach matchedUser to res object if exist
export const protect = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // check if Authorization header exist & starts with Bearer
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1]; // Bearer <token> exist like this
    }

    // if token not exist
    if (!token) {
      throw new AppError(401, "Not authorized to access this route");
    }

    // Verify token
    const decoded = verifyToken(token);

    // Find user by _id in token payload
    const matchedUser = await User.findById(decoded.userId).select("-password");

    // check if user exist
    if (!matchedUser) {
      throw new AppError(401, "User no longer exists");
    }

    // Attach user to request object for downstream use
    // this is authenticated user - must be used to grant access to resources
    // a single source of truth for user info
    req.user = {
      _id: matchedUser._id.toString(),
      email: matchedUser.email,
      role: matchedUser.role,
    };

    next();
  } catch (error: any) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError(401, error.message || "Not authorized"));
    }
  }
};


// Authorize middleware - Check if user has required role
export const authorize = (allowedRoles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    // Check if user exists on request (protect middleware should set this)
    if (!req.user) {
      return next(new AppError(401, "User not authenticated"));
    }

    // Check if user's role is in allowed roles
    const isAuthorized = allowedRoles.includes(req.user.role);
    if (!isAuthorized) {
      return next(
        new AppError(
          403,
          `Role '${req.user.role}' is not authorized to access this route`
        )
      );
    }
    next();
  };
};
