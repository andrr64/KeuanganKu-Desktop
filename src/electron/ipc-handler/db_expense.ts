import { ipcMain } from "electron";
import Expense from '../db/entities/expense.js';
import Wallet from '../db/entities/wallet.js';
import { ExpenseFormInterface } from "./interfaces/expense_form.js";
import { ipcResponseError } from "../db/interfaces/ipc_response.js";
import AppDataSource from "../db/config/ormconfig.js";

export function registerDBExpenseIPCHandler(){
    ipcMain.handle('add-expense', async (_, data: ExpenseFormInterface) => {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.startTransaction();

        try {
            const wallet = await queryRunner.manager.findOneBy(Wallet, {id: data.wallet_id});
            if (!wallet) {
                throw new Error('Wallet not found');
            }

            if (wallet.balance < data.amount) {
                throw new Error('Insufficient balance');
            }
            wallet.balance -= data.amount;
            await queryRunner.manager.save(wallet);

            const expense = new Expense();
            expense.amount = data.amount;
            expense.categoryId = data.category_id;
            expense.walletId = data.wallet_id;
            expense.title = data.title;
            expense.description = data.description?? '';
            await queryRunner.manager.save(expense);

            await queryRunner.commitTransaction();
            return expense.toInterface();
        } catch (error: any) {
            await queryRunner.rollbackTransaction();
            return ipcResponseError(error.message);
        } finally {
            await queryRunner.release();
        }
    });
}