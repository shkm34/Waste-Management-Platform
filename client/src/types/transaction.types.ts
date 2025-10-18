export interface Transaction {
    _id: string,
    customerId: string,
    garbageId: string | {
        _id: string;
        type: string;
        weight: number;
        status: string;
    },
    amount: number,
    transactionType: 'credit' | 'debit',
    description: string,
    createdAt: string
}