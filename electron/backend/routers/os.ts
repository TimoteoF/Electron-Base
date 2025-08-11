import { initTRPC } from '@trpc/server';

import { getOsStats } from '@app/backend/functions/os/osStats';

import type { CallerContext } from '@app/backend/ctx';

const t = initTRPC.context<CallerContext>().create();

export const osRouter = t.router({
    getInfo: t.procedure.query(() => getOsStats()),
});
