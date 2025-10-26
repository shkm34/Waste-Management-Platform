import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import User from "../models/User";
import { generateToken } from "../utils/generateToken";
import { AppError, asyncHandler } from "../middleware/errorMiddleware";
import { USER_ROLES } from "../config/constants";

export const register = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { name, email, phone, password, role, location, dealerTypes } =
      req.body;

    // Validate required fields
    if (!name || !email || !phone || !password || !role) {
      return next(new AppError(400, "Please provide all required fields"));
    }

    // Validate role
    const validRoles = Object.values(USER_ROLES);
    if (!validRoles.includes(role)) {
      return next(new AppError(400, "Invalid role specified"));
    }

    const existingUser = await User.findOne({
      $or: [
        { email: email },
        { phone: phone }
      ]
    });

    if (existingUser) {
      // Check 1: Did the user exist because of the email?
      if (existingUser.email === email) {
        return next(new AppError(400, "User already exists with this email"));
      }

      // Check 2: Did the user exist because of the phone?
      if (existingUser.phone === phone) {
        return next(new AppError(400, "User already exists with this phone"));
      }
    }

    // Prepare user data
    const userData: {
      name: typeof name;
      email: typeof email;
      phone: typeof phone;
      password: typeof password;
      role: typeof role;
      location: typeof location;
      dealerTypes?: typeof dealerTypes;
    } = {
      name,
      email,
      phone,
      password,
      role,
      location,
    };

    // add Dealer specific fields
    if (role === USER_ROLES.DEALER) {
      if (!dealerTypes || dealerTypes.length === 0) {
        return next(
          new AppError(400, "Dealers must specify at least one waste type")
        );
      }
      userData.dealerTypes = dealerTypes;
    }

    // Create user
    const user = await User.create(userData);

    // Generate token
    const token = generateToken(user._id.toString(), user.email, user.role);

    // Send response
    res.status(201).json({
      sucess: true,
      message: "User Registered Succcessfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        location: user.location,
        ...(user.role === USER_ROLES.DEALER && {
          dealerTypes: user.dealerTypes,
        }),
        ...(user.role === USER_ROLES.CUSTOMER && {
          walletBalance: user.walletBalance,
        }),
        ...(user.role === USER_ROLES.DRIVER && {
          driverStatus: user.driverStatus,
        }),
      },
      token,
    });
  }
);

export const login = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    //validate input
    if (!email || !password) {
      return next(new AppError(400, "Please provide email and password"));
    }

    // Find user by email
    const matchedUser = await User.findOne({ email }).select("+password");

    // If user user not exist from that email
    if (!matchedUser) {
      return next(new AppError(401, "Invalid email or password"));
    }

    // verify password
    const isPasswordCorrect = await matchedUser?.comparePassword(password);

    if (!isPasswordCorrect) {
      return next(new AppError(401, "Invalid email or password"));
    }

    // Generate token
    const token = generateToken(
      matchedUser._id.toString(),
      matchedUser.email,
      matchedUser.role
    );

    // Send response

    res.status(200).json({
      sucess: true,
      message: "Login Successful",
      data: {
        user: {
          _id: matchedUser._id,
          name: matchedUser.name,
          email: matchedUser.email,
          phone: matchedUser.phone,
          role: matchedUser.role,
          location: matchedUser.location,
          ...(matchedUser.role === "dealer" && {
            dealerTypes: matchedUser.dealerTypes,
          }),
          ...(matchedUser.role === "customer" && {
            walletBalance: matchedUser.walletBalance,
          }),
          ...(matchedUser.role === "driver" && {
            driverStatus: matchedUser.driverStatus,
          }),
        },
        token,
      },
    });
  }
);

export const getMe = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    // User is already attached to req by protect middleware
    if (!req.user) {
      return next(new AppError(404, "User not found"));
    }

    // Find full user details
    const matchedUser = await User.findById(req.user._id);

    if (!matchedUser) {
      return next(new AppError(404, "User not found"));
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          _id: matchedUser._id,
          name: matchedUser.name,
          email: matchedUser.email,
          phone: matchedUser.phone,
          role: matchedUser.role,
          location: matchedUser.location,
          ...(matchedUser.role === "dealer" && {
            dealerTypes: matchedUser.dealerTypes,
          }),
          ...(matchedUser.role === "customer" && {
            walletBalance: matchedUser.walletBalance,
          }),
          ...(matchedUser.role === "driver" && {
            driverStatus: matchedUser.driverStatus,
          }),
        },
      },
    });
  }
);
