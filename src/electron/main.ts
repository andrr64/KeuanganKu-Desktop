import { app, BrowserWindow, ipcMain } from 'electron';
import { isDev } from './util.js';
import * as path from 'path';
import { getPreloadPath } from './getPath.js';
import AppDataSource from './db/config/ormconfig.js';
import { ExpenseCategory } from './db/entities/expense_category.js';
import IncomeCategory from './db/entities/income_category.js';
import { registerDbWalletsIPCHandler } from './ipc-handler/db_wallets.js';
import { registerDbIncomeCategoriesIPCHandler } from './ipc-handler/db_income_categories.js';
import { registerDbExpenseCategoriesIPCHandler } from './ipc-handler/db_expense_category.js';
import { registerDBExpenseIPCHandler } from './ipc-handler/db_expense.js';
import { registerDBIncomeIPCHandler } from './ipc-handler/db_income.js';

const createWindow = (): void => {
    const mainWindow = new BrowserWindow({
        minWidth: 1000,
        minHeight: 680,
        webPreferences: {
            preload: getPreloadPath()
        }
    });
    mainWindow.maximize(); // Add this line to maximize the window
    if (isDev()) {
        mainWindow.loadURL('http://localhost:8000');
    } else {
        mainWindow.loadFile(path.join(app.getAppPath(), 'dist-react/index.html'));
    }
}

app.whenReady().then(async () => {
    try {
        await AppDataSource.initialize(); 
        await ExpenseCategory.initData();
        await IncomeCategory.initData();

        registerDbWalletsIPCHandler();
        registerDbIncomeCategoriesIPCHandler();
        registerDbExpenseCategoriesIPCHandler();
        registerDBExpenseIPCHandler();
        registerDBIncomeIPCHandler();
        
        ipcMain.handle('quit-app', () => {
            app.quit();
        });

        createWindow();
    } catch (err: any) {
        console.error('Gagal membuka database:', err.message);
        app.quit();
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

