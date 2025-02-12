export interface IExpense {
  id: number;
  amount: number;
  categoryId: number;
  walletId: number;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
