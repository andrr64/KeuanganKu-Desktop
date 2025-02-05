import { ipcMain } from "electron";
import { getIncomeCategories } from "./helpers/income_category.js";
import { getExpenseCategoriesJSON } from "./helpers/expense_category.js";
import { addWallet} from "./helpers/wallet.js";
import { WalletInterface } from "./interfaces/wallet.js";
import { IPCResponse, ipcResponseFailed, ipcResponseSuccess } from "../interfaces/ipc_response.js";

export function registerDbIncomeIPChandlers() {
    ipcMain.handle("get-income-categories", async (_)
    : Promise<IPCResponse<{}[] | null>> => {
        try {
            const data = await getIncomeCategories();
            return ipcResponseSuccess<{}[]>(data);
        } catch (error: any) {
            return ipcResponseFailed(error);
        }
    });
}

export function registerDbExpenseIPCHandlers() {
    ipcMain.handle("get-expense-categories", async (_)
    : Promise<IPCResponse<{}[] | null>> => {
        try {
            const data = await getExpenseCategoriesJSON();
            return ipcResponseSuccess<{}[]>(data);
        } catch (error: any) {
            return ipcResponseFailed(error);
        }
    });
}

export function registerDbWalletIPCHandlers() {
    ipcMain.handle("add-wallet", async (_, walletName: string)
    : Promise<IPCResponse<WalletInterface | null>> => {
        try {
            return ipcResponseSuccess<WalletInterface>(await addWallet({title: walletName}));
        } catch (error: any) {
            return ipcResponseFailed(error);
        }
    });
}