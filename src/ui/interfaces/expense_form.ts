export interface ExpenseFormInterface {
    title: string;
    description?: string;
    wallet_id: number;
    category_id: number;
    amount: number;
}