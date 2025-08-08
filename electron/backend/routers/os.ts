import { initTRPC } from '@trpc/server';
import type { CallerContext } from '../ctx';
import { getOsStats } from '../functions/os/osStats';

const t = initTRPC.context<CallerContext>().create();

export const osRouter = t.router({
    getInfo: t.procedure.query(() => getOsStats()),
});
