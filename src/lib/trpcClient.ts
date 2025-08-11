import { createTRPCProxyClient } from '@trpc/client';
import { ipcLink } from 'electron-trpc-experimental/renderer';
import type { AppRouter } from '@app/backend/router';

export const trpc = createTRPCProxyClient<AppRouter>({ links: [ipcLink()] });
