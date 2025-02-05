import { IncomeInterface } from "./src/ui/interfaces/income";
import { WalletInterface } from "./src/ui/interfaces/wallet";
import { IncomeCategoryInterface } from "./src/ui/interfaces/income_category";

declare global {
    interface Window {
        db_income_categories: {
            getIncomeCategories: () => Promise<IncomeCategoryInterface[]>;
        };
        db_incomes: {
            getIncomes: (callbackWhenError: (err: any) => void) => Promise<IncomeInterface[]>;
        };
        db_wallets: {
            getWallets: () => Promise<any>;
            addWallet: (wallet: any) => Promise<WalletInterface>;
            deleteWallet: (walletId: string) => Promise<WalletInterface>;
            updateWallet: (wallet: any) => Promise<WalletInterface>;
        };
        app_sys: {
            quitApp: () => Promise<void>;
            newWindow: (url: string) => Promise<void>;
        };
    }
}

export {}; // Penting agar ini dianggap sebagai modul dan tidak menimpa deklarasi global