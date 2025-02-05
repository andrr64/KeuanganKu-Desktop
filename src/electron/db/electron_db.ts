import { ipcMain } from "electron";
import { getIncomeCategories } from "./helpers/income_category.js";
import { addIncome, getAllIncomes } from "./helpers/income.js";
import { getExpenseCategoriesJSON } from "./helpers/expense_category.js";
import { readWalletById, readWallets, addWallet, deleteWallet, updateWallet } from "./helpers/wallet.js";

const ipcIncomeDBEventsKeys = {
    "getIncomeCategories": "get-income-categories",
    "getIncomes": "get-incomes",
    "addIncome": "add-income"
}

const ipcExpenseDBEventKeys = {
    "getExpenseCategories": "get-expense-categories",
}

const ipcWalletEventKeys = {
    "getWallets": "get-wallets",
    "addWallet": "add-wallet",
    "deleteWallet": "delete-wallet",
    "updateWallet": "update-wallet"
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

export function registerDbExpenseIPCHandlers() {
    ipcMain.handle(ipcExpenseDBEventKeys.getExpenseCategories, async(_, errorCallBack: (err: any) => void) => {
        try {
            const data = await getExpenseCategoriesJSON();
            return data;
        } catch (error) {
            errorCallBack(error);
        }
    })
}

export function registerDbWalletIPCHandlers() {
    ipcMain.handle(ipcWalletEventKeys.getWallets, async (_, errorCallback: (err: any) => void) => {
        try {
            const wallets = await readWallets();
            return wallets;
        } catch (error) {
            errorCallback(error);
        }
    });

    ipcMain.handle(ipcWalletEventKeys.addWallet, async (_, data) => {
        try {
            await addWallet(data);
            return true;
        } catch (error) {
            return false;
        }
    });

    ipcMain.handle(ipcWalletEventKeys.deleteWallet, async (_, data) => {
        try {
            await deleteWallet(data);
            return true;
        } catch (error) {
            return false;
        }
    });

    ipcMain.handle(ipcWalletEventKeys.updateWallet, async (_, data) => {
        try {
            await updateWallet(data.id, data);
            return true;
        } catch (error) {
            return false;
        }
    });
}
