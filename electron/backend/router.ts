import { initTRPC } from '@trpc/server';
import type { CallerContext } from './ctx';
import { osRouter } from './routers/os';

const t = initTRPC.context<CallerContext>().create();

export const appRouter = t.router({
    os: osRouter,
});

export type AppRouter = typeof appRouter;
