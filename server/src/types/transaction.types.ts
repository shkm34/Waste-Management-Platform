import {Document, Types} from 'mongoose'
export interface ITransaction{
    customerId: Types.ObjectId
    garbageId: Types.ObjectId
    amount: number
    transactionType: 'credit' | 'debit'
    description?: string
}

export interface ITransactionDocument extends ITransaction, Document {
    createdAt: Date
}