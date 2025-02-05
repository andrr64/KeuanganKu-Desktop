export interface ExpenseInterface {
    id?: number;
    title: string;
    description?: string;
    amount: number;
    category_id: number;
    wallet_id: number;
    createdAt: Date;
    updatedAt: Date;
}