import { ExpenseCategoryInterface } from "./expense_category.js";
import { WalletInterface } from "./wallet.js";

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
