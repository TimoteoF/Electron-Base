import { BrowserWindow } from 'electron';
import { createIPCHandler } from 'electron-trpc-experimental/main';
import { appRouter } from '@app/backend/router';
import { createCallerContext } from '@app/backend/ctx';

export function registerTrpcHandler(win: BrowserWindow): void {
    createIPCHandler({
        router: appRouter,
        windows: [win],
        createContext: () => createCallerContext(),
    });
}
