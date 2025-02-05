import WalletModel from '../models/wallet.js';
import { WalletInterface } from '../interfaces/wallet.js';

// Add a new wallet
export const addWallet = async (wallet: WalletInterface): Promise<WalletInterface> => {
    const newWallet = await WalletModel.create({
        title: wallet.title
    });
    return newWallet.toJSON();
};

// Read all wallets
export const readWallets = async (): Promise<WalletInterface[]> => {
    const wallets = await WalletModel.findAll();
    return wallets.map(wallet => wallet.toJSON());
};

// Read wallet by ID
export const readWalletById = async (id: number): Promise<WalletInterface | null> => {
    const wallet = await WalletModel.findByPk(id);
    return wallet ? wallet.toJSON() : null;
};

// Update a wallet
export const updateWallet = async (id: number, updates: Partial<WalletInterface>): Promise<boolean> => {
    const [updated] = await WalletModel.update(updates, { where: { id } });
    return updated > 0;
};

// Delete a wallet
export const deleteWallet = async (id: number): Promise<boolean> => {
    const deleted = await WalletModel.destroy({ where: { id } });
    return deleted > 0;
};
