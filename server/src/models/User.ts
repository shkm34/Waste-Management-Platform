import mongoose, { Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";
import { IUserDocument } from "../types/user.types";
import { USER_ROLES, DRIVER_STATUS, WASTE_TYPES } from "../config/constants";

// Location Schema
const LocationSchema: Schema = new Schema(
  {
    address: {
      type: String,
      required: [true, "Address is Required"],
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

// User Schema
const UserSchema: Schema<IUserDocument> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is Required"],
      minLength: [2, "Name must be at least 2 characters"],
      maxLength: [100, "Name must be at most 100 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is Required"],
    
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Email is invalid"],
    },
    phone: {
      type: String,
      required: [true, "Phone is Required"],
      unique: true,
      trim: true,
      match: [/^\d{10}$/, "Phone number must be 10 digits"],
    },
    password: {
      type: String,
      required: [true, "Password is Required"],
      minLength: [6, "Password must be at least 6 characters"],
      select: false, // Exclude password from query results by default
    },
    role: {
      type: String,
      required: [true, "Role is Required"],
      enum: {
        values: Object.values(USER_ROLES), // makes array ['customer', 'driver', 'dealer']
        message: "{VALUE} is not a valid role",
      },
    },
    location: {
      type: LocationSchema,
      required: [true, "Location is Required"],
    },

    // customer specific
    walletBalance: {
      type: Number,
      default: 0,
      min: [0, "Wallet balance cannot be negative"],
    },

    // dealer specific
    dealerTypes: {
      type: [String],
      enum: {
        values: Object.values(WASTE_TYPES),
        message: "{VALUE} is not a valid waste type",
      },
      default: [],
    },

    // driver specific
    driverStatus: {
      type: String,
      enum: {
        values: Object.values(DRIVER_STATUS),
        message: "{VALUE} is not a valid driver status",
      },
      default: DRIVER_STATUS.AVAILABLE,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance, will be used in filtering and searching
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ driverStatus: 1 });
UserSchema.index({ role: 1, dealerTypes: 1 });

// Pre-save middleware : hash password before saving
UserSchema.pre("save", async function (next) {
  // Only hash if password is modified or new
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    // Hash password with salt
    this.password = await bcrypt.hash(this.password, salt);

    next();
  } catch (error: any) {
    next(error);
  }
});

// Instance method: Compare password for login
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<Boolean> {
  try {
    // Compare plain text password with hashed password
    const matched = await bcrypt.compare(candidatePassword, this.password);
    return matched;
  } catch (error) {
    throw new Error("Password comparison failed");
  }
};

//  Create and export User model
const User: Model<IUserDocument> = mongoose.model<IUserDocument>(
  "User",
  UserSchema
);

export default User;
