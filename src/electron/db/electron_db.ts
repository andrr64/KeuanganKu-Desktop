import { ipcMain } from "electron";
import { getIncomeCategories } from "./helpers/income_category.js";
import { addIncome, getAllIncomes } from "./helpers/income.js";

export function registerDbIncomeIPChandlers() {
    ipcMain.handle('get-income-categories', async (_, errorCallback: (err: any) => void) => {
        try {
            return await getIncomeCategories();
        } catch (error) {
            errorCallback(error);
        }
    });

    ipcMain.handle('get-incomes', async (_, errorCallback: (err: any) => void) => {
        try {
            const data = await getAllIncomes();
            const finalData = data.map((val) => val.toJSON());
            return finalData;
        } catch (error) {
            errorCallback(error);
        }
    })

    ipcMain.handle('add-income', async (_, data) => {
        try {
            await addIncome(data);
            return true;
        } catch (error) {
            return false;
        }
    });
}