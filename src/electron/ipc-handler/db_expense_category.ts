import { ipcMain } from "electron";
import { IPCResponse, ipcResponseError, ipcResponseSuccess } from "../db/interfaces/ipc_response.js";
import { ExpenseCategory } from "../db/entities/expense_category.js";
import { IExpenseCategory } from "../db/interfaces/ExpenseCategory.js";

export function registerDbExpenseCategoriesIPCHandler(){
    ipcMain.handle('get-expense-categories', async (): Promise<IPCResponse<IExpenseCategory[] | null>> => {
        try {
            const categories = await ExpenseCategory.find();
            return ipcResponseSuccess(categories.map((category: ExpenseCategory) => category.toInterface()));
        } catch (error: any) {
            return ipcResponseError(error.message);
        }
    });
}
