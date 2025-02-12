export interface WalletInterface {
    id: number;
    name: string;
    description?: string;
    balance: number;
    createdAt: Date;
    updatedAt: Date;
}