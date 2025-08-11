import { initTRPC } from '@trpc/server';

import { osRouter } from '@app/backend/routers/os';

import type { CallerContext } from '@app/backend/ctx';

const t = initTRPC.context<CallerContext>().create();

export const appRouter = t.router({
    os: osRouter,
});

export type AppRouter = typeof appRouter;
