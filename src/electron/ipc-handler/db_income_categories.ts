import { ipcMain } from "electron";
import IncomeCategory from "../db/entities/income_category.js";
import { IPCResponse, ipcResponseError, ipcResponseSuccess } from "../db/interfaces/ipc_response.js";
import { IIncomeCategory } from "../db/interfaces/IncomeCategory.js";

export function registerDbIncomeCategoriesIPCHandler(){
    ipcMain.handle('get-income-categories', async (): Promise<IPCResponse<IIncomeCategory[] | null>> => {
        try {
            const categories = await IncomeCategory.find();
            if (categories.length === 0) {
                throw new Error("No income categories found");
            }
            return ipcResponseSuccess(categories.map((category: IncomeCategory ) => category.toInterface()));
        } catch (error: any) {
            return ipcResponseError(error.message);
        }
    });
}