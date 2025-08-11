# Multi‑window with Electron + tRPC IPC

This guide shows a simple, repeatable way to add more than one `BrowserWindow` to your app.

It uses the same preload bridge and tRPC IPC you already have.

If this is your first time doing multi‑window in Electron, follow the steps in order.

Each sentence is on its own line so you can skim quickly.

---

## What stays the same

Your preload file still calls `exposeElectronTRPC()`.

Your renderer still uses the tRPC client with `ipcLink()`.

You do not duplicate routers or clients per window.

Each new window just needs to register the IPC handler and load the UI.

---

## Minimal pattern

1.  Create each window in the main process.

2.  Register tRPC for that window right after you construct it.

3.  Load the dev server URL in development or the built file in production.

That’s it.

```ts
// electron/main.ts
import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { registerTrpcHandler } from '@app/backend/ipcTrpc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;
let toolsWindow: BrowserWindow | null = null;

function createMainWindow(): void {
    const devServerUrl = process.env.VITE_DEV_SERVER_URL;
    mainWindow = new BrowserWindow({
        title: 'Main',
        width: 1280,
        height: 720,
        webPreferences: {
            preload: path.join(__dirname, 'preload.mjs'),
            contextIsolation: true,
            nodeIntegration: false,
            devTools: Boolean(devServerUrl),
        },
        autoHideMenuBar: true,
    });

    registerTrpcHandler(mainWindow);

    if (devServerUrl) {
        void mainWindow.loadURL(devServerUrl);
    } else {
        void mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }

    mainWindow.on('closed', () => (mainWindow = null));
}

function createToolsWindow(): void {
    const devServerUrl = process.env.VITE_DEV_SERVER_URL;
    toolsWindow = new BrowserWindow({
        title: 'Tools',
        width: 900,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.mjs'),
            contextIsolation: true,
            nodeIntegration: false,
            devTools: Boolean(devServerUrl),
        },
        autoHideMenuBar: true,
    });

    // Important: register the IPC handler for this window as well
    registerTrpcHandler(toolsWindow);

    if (devServerUrl) {
        // Optional: deep link to a specific route in the secondary window
        void toolsWindow.loadURL(devServerUrl + '#/tools');
    } else {
        void toolsWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }

    toolsWindow.on('closed', () => (toolsWindow = null));
}

app.whenReady().then(() => {
    createMainWindow();
    createToolsWindow();
});
```

This works because the preload bridge is per window and `createIPCHandler` is registered for each window you pass in.

---

## Optional: attach per‑window context

Sometimes you want your backend procedures to know which window made the call.

You can pass custom context when registering each window.

```ts
// electron/backend/ipcTrpc.ts
import { BrowserWindow } from 'electron';
import { createIPCHandler } from 'electron-trpc-experimental/main';
import { appRouter } from '@app/backend/router';

export function registerTrpcHandler(win: BrowserWindow, windowName = 'main'): void {
    createIPCHandler({
        router: appRouter,
        windows: [win],
        createContext: () => ({ windowName }),
    });
}
```

Now any procedure can read `ctx.windowName` to adjust behavior.

If you need the numeric window id, you can generate it when you create the window and pass it in similarly.

---

## Renderer code is unchanged

Each window runs the same React entry and the same tRPC client setup.

The client automatically talks to the preload bridge that was exposed for that specific window.

```ts
// src/lib/trpcClient.ts
import { createTRPCProxyClient } from '@trpc/client';
import { ipcLink } from 'electron-trpc-experimental/renderer';
import type { AppRouter } from '@app/backend/router';

export const trpc = createTRPCProxyClient<AppRouter>({ links: [ipcLink()] });
```

---

## A small “window manager” (optional)

You can centralize creation and retrieval of windows in a tiny module.

This helps when you have more than two windows or want to avoid global variables.

```ts
// electron/windows.ts
import { BrowserWindow } from 'electron';

const windows = new Map<string, BrowserWindow>();

export function setWindow(name: string, win: BrowserWindow): void {
    windows.set(name, win);
    win.on('closed', () => windows.delete(name));
}

export function getWindow(name: string): BrowserWindow | undefined {
    return windows.get(name);
}

export function getAllWindows(): BrowserWindow[] {
    return Array.from(windows.values());
}
```

Use this in `electron/main.ts` when constructing windows and when you need to broadcast messages.

---

## Broadcasting to all windows (non‑tRPC events)

Sometimes you want to push a UI hint or refresh signal to all windows.

You can do that via `webContents.send`.

This is separate from tRPC and useful for one‑to‑many notifications.

```ts
// electron/somewhere.ts
import { BrowserWindow } from 'electron';

function notifyAll(channel: string, payload: unknown): void {
    for (const win of BrowserWindow.getAllWindows()) {
        win.webContents.send(channel, payload);
    }
}
```

In the renderer, listen with `ipcRenderer.on` inside preload‑exposed helpers if you need it.

Keep using tRPC for request/response style calls.

---

## Pitfalls and tips

Use the same hardening for every window (`contextIsolation: true`, `nodeIntegration: false`).

Register the IPC handler before calling `loadURL` or `loadFile` so the renderer can call tRPC immediately.

If windows need different initial routes, use hash routes like `#/tools` with TanStack Router.

Do not share mutable global state across windows in the renderer.

If windows must share data, centralize it in the main process and expose it via tRPC procedures.

Add a strict CSP in production which already exists in `index.html`.

Relax CSP only in development if required by your dev server.

---

## What to change when you add a new window

Create the window in `electron/main.ts`.

Call `registerTrpcHandler(newWindow)` right after you construct it.

Load the URL or file for that window.

Optionally pass a per‑window `windowName` or `windowId` into the tRPC context.

That’s all you need.
