import WalletModel from '../models/wallet.js';
import { WalletInterface } from '../interfaces/wallet.js';

/**
 * Add a new wallet
 * @param {WalletInterface} wallet - The wallet data to add
 * @returns {Promise<WalletInterface>} - The newly created wallet
 */
export const addWallet = async (wallet: WalletInterface): Promise<WalletInterface> => {
    const newWallet = await WalletModel.create({
        title: wallet.title
    });
    return newWallet.toJSON();
};

/**
 * Read all wallets
 * @returns {Promise<WalletInterface[]>} - A list of all wallets
 */
export const getWallets = async (): Promise<WalletInterface[]> => {
    const wallets = await WalletModel.findAll();
    return wallets.map(wallet => wallet.toJSON());
};

/**
 * Read wallet by ID
 * @param {number} id - The ID of the wallet to read
 * @returns {Promise<WalletInterface | null>} - The wallet with the given ID, or null if not found
 */
export const getWalletsById = async (id: number): Promise<WalletInterface | null> => {
    const wallet = await WalletModel.findByPk(id);
    return wallet ? wallet.toJSON() : null;
};

/**
 * Update a wallet
 * @param {number} id - The ID of the wallet to update
 * @param {Partial<WalletInterface>} updates - The updates to apply to the wallet
 * @returns {Promise<boolean>} - True if the wallet was updated, false otherwise
 */
export const updateWallet = async (id: number, updates: Partial<WalletInterface>): Promise<boolean> => {
    const [updated] = await WalletModel.update(updates, { where: { id } });
    return updated > 0;
};

/**
 * Delete a wallet
 * @param {number} id - The ID of the wallet to delete
 * @returns {Promise<boolean>} - True if the wallet was deleted, false otherwise
 */
export const deleteWallet = async (id: number): Promise<boolean> => {
    const deleted = await WalletModel.destroy({ where: { id } });
    return deleted > 0;
};
