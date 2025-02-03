import electron from 'electron';

electron.contextBridge.exposeInMainWorld('electron', {
    getStaticData: () => {
        console.log('Getting static data');
        return "Static data";
    },
    subscribeStatistics: (callback: any) => {
        electron.ipcRenderer.on('statistics-data', (_event, data) => {
            callback(data);
        });
    },
});

electron.contextBridge.exposeInMainWorld('database_income_categories', {
    getIncomeCategories: () => {
        return electron.ipcRenderer.invoke('get-income-categories');
    },
});

electron.contextBridge.exposeInMainWorld('database_income', {
    getIncomes: (callbackWhenError: (err: any) => void) => {
        return electron.ipcRenderer.invoke('get-incomes', callbackWhenError);
    }
});