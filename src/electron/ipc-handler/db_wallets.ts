import { ipcMain } from 'electron';
import { Wallet } from '../db/entities/wallet.js';
import { ipcResponseSuccess, ipcResponseError, IPCResponse } from '../db/interfaces/ipc_response.js';
import { WalletInterface } from '../db/interfaces/wallet.js';
import Expense from '../db/entities/expense.js';
import Income from '../db/entities/income.js';
import AppDataSource from '../db/config/ormconfig.js';
import IncomeCategory from '../db/entities/income_category.js';
import { SortWalletsBy } from '../enums/sort_wallets.js';


/* CREATE  */
const handleAddWallet = async (_: Electron.IpcMainInvokeEvent, title: string, balance: number): Promise<IPCResponse<WalletInterface | null>> => {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
        const wallet = new Wallet();
        const category = await IncomeCategory.find();
        wallet.name = title;
        wallet.balance = balance;
        await queryRunner.manager.save(wallet);

        const income = new Income();
        income.title = 'Wallet Init';
        income.amount = balance;
        income.wallet = wallet;
        income.description = 'Initial balance for wallet';
        income.category = category[0]!;
        await queryRunner.manager.save(income);

        await queryRunner.commitTransaction();
        return ipcResponseSuccess(wallet.toInterface());
    } catch (error: any) {
        await queryRunner.rollbackTransaction();
        return ipcResponseError(error.message);
    } finally {
        await queryRunner.release();
    }
};

/* READ */
const handleGetWallets = async (): Promise<IPCResponse<WalletInterface[] | null>> => {
    try {
        const wallets = await Wallet.find();
        if (wallets.length === 0) {
            throw new Error('No wallets found');
        }
        return ipcResponseSuccess(wallets.map((wallet) => wallet.toInterface()));
    } catch (error: any) {
        return ipcResponseError(error.message);
    }
};
const handleGetWalletsSort = async (_: Electron.IpcMainInvokeEvent, sortWalletsBy: SortWalletsBy): Promise<IPCResponse<WalletInterface[] | null>> => {
    try {
        let wallets = await Wallet.find();
        if (wallets.length === 0) {
            throw new Error('No wallets found');
        }

        switch (sortWalletsBy) {
            case SortWalletsBy.DATE_ASC:
                wallets = wallets.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
                break;
            case SortWalletsBy.Date_DESC:
                wallets = wallets.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
                break;
            case SortWalletsBy.Balance_ASC:
                wallets = wallets.sort((a, b) => a.balance - b.balance);
                break;
            case SortWalletsBy.Balance_DESC:
                wallets = wallets.sort((a, b) => b.balance - a.balance);
                break;
            case SortWalletsBy.Alphabetic_ASC:
                wallets = wallets.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case SortWalletsBy.Alphabetic_DESC:
                wallets = wallets.sort((a, b) => b.name.localeCompare(a.name));
                break;
        }

        return ipcResponseSuccess(wallets.map((wallet) => wallet.toInterface()));
    } catch (error: any) {
        return ipcResponseError(error.message);
    }
};
const handleGetTotalBalance = async (): Promise<IPCResponse<number | null>> => {
    try {
        const wallets = await Wallet.find();
        const totalBalance = wallets.reduce((acc, wallet) => acc + wallet.balance, 0);
        return ipcResponseSuccess(totalBalance);
    } catch (error: any) {
        return ipcResponseError(error.message);
    }
};
const handleGetTransactions = async (_: Electron.IpcMainInvokeEvent, walletId: number): Promise<IPCResponse<any[] | null>> => {
    try {
        const wallet = await Wallet.findOne({ where: { id: walletId } });
        if (!wallet) {
            return ipcResponseError('Wallet not found');
        }

        const whereCondition: any = { wallet: { id: walletId } };

        const expenses = await Expense.find({
            where: whereCondition,
            relations: ['category', 'wallet'],
        });

        const incomes = await Income.find({
            where: whereCondition,
            relations: ['category', 'wallet'],
        });

        const transactions = [...expenses, ...incomes].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        const formattedData = transactions.map(transaction => transaction.toInterface());

        return ipcResponseSuccess<any[]>(formattedData);
    } catch (error: any) {
        return ipcResponseError(error.message);
    }
};

/* UPDATE */
const handleUpdateWallet = async (_: Electron.IpcMainInvokeEvent, id: number, title: string, balance: number): Promise<IPCResponse<WalletInterface | any>> => {
    try {
        const wallet = await Wallet.findOne({ where: { id } });
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
};

/* DELETE */
const handleDeleteWallet = async (_: Electron.IpcMainInvokeEvent, id: number): Promise<IPCResponse<any>> => {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
        const wallet = await Wallet.findOne({ where: { id } });
        if (!wallet) {
            throw new Error('Wallet not found');
        }

        await queryRunner.manager.delete(Income, { wallet: { id } });
        await queryRunner.manager.delete(Expense, { wallet: { id } });
        await queryRunner.manager.remove(wallet);

        await queryRunner.commitTransaction();
        return ipcResponseSuccess(null);
    } catch (error: any) {
        await queryRunner.rollbackTransaction();
        return ipcResponseError(error.message);
    } finally {
        await queryRunner.release();
    }
};

export function registerDbWalletsIPCHandler() {
    ipcMain.handle('add-wallet', handleAddWallet);
    ipcMain.handle('get-wallets', handleGetWallets);
    ipcMain.handle('get-wallets-sort', handleGetWalletsSort);
    ipcMain.handle('update-wallet', handleUpdateWallet);
    ipcMain.handle('delete-wallet', handleDeleteWallet);
    ipcMain.handle('get-total-balance', handleGetTotalBalance);
    ipcMain.handle('get-transactions', handleGetTransactions);
}