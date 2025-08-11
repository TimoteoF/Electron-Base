import { BrowserWindow } from 'electron';
import { createIPCHandler } from 'electron-trpc-experimental/main';

import { createCallerContext } from '@app/backend/ctx';
import { appRouter } from '@app/backend/router';

export function registerTrpcHandler(win: BrowserWindow): void {
    createIPCHandler({
        router: appRouter,
        windows: [win],
        createContext: () => createCallerContext(),
    });
}
