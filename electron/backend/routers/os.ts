import { initTRPC } from '@trpc/server';
import type { CallerContext } from '../ctx';
import { getOsInfo } from '../functions/os';

const t = initTRPC.context<CallerContext>().create();

export const osRouter = t.router({
    getInfo: t.procedure.query(() => getOsInfo()),
});
