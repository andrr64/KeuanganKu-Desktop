import { ipcMain } from "electron";
import { IPCResponse, ipcResponseError, ipcResponseSuccess } from "../db/interfaces/ipc_response.js";
import { ExpenseCategory } from "../db/entities/expense_category.js";
import { ExpenseCategoryInterface } from "../db/interfaces/expense_category.js";

export function registerDbExpenseCategoriesIPCHandler() {
    ipcMain.handle('get-expense-categories', async (): Promise<IPCResponse<ExpenseCategoryInterface[] | null>> => {
        try {
            const categories = await ExpenseCategory.find();
            if (categories.length === 0) {
                throw new Error("No income categories found");
            }
            return ipcResponseSuccess(categories.map((category: ExpenseCategory) => category.toInterface()));
        } catch (error: any) {
            return ipcResponseError(error.message);
        }
    });
}
