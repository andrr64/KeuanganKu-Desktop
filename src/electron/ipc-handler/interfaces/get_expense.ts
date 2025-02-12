export interface GetExpenseProp {
    walletId: number;
    rangeType?: 'weekly' | 'monthly' | 'yearly';
    startDate?: string;
    endDate?: string;
}