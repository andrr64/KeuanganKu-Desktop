import { IncomeCategoryInterface } from "./income_category";
import { WalletInterface } from "./wallet";

export interface IncomeInterface {
    id: number;
    title: string;
    amount: number;
    createdAt: Date;
    updatedAt: Date;
    category: IncomeCategoryInterface;
    wallet: WalletInterface;
    description?: string;
    type: number;
}

export const INCOME_TYPE = 1;