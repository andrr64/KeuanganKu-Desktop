import { IncomeInterface } from "./ui/interfaces/income";
import { WalletInterface } from "./ui/interfaces/wallet";
import { IncomeCategoryInterface } from "./ui/interfaces/income_category";
import { IPCResponse } from "./ui/interfaces/ipc_response";

declare global {
    interface Window {
        db_income_categories: {
            getIncomeCategories: () => Promise<IncomeCategoryInterface[]>;
        };
        db_incomes: {
            getIncomes: (callbackWhenError: (err: any) => void) => Promise<IncomeInterface[]>;
        };
        db_wallets: {
            addWallet: (title: string) => Promise<IPCResponse>;
        };
        app_sys: {
            quitApp: () => Promise<void>;
        };
    }
}

export {}; // Penting agar ini dianggap sebagai modul dan tidak menimpa deklarasi global