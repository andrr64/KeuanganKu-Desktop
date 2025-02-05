import electron from 'electron';

const ipcIncomeDBEventsKeys = {
    "getIncomeCategories": "get-income-categories",
    "getIncomes": "get-incomes",
    "addIncome": "add-income"
}

const ipcExpenseDBEventKeys = {
    "getExpenseCategories": "get-expense-categories",
}

const ipcWalletEventKeys = {
    "getWallets": "get-wallets",
    "addWallet": "add-wallet",
    "deleteWallet": "delete-wallet",
    "updateWallet": "update-wallet"
}

electron.contextBridge.exposeInMainWorld('db_wallets', {
    getWallets: () => {
        return electron.ipcRenderer.invoke(ipcWalletEventKeys.getWallets);
    },
    addWallet: (wallet: any) => {
        return electron.ipcRenderer.invoke(ipcWalletEventKeys.addWallet, wallet);
    },
    deleteWallet: (walletId: string) => {
        return electron.ipcRenderer.invoke(ipcWalletEventKeys.deleteWallet, walletId);
    },
    updateWallet: (wallet: any) => {
        return electron.ipcRenderer.invoke(ipcWalletEventKeys.updateWallet, wallet);
    }
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