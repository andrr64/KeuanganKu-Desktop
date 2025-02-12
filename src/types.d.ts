import { IncomeInterface } from "./ui/interfaces/income";
import { WalletInterface } from "./ui/interfaces/wallet";
import { IncomeCategoryInterface } from "./ui/interfaces/income_category";
import { ExpenseCategoryInterface } from "./ui/interfaces/expense_category";
import { IPCResponse } from "./ui/interfaces/ipc_response";
import { IncomeFormInterface } from "./ui/interfaces/income_form";
import { ExpenseFormInterface } from "./ui/interfaces/expense_form";
import { GetExpenseProp } from "./ui/interfaces/get_expense";

declare global {
    interface Window {
        db_expense_categories: {
            getExpenseCategories: () => Promise<IPCResponse<ExpenseCategoryInterface[]>>,
        };
        db_expenses: {
            addExpense: (expenseData: ExpenseFormInterface) => Promise<IPCResponse<ExpenseInterface | null>>,
            getExpenses: (request: GetExpenseProp) => Promise<IPCResponse<ExpenseInterface[]>>
        },
        db_income_categories: {
            getIncomeCategories: () => Promise<IPCResponse<IncomeCategoryInterface[]>>,
        };
        db_incomes: {
            addIncome: (incomeData: IncomeFormInterface) => Promise<IPCResponse<IncomeInterface | null>>
        };
        db_wallets: {
            addWallet: (title: string, balance?: number) => Promise<IPCResponse<WalletInterface | null>>;
            getWallets: () => Promise<IPCResponse<WalletInterface[]>>;
            getTotalBalances: () => Promise<IPCResponse<number | null>>;
            deleteWallet: (id: number) => Promise<IPCResponse<boolean>>;
        };
        app_sys: {
            quitApp: () => Promise<void>;
        };
    }
}

export { }; // Penting agar ini dianggap sebagai modul dan tidak menimpa deklarasi global