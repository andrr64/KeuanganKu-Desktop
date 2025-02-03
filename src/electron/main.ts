import { initializeDatabase } from './db/sequelize.js';
import { app, BrowserWindow, ipcMain } from 'electron';
import { isDev } from './util.js';
import * as path from 'path';
import { initIncomeCategories } from './db/helpers/income_category.js';
import { getPreloadPath } from './getPath.js';
import { initExpenseCategories } from './db/helpers/expense_category.js';
import { registerDbIncomeIPChandlers } from './db/electron_db.js';


const createWindow = (): void => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: getPreloadPath()
        }
    });
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
        
        // IPC Register
        registerDbIncomeIPChandlers();

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

