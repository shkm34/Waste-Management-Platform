export interface Transaction {
    _id: string,
    customerId: string,
    garbageId: {
        _id: string;
        wasteType: string;
        weight: number;
        status: string;
    },
    amount: number,
    transactionType: 'credit' | 'debit',
    description: string,
    createdAt: string
}