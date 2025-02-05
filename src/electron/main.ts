import { initializeDatabase } from './db/sequelize.js';
import { app, BrowserWindow } from 'electron';
import { isDev } from './util.js';
import * as path from 'path';
import { initIncomeCategories } from './db/helpers/income_category.js';
import { getPreloadPath } from './getPath.js';
import { initExpenseCategories } from './db/helpers/expense_category.js';
import { registerDbExpenseIPCHandlers, registerDbIncomeIPChandlers } from './db/electron_db.js';
import { registerAppSystemIPCHandlers } from './ipc_handlers/app_sys.js';


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
        await initializeDatabase();
        await initIncomeCategories();
        await initExpenseCategories();

        registerAppSystemIPCHandlers();
        registerDbIncomeIPChandlers();
        registerDbExpenseIPCHandlers();
        
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

