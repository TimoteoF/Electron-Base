import { ipcMain } from 'electron';
import { appRouter } from './router.ts';
import { createCallerContext } from './ctx.ts';

export function registerTrpcHandler(): void {
    ipcMain.handle('trpc:invoke', async (_event, op: { path: string; input: unknown }) => {
        const caller = appRouter.createCaller(await createCallerContext());
        const fn = op.path.split('.').reduce<any>((acc, key) => (acc ? (acc as any)[key] : undefined), caller);
        if (typeof fn !== 'function') throw new Error(`Unknown tRPC path: ${op.path}`);
        return await (fn as (input: unknown) => Promise<unknown>)(op.input);
    });
}
