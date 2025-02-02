import {app, BrowserWindow} from 'electron';
import * as path from 'path';

type test = string;

console.log(path.join(app.getAppPath(), "dist-react/index.html"));



app.on("ready", () => {
    const mainWindow = new BrowserWindow()
    mainWindow.loadFile(path.join(app.getAppPath(), "dist-react/index.html"));
});