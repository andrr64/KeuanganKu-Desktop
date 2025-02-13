import { ipcMain } from 'electron';
import { Wallet } from '../db/entities/wallet.js';
import { ipcResponseSuccess, ipcResponseError, IPCResponse } from '../db/interfaces/ipc_response.js';
import { WalletInterface } from '../db/interfaces/wallet.js';
import Expense from '../db/entities/expense.js';
import Income from '../db/entities/income.js';
import { ExpenseInterface } from '../db/interfaces/expense.js';
import AppDataSource from '../db/config/ormconfig.js';
import IncomeCategory from '../db/entities/income_category.js';

export function registerDbWalletsIPCHandler() {
    ipcMain.handle('add-wallet', async (_, title, balance): Promise<IPCResponse<WalletInterface | null>> => {
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
    });

    ipcMain.handle('get-wallets', async (_): Promise<IPCResponse<WalletInterface[] | null>> => {
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

    ipcMain.handle('update-wallet', async (_, id, title, balance): Promise<IPCResponse<WalletInterface | any>> => {
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

    ipcMain.handle('delete-wallet', async (_, id: number): Promise<IPCResponse<any>> => {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.startTransaction();

        try {
            const wallet = await Wallet.findOne({where: {id}});
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

    ipcMain.handle('get-transactions', async (_, walletId: number) => {
        try {
            // Check if the wallet exists
            const wallet = await Wallet.findOne({ where: { id: walletId } });
            if (!wallet) {
                return ipcResponseError('Wallet not found');
            }

            // Define the where condition to filter transactions by walletId
            const whereCondition: any = { wallet: { id: walletId } };

            // Fetch expenses and incomes with the where condition
            const expenses = await Expense.find({
                where: whereCondition,
                relations: ['category', 'wallet'],
            });

            const incomes = await Income.find({
                where: whereCondition,
                relations: ['category', 'wallet'],
            });

            // Combine and sort transactions by time (newer to older)
            const transactions = [...expenses, ...incomes].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

            // Format the data to the interface
            const formattedData = transactions.map(transaction => transaction.toInterface());

            // Return the success response with the formatted data
            return ipcResponseSuccess<ExpenseInterface[]>(formattedData);
        } catch (error: any) {
            // Return the error response if something goes wrong
            return ipcResponseError(error.message);
        }
    });
}