export interface GetExpensesProp {
    walletId: number;
    rangeType?: 'weekly' | 'monthly' | 'yearly';
    startDate?: string;
    endDate?: string;
}