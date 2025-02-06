import { app, BrowserWindow } from 'electron';
import { isDev } from './util.js';
import * as path from 'path';
import { getPreloadPath } from './getPath.js';


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

