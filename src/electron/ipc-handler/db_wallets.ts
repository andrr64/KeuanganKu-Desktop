import { ipcMain } from 'electron';
import { Wallet } from '../db/entities/wallet.js';
import { ipcResponseSuccess, ipcResponseError, IPCResponse } from '../db/interfaces/ipc_response.js';
import { IWallet } from '../db/interfaces/Wallet.js';

export function registerDbWalletsIPCHandler() {
    ipcMain.handle('add-wallet', async (_, title, balance): Promise<IPCResponse<IWallet | null>> => {
        try {
            const wallet = new Wallet();
            wallet.name = title;
            wallet.balance = balance;
            await wallet.save();
            return ipcResponseSuccess(wallet.toInterface());
        } catch (error: any) {
            return ipcResponseError(error.message);
        }
    });

    ipcMain.handle('get-wallets', async (_): Promise<IPCResponse<IWallet[] | null>> => {
        try {
            const wallets = await Wallet.find();
            if (wallets.length === 0) {
                throw new Error('No wallets found');
            }
            return ipcResponseSuccess(wallets.map((wallet) => wallet.toInterface()));
        } catch (error: any) {
            return ipcResponseError(error.message);
        }
    });

    ipcMain.handle('update-wallet', async (_, id, title, balance): Promise<IPCResponse<IWallet | any>> => {
        try {
            const wallet = await Wallet.findOne(id);
            if (wallet) {
                wallet.name = title;
                wallet.balance = balance;
                await wallet.save();
                return ipcResponseSuccess(wallet.toInterface());
            } else {
                return ipcResponseError('Wallet not found');
            }
        } catch (error: any) {
            return ipcResponseError(error.message);
        }
    });

    ipcMain.handle('delete-wallet', async (_, id): Promise<IPCResponse<any>> => {
        try {
            const wallet = await Wallet.findOne(id);
            if (wallet) {
                await wallet.remove();
                return ipcResponseSuccess(null);
            } else {
                return ipcResponseError('Wallet not found');
            }
        } catch (error: any) {
            return ipcResponseError(error.message);
        }
    });

    ipcMain.handle('get-total-balance', async (_): Promise<IPCResponse<number | null>> => {
        try {
            const wallets = await Wallet.find();
            const totalBalance = wallets.reduce((acc, wallet) => acc + wallet.balance, 0);
            return ipcResponseSuccess(totalBalance);
        } catch (error: any) {
            return ipcResponseError(error.message);
        }
    });
}