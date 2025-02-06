import { IncomeInterface } from "./ui/interfaces/income";
import { WalletInterface } from "./ui/interfaces/wallet";
import { IncomeCategoryInterface } from "./ui/interfaces/income_category";
import { ExpenseCategoryInterface } from "./ui/interfaces/expense_category";
import { IPCResponse } from "./ui/interfaces/ipc_response";

declare global {
    interface Window {
        db_expense_categories: {
            getExpenseCategories: () => Promise<IPCResponse<ExpenseCategoryInterface[]>>;
        };
        db_income_categories: {
            getIncomeCategories: () => Promise<IPCResponse<IncomeCategoryInterface[]>>;
        };
        db_wallets: {
            addWallet: (title: string) => Promise<IPCResponse<WalletInterface>>;
            getWallets: () => Promise<IPCResponse<WalletInterface[]>>;
        };
        app_sys: {
            quitApp: () => Promise<void>;
        };
    }
}

export {}; // Penting agar ini dianggap sebagai modul dan tidak menimpa deklarasi global