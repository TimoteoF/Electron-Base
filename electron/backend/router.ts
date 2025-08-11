import { initTRPC } from '@trpc/server';
import type { CallerContext } from '@app/backend/ctx';
import { osRouter } from '@app/backend/routers/os';

const t = initTRPC.context<CallerContext>().create();

export const appRouter = t.router({
    os: osRouter,
});

export type AppRouter = typeof appRouter;
