import { ipcMain } from "electron";
import { getIncomeCategories } from "./helpers/income_category.js";
import { addIncome, getAllIncomes } from "./helpers/income.js";

const ipcIncomeDBEventsKeys = {
    "getIncomeCategories": "get-income-categories",
    "getIncomes": "get-incomes",
    "addIncome": "add-income"
} 

export function registerDbIncomeIPChandlers() {
    ipcMain.handle(ipcIncomeDBEventsKeys.getIncomeCategories, async (_, errorCallback: (err: any) => void) => {
        try {
            return await getIncomeCategories();
        } catch (error) {
            errorCallback(error);
        }
    });

    ipcMain.handle(ipcIncomeDBEventsKeys.getIncomes, async (_, errorCallback: (err: any) => void) => {
        try {
            const data = await getAllIncomes();
            const finalData = data.map((val) => val.toJSON());
            return finalData;
        } catch (error) {
            errorCallback(error);
        }
    })

    ipcMain.handle(ipcIncomeDBEventsKeys.addIncome, async (_, data) => {
        try {
            await addIncome(data);
            return true;
        } catch (error) {
            return false;
        }
    });
}