import { ipcMain } from "electron";
import Expense from '../db/entities/expense.js';
import Wallet from '../db/entities/wallet.js';
import { ExpenseFormInterface } from "./interfaces/expense_form.js";
import { ipcResponseError, ipcResponseSuccess } from "../db/interfaces/ipc_response.js";
import AppDataSource from "../db/config/ormconfig.js";
import { GetExpensesProp } from "./interfaces/get_expense.js";
import { ExpenseInterface } from "../db/interfaces/expense.js";
import { ExpenseCategory } from "../db/entities/expense_category.js";

export function registerDBExpenseIPCHandler() {
    ipcMain.handle('add-expense', async (_, data: ExpenseFormInterface) => {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const wallet = await queryRunner.manager.findOneBy(Wallet, { id: data.wallet_id });
            if (!wallet) {
                throw new Error('Wallet not found');
            }

            if (wallet.balance < data.amount) {
                throw new Error('Insufficient balance');
            }
            wallet.balance -= data.amount;

            const expense_category = await queryRunner.manager.findOneBy(ExpenseCategory, { id: data.category_id });
            if (!expense_category) {
                throw new Error('Category not found');
            }
            await queryRunner.manager.save(wallet);

            const expense = new Expense();
            expense.amount = data.amount;
            expense.title = data.title;
            expense.description = data.description ?? '';
            expense.wallet = wallet; // Simpan wallet sebagai relasi
            expense.category = expense_category;
            await queryRunner.manager.save(expense);
            await queryRunner.commitTransaction();
            return ipcResponseSuccess(expense.toInterface());
        } catch (error: any) {
            await queryRunner.rollbackTransaction();
            return ipcResponseError(error.message);
        } finally {
            await queryRunner.release();
        }
    });


    ipcMain.handle('get-expenses', async (_, data: GetExpensesProp) => {
        try {
            // Check if the wallet exists
            const wallet = await Wallet.findOne({ where: { id: data.walletId } });
            if (!wallet) {
                return ipcResponseError('Wallet not found');
            }
            
            // Fetch expenses with the where condition
            const expenses = await Expense.find({ where: {
                wallet: {
                    id: data.walletId
                }
            }});

            // Format the data to the interface
            const formattedData = expenses.map(expense => expense.toInterface());

            // Return the success response with the formatted data
            return ipcResponseSuccess<ExpenseInterface[]>(formattedData);
        } catch (error: any) {
            // Return the error response if something goes wrong
            return ipcResponseError(error.message);
        }
    });
}