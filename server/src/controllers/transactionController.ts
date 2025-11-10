import { NextFunction, Response } from "express";
import User from "../models/User";
import { AuthRequest } from "../middleware/authMiddleware";
import Transaction from "../models/Transaction";
import { AppError, asyncHandler } from "../middleware/errorMiddleware";

export const getMyTransactions = asyncHandler(
    async (req: AuthRequest, res: Response, _next: NextFunction) => {
        const { page = 1, limit = 10 } = req.query;

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        const myId = req.user!._id

        // find transaction
        const transactions = await Transaction.find({ customerId: myId })
            .populate('garbageId', 'wasteType weight status')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum)

        // Get total count for pagination
        const total = await Transaction.countDocuments({ customerId: req.user!._id });

        res.status(200).json({
            success: true,
            count: transactions.length,
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum),
            data: { transactions },
        });

    }
)

export const getWalletBalance = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        const user = await User.findById(req.user!._id).select('walletBalance')

        if (!user) {
            return next(new AppError(404, 'User not found'))
        }

        res.status(200).json(
            {
                success: true,
                data: {
                    balance: user.walletBalance || 0
                }
            }
        )
    }
)
