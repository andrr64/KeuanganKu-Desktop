import { initializeDatabase } from './db/sequelize.js';
import { app, BrowserWindow, ipcMain } from 'electron';
import { isDev } from './util.js';
import * as path from 'path';
import Income from './db/models/income.js';
import { initIncomeCategories } from './db/helpers/income_category.js';


const createWindow = (): void => {
        const win = new BrowserWindow({
        width: 800,
        height: 600,
    });
    if (isDev()) {
        win.loadURL('http://localhost:8000');
    } else {
        win.loadFile(path.join(app.getAppPath(), 'build/index.html'));
    }
}
app.whenReady().then(async () => {
    try {
        await initializeDatabase();
        const x = {
            id: 1,
            title: 'Gaji',
            description: 'Gaji bulanan',
            amount: 5000000,
            category_id: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        await initIncomeCategories();
        await Income.create(x); 
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