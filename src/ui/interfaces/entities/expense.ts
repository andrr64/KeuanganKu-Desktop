import { ExpenseCategoryInterface } from "./expense_category";
import { WalletInterface } from "./wallet";

export interface ExpenseInterface {
    id: number;
    amount: number;
    title: string;
    description?: string;
    wallet: WalletInterface;
    category: ExpenseCategoryInterface;
    createdAt: Date;
    updatedAt: Date;
}