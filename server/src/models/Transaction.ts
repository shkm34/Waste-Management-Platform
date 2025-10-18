import mongoose, { Schema, Model } from "mongoose";
import { TRANSACTION_TYPES } from "../config/constants";
import { ITransactionDocument } from "../types/transaction.types";

const TransactionSchema = new Schema({
    customerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Customer ID is required"],
    },
    garbageId: {
        type: Schema.Types.ObjectId,
        ref: "Garbage",
        required: [true, "Garbage ID is required"],
    },
    amount: {
        type: Number,
        required: [true, "Amount is required"],
        min: [0, "Amount must be positive"],
    },
    transactionType: {
        type: String,
        required: true,
        enum: {
            values: Object.values(TRANSACTION_TYPES),
            message: "{VALUE} is not a valid transaction type",
        },
    },
    description: {
        type: String,
    },
},
    {
        timestamps: { createdAt: true, updatedAt: false }
    }
);

// Indexes
TransactionSchema.index({ customerId: 1, createdAt: -1})
TransactionSchema.index({garbage: 1})

const Transaction: Model<ITransactionDocument> = mongoose.model<ITransactionDocument>(
    'Transaction',
    TransactionSchema
)

export default Transaction

