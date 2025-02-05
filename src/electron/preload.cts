import electron from 'electron';

const database = {
    wallet: 'db_wallets',
    income_categories: 'db_income_categories',
    expense_categories: 'db_expense_categories'
}

electron.contextBridge.exposeInMainWorld(database.wallet, {
    addWallet: (title: string) => {
        return electron.ipcRenderer.invoke("add-wallet", title);
    },
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
}
)