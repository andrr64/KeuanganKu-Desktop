export interface IWallet {
  id: number;
  name: string;
  description?: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

