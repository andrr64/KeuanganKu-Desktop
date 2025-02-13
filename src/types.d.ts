import { ExpenseInterface } from "./ui/interfaces/entities/expense";
import { ExpenseCategoryInterface } from "./ui/interfaces/entities/expense_category";
import { IncomeInterface } from "./ui/interfaces/entities/income";
import { IncomeCategoryInterface } from "./ui/interfaces/entities/income_category"; // Import IncomeCategoryInterface
import { WalletInterface } from "./ui/interfaces/entities/wallet"; // Import WalletInterface
import { IPCResponse } from "./ui/interfaces/ipc_response";
import { ExpenseFormInterface } from "./ui/interfaces/request/expense_form";
import { GetExpenseProp } from "./ui/interfaces/request/get_expense";
import { GetIncomesProp } from "./ui/interfaces/request/get_income";
import { IncomeFormInterface } from "./ui/interfaces/request/income_form";

declare global {
    interface Window {
        db_expense_categories: {
            getExpenseCategories: () => Promise<IPCResponse<ExpenseCategoryInterface[]>>;
        };
        db_expenses: {
            addExpense: (expenseData: ExpenseFormInterface) => Promise<IPCResponse<ExpenseInterface | null>>;
            getExpenses: (request: GetExpenseProp) => Promise<IPCResponse<ExpenseInterface[]>>;
        };
        db_income_categories: {
            getIncomeCategories: () => Promise<IPCResponse<IncomeCategoryInterface[]>>;
        };
        db_incomes: {
            getIncomes: (request: GetIncomesProp) => Promise<IPCResponse<IncomeInterface[]>>;
            addIncome: (incomeData: IncomeFormInterface) => Promise<IPCResponse<IncomeInterface | null>>;
        };
        db_wallets: {
            addWallet: (title: string, balance?: number) => Promise<IPCResponse<WalletInterface | null>>;
            getWallets: () => Promise<IPCResponse<WalletInterface[]>>;
            getTotalBalances: () => Promise<IPCResponse<number | null>>;
            getTransactions: (walletId: number) => Promise<IPCResponse<(ExpenseInterface | IncomeInterface)[]>>; // Fix the type here
            deleteWallet: (id: number) => Promise<IPCResponse<boolean>>;
        };
        app_sys: {
            quitApp: () => Promise<void>;
        };
    }
}

export { }; // Ensure this is treated as a module and does not overwrite global declarations