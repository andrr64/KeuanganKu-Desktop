import electron from 'electron';

const ipcIncomeDBEventsKeys = {
    "getIncomeCategories": "get-income-categories",
    "getIncomes": "get-incomes",
    "addIncome": "add-income"
}

const ipcExpenseDBEventKeys = {
    "getExpenseCategories": "get-expense-categories",
}

electron.contextBridge.exposeInMainWorld('db_wallets', {
    addWallet: (wallet: any) => {
        return electron.ipcRenderer.invoke("add-wallet", wallet);
    },
});

electron.contextBridge.exposeInMainWorld('db_income_categories', {
    getIncomeCategories: () => {
        return electron.ipcRenderer.invoke(ipcIncomeDBEventsKeys.getIncomeCategories);
    },
});

electron.contextBridge.exposeInMainWorld('db_expense_categories', {
    getExpenseCategories: () => {
        return electron.ipcRenderer.invoke(ipcExpenseDBEventKeys.getExpenseCategories);
    },
});

electron.contextBridge.exposeInMainWorld('db_incomes', {
    getIncomes: (callbackWhenError: (err: any) => void) => {
        return electron.ipcRenderer.invoke(ipcIncomeDBEventsKeys.getIncomes, callbackWhenError);
    }
});

electron.contextBridge.exposeInMainWorld('app_sys', {
    quitApp: () => {
        electron.ipcRenderer.invoke('quit-app');
    },
    newWindow: (url: string) => {
        electron.ipcRenderer.invoke('new-window', url);
    }
}
)