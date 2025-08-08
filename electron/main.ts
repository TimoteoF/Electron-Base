import { app, BrowserWindow, Menu } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;

function createMainWindow(): void {
    const isDev = Boolean(process.env.VITE_DEV_SERVER_URL);
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
            devTools: isDev,
        },
        autoHideMenuBar: true,
    });

    const devServerUrl = process.env.VITE_DEV_SERVER_URL;

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

app.whenReady().then(() => {
    // Remove default application menu (File/Edit/View...)
    Menu.setApplicationMenu(null);
    // Wire tRPC IPC handler lazily after app ready
    import('./backend/ipcTrpc').then(({ registerTrpcHandler }) => registerTrpcHandler());
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
