# Electron + Vite + React + TypeScript + tRPC (IPC)

> A minimal, secure, and typed Electron template using Vite + React on the renderer, and tRPC over IPC for backend calls.

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite&logoColor=white) ![Electron](https://img.shields.io/badge/Electron-37.x-47848F?logo=electron&logoColor=white) ![tRPC](https://img.shields.io/badge/tRPC-11.x-398CCB)

---

## Quickstart

```bash
pnpm install
pnpm dev     # start Vite and Electron (plugin handles main/preload)
pnpm build   # build renderer and package Windows installer
```

> [!NOTE]
> If pnpm blocks Electron's postinstall on a fresh machine, run:
> `pnpm approve-builds`.

---

## What’s inside

-   Renderer: React + Vite (HMR)
-   Main: Electron `BrowserWindow` with secure defaults
-   Preload: minimal bridge exposing `window.trpc.invoke({ path, input })`
-   Backend: tRPC over IPC
    -   `electron/backend/functions/*`: Node/secret logic
    -   `electron/backend/routers/*`: tRPC procedures (thin, call functions)
    -   `electron/backend/router.ts`: compose domain routers → `appRouter`
    -   `electron/backend/ipcTrpc.ts`: single IPC handler (dynamic dispatch)
    -   `electron/backend/ctx.ts`: per‑call context (kept empty; extend when needed)

> [!IMPORTANT]
> Security: `contextIsolation: true`, `nodeIntegration: false`. Only a minimal, typed surface is exposed via preload.

---

## How it flows

Renderer → `trpc` client → `window.trpc.invoke` (preload) → `ipcMain.handle('trpc:invoke')` → `appRouter` procedure → result → Renderer.

---

## Add a new backend feature (domain)

> Example: `user.profile` (read-only profile)

1. Create backend function

-   File: `electron/backend/functions/user.ts` (or in a subfolder, if multiple files are needed)

```ts
export async function getProfile() {
    return { id: 'u_1', name: 'Ada' };
}
```

2. Expose via a router

-   File: `electron/backend/routers/user.ts`

```ts
import { initTRPC } from '@trpc/server';
import type { CallerContext } from '../ctx';
import { getProfile } from '../functions/user';

const t = initTRPC.context<CallerContext>().create();

export const userRouter = t.router({
    profile: t.procedure.query(() => getProfile()),
});
```

3. Mount the domain router

-   File: `electron/backend/router.ts`

```ts
import { initTRPC } from '@trpc/server';
import type { CallerContext } from './ctx';
import { osRouter } from './routers/os';
import { userRouter } from './routers/user';

const t = initTRPC.context<CallerContext>().create();

export const appRouter = t.router({
    os: osRouter,
    user: userRouter,
});
export type AppRouter = typeof appRouter;
```

4. Call it from the renderer

-   In any component/file:

```ts
import { trpc } from './src/lib/trpcClient';

const profile = await trpc.user.profile.query();
// That basically mirrors trpc.router.attribute.query()
```

> [!TIP]
> Need input validation? Add [ArkType](https://arktype.io/):
>
> ```ts
> import { type } from 'arktype';
>
> const UpdateNameInput = type({ name: 'string>0' });
>
> export const userRouter = t.router({
>     updateName: t.procedure.input((raw) => UpdateNameInput.assert(raw)).mutation(({ input }) => saveName(input.name)),
> });
> ```

---

## Files you typically don’t touch when adding features

-   `electron/preload/index.ts` — the bridge (fixed)
-   `electron/backend/ipcTrpc.ts` — generic dynamic dispatch
-   `electron/main.ts` — window/bootstrap

Only touch:

-   `electron/backend/functions/<domain>.ts`
-   `electron/backend/routers/<domain>.ts`
-   `electron/backend/router.ts` (only when adding a brand‑new domain)

---

## Packaging

-   Config: `electron-builder.json5`
-   Build Windows installer:

```bash
pnpm build
```

> [!NOTE]
> Default Electron icon is used if you don’t provide icons. To customize, drop `icon.ico`/`icon.icns`/`icon.png` at project root per config.

---

## Why tRPC over IPC

-   Single source of truth: router types infer the client
-   Secure: no HTTP server, no Node in renderer
-   Minimal surface: one `window.trpc.invoke` bridge
-   Scales by domain: add functions → expose via routers → mount → use

---

## Troubleshooting

-   Preload path mismatch (white screen / undefined `window.trpc`)
    -   Ensure `electron/main.ts` uses `preload: path.join(__dirname, 'index.mjs')`.
-   Electron postinstall blocked by pnpm
    -   Run `pnpm approve-builds electron`.
-   Installer icon not applied
    -   Provide root-level icons or update `electron-builder.json5` paths.
