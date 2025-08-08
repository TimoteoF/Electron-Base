import { createTRPCProxyClient } from '@trpc/client';
import type { TRPCLink } from '@trpc/client';
import { observable } from '@trpc/server/observable';
import type { AppRouter } from '../../electron/backend/router';

type InvokeOp = { path: string; input: unknown };

// Bridge from preload
declare global {
    interface Window {
        trpc: { invoke<T>(op: InvokeOp): Promise<T> };
    }
}

const ipcLink: TRPCLink<AppRouter> = () => {
    return ({ op }) =>
        observable<unknown>((observer: any) => {
            if (op.type === 'subscription') {
                observer.error(new Error('Subscriptions are not supported over IPC'));
                return () => undefined;
            }
            window.trpc
                .invoke<unknown>({ path: op.path, input: op.input })
                .then((data) => {
                    observer.next({ result: { data } } as any);
                    observer.complete();
                })
                .catch((err) => observer.error(err));
            return () => undefined;
        });
};

export const trpc = createTRPCProxyClient<AppRouter>({ links: [ipcLink] });
