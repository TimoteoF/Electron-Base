import { app, BrowserWindow, Menu } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { registerTrpcHandler } from '@app/backend/ipcTrpc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;

// Create the main window (Will be called by the app.whenReady() event)
function createMainWindow(): void {
    const devServerUrl = process.env.VITE_DEV_SERVER_URL;

    mainWindow = new BrowserWindow({
        title: 'Main Window',
        width: 1280,
        height: 720,
        minWidth: 800,
        minHeight: 600,
        show: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.mjs'),
            contextIsolation: true,
            nodeIntegration: false,
            devTools: Boolean(devServerUrl),
        },
        autoHideMenuBar: true,
    });

    // Ensure tRPC IPC handler is registered before the renderer loads
    registerTrpcHandler(mainWindow);

    if (devServerUrl) {
        void mainWindow.loadURL(devServerUrl);
        mainWindow.webContents.openDevTools({ mode: 'detach' });
    } else {
        void mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }

    mainWindow.on('ready-to-show', () => {
        mainWindow?.show();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// This is the entry point for the main process
app.whenReady().then(() => {
    // Remove default application menu (File/Edit/View...)
    Menu.setApplicationMenu(null);

    createMainWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
