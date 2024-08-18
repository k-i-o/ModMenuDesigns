const {app, BrowserWindow, ipcMain, dialog} = require('electron')
const path = require('path')
const url = require('url')

let mainWindow = null;
let tray = null;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        autoHideMenuBar: true,
        width: 800,
        height: 500,
        transparent: true,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'src/preload.js'),
        },
        frame: false,
        titleBarStyle: 'hidden',
    });

    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, 'src/index.html'),
            protocol: 'file:',
            slashes: true
        })
    );

    mainWindow.on('closed', () => {
        mainWindow = null
    });

    mainWindow.on("ready-to-show", () => {
        // mainWindow.webContents.openDevTools();
    });

}

app.whenReady().then(async ()=>{

    ipcMain.on('close', () => {
        BrowserWindow.getFocusedWindow().close();
    });

    ipcMain.on('minimize', () => {
        BrowserWindow.getFocusedWindow().minimize();
    });

    ipcMain.on('maximize', () => {
        if (BrowserWindow.getFocusedWindow().isMaximized()) {
            BrowserWindow.getFocusedWindow().unmaximize();
        } else {
            BrowserWindow.getFocusedWindow().maximize();
        }
    });

    
    if (mainWindow === null){
        createWindow();
        mainWindow.webContents.send('version', app.getVersion());
    }
});