export interface GetIncomesProp {
    walletId: number;
    rangeType?: 'weekly' | 'monthly' | 'yearly';
    startDate?: string;
    endDate?: string;
}