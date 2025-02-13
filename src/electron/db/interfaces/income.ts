import { IncomeCategoryInterface } from "./income_category.js";
import { WalletInterface } from "./wallet.js";

export interface IncomeInterface {
  id: number;
  title: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
  category: IncomeCategoryInterface;
  wallet: WalletInterface;
  description?: string;
  type: 1;
}