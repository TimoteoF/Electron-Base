import { initTRPC } from '@trpc/server';
import type { CallerContext } from '@app/backend/ctx';
import { getOsStats } from '@app/backend/functions/os/osStats';

const t = initTRPC.context<CallerContext>().create();

export const osRouter = t.router({
    getInfo: t.procedure.query(() => getOsStats()),
});
