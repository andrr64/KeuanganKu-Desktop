export interface IIncome {
  id: number;
  title: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
  categoryId: number;
  walletId: number;
  description?: string;
}