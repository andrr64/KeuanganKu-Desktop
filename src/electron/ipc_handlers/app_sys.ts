import { app, BrowserWindow, ipcMain } from "electron";
import { getPreloadPath } from "../getPath.js";

export const registerAppSystemIPCHandlers = () => {
    ipcMain.handle('quit-app', () => {
        app.quit();
    });
    ipcMain.handle('new-window', (event, url) => {
        const win = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                preload: getPreloadPath(), // Add this line
            },
        });
        win.loadURL(url);
    });
}