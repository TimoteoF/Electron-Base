import { ipcMain } from 'electron';
import { appRouter } from './router.ts';
import { createCallerContext } from './ctx.ts';

export function registerTrpcHandler(): void {
    ipcMain.handle('trpc:invoke', async (_event, op: { path: string; input: unknown }) => {
        const caller = appRouter.createCaller(await createCallerContext());
        const [ns, proc] = op.path.split('.');

        const domain: unknown = (caller as any)?.[ns];
        if (!domain || typeof domain !== 'object') {
            throw new Error(`Unknown tRPC domain: ${ns}`);
        }

        const fn: unknown = (domain as any)[proc];
        if (typeof fn !== 'function') {
            throw new Error(`Unknown tRPC path: ${op.path}`);
        }

        return await (fn as (input: unknown) => Promise<unknown>)(op.input);
    });
}
