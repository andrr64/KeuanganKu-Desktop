import electron from 'electron';

const database = {
    wallet: 'db_wallets',
    incomes: 'db_incomes',
    expenses: 'db_expenses',
    income_categories: 'db_income_categories',
    expense_categories: 'db_expense_categories'
}

electron.contextBridge.exposeInMainWorld(database.wallet, {
    addWallet: (title: string, balance: number= 0) => {
        return electron.ipcRenderer.invoke("add-wallet", title, balance);
    },
    getWallets: () => {
        return electron.ipcRenderer.invoke("get-wallets");
    },
    updateWallet: (id: number, title: string, balance: number) => {
        return electron.ipcRenderer.invoke("update-wallet", id, title, balance);
    },
    deleteWallet: (id: number) => {
        return electron.ipcRenderer.invoke("delete-wallet", id);
    },
    getTotalBalance: () => {
        return electron.ipcRenderer.invoke("get-total-balance");
    }
});

electron.contextBridge.exposeInMainWorld(database.incomes, {
    addIncome: (data: {title: string, description?: string, amount: number, category_id: number, wallet_id: number}) => {
        return electron.ipcRenderer.invoke("add-income", data);
    }
});

electron.contextBridge.exposeInMainWorld(database.expenses, {
    addExpense: (data: {title: string, description?: string, amount: number, category_id: number, wallet_id: number}) => {
        return electron.ipcRenderer.invoke("add-expense", data);
    },
    getExpenses: (data: {wallet_id: number, rangeType: string, startDate?: Date, endDate?: Date}) => {
        return electron.ipcRenderer.invoke("get-expenses", data);
    }
});

electron.contextBridge.exposeInMainWorld(database.income_categories, {
    getIncomeCategories: () => {
        return electron.ipcRenderer.invoke("get-income-categories");
    },
});

electron.contextBridge.exposeInMainWorld(database.expense_categories, {
    getExpenseCategories: () => {
        return electron.ipcRenderer.invoke("get-expense-categories");
    },
});

electron.contextBridge.exposeInMainWorld('app_sys', {
    quitApp: () => {
        electron.ipcRenderer.invoke('quit-app');
    },
    newWindow: (url: string) => {
        electron.ipcRenderer.invoke('new-window', url);
    }
});