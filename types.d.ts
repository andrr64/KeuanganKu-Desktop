import { IncomeInterface } from "./src/ui/interfaces/income";
import { IncomeCategoryInterface } from "./src/ui/interfaces/income_category";

declare global {
    interface Window {
        db_income_categories: {
            getIncomeCategories: () => Promise<IncomeCategoryInterface[]>;
        };
        db_incomes: {
            getIncomes: (callbackWhenError: (err: any) => void) => Promise<IncomeInterface[]>;
        };
        app_sys: {
            quitApp: () => Promise<void>;
        };
    }
}

export {}; // Penting agar ini dianggap sebagai modul dan tidak menimpa deklarasi global