import { ipcMain } from "electron";
import { getIncomeCategories } from "./helpers/income_category.js";
import { getExpenseCategories } from "./helpers/expense_category.js";
import { addWallet, getWallets } from "./helpers/wallet.js";
import { WalletInterface } from "../interfaces/wallet.js";
import { IPCResponse, ipcResponseFailed, ipcResponseSuccess } from "../interfaces/ipc_response.js";
import { addIncome } from "./helpers/income.js";
import { IncomeInterface } from "../interfaces/income.js";
import { ExpenseCategoryInterface } from "../interfaces/expense_category.js";
import { IncomeCategoryInterface } from "../interfaces/income_category.js";
import { createExpense } from "./helpers/expense.js";
import { ExpenseInterface } from "../interfaces/expense.js";

export function registerDbIncomeIPChandlers() {
    ipcMain.handle("get-income-categories", async (_)
    : Promise<IPCResponse<IncomeCategoryInterface[] | null>> => {
        try {
            const data = await getIncomeCategories();
            return ipcResponseSuccess<IncomeCategoryInterface[]>(data);
        } catch (error: any) {
            return ipcResponseFailed(error);
        }
    });

    ipcMain.handle('add-income', async (_, incomeData: IncomeInterface)
    : Promise<IPCResponse<IncomeInterface | null>> => {
        try {
            const data = await addIncome(incomeData);
            return ipcResponseSuccess<IncomeInterface>(data);
        } catch (error: any) {
            return ipcResponseFailed(error);
        }
    });
}

export function registerDbExpenseIPCHandlers() {
    ipcMain.handle("get-expense-categories", async (_)
    : Promise<IPCResponse<ExpenseCategoryInterface[] | null>> => {
        try {
            const data = await getExpenseCategories();
            return ipcResponseSuccess<ExpenseCategoryInterface[]>(data);
        } catch (error: any) {
            return ipcResponseFailed(error);
        }
    });

    ipcMain.handle('add-expense', async (_, expenseData: { title: string, amount: number, category_id: number, wallet_id: number, description?: string })
    : Promise<IPCResponse<ExpenseInterface | null>> => {
        try {
            const data = await createExpense(
                expenseData.title,
                expenseData.amount,
                expenseData.category_id,
                expenseData.wallet_id,
                expenseData.description
            );
            return ipcResponseSuccess<ExpenseInterface>(data);
        } catch (error: any) {
            return ipcResponseFailed(error);
        }
    });
}

export function registerDbWalletIPCHandlers() {
    ipcMain.handle("add-wallet", async (_, walletName: string, balance: number)
    : Promise<IPCResponse<WalletInterface | null>> => {
        try {
            return ipcResponseSuccess<WalletInterface>(await addWallet({ title: walletName, balance}));
        } catch (error: any) {
            return ipcResponseFailed(error);
        }
    });

    ipcMain.handle("get-wallets", async (): Promise<IPCResponse<WalletInterface[] | null>> => {
        try {
            const data = await getWallets();
            return ipcResponseSuccess<WalletInterface[]>(data);
        } catch (error: any) {
            return ipcResponseFailed(error);
        }
    });
}