export interface IExpense {
  id: number;
  amount: number;
  date: Date;
  categoryId: number;
  walletId: number;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
