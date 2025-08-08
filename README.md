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

> [!TIP]
> Skim this to see what you get out of the box.

-   Renderer.
    -   React + Vite with instant HMR.
    -   React 19 with the React Compiler enabled.
-   Main + Preload.
    -   Hardened `BrowserWindow` defaults.
    -   Tiny preload that only exposes `window.trpc.invoke({ path, input })`.
-   Backend (tRPC over IPC).
    -   End‑to‑end types with zero HTTP server.
    -   One IPC handler with dynamic dispatch.
    -   A per‑call context you can extend when needed.
-   DX & UI.
    -   React Query for fetching and caching.
    -   TailwindCSS v4 for utility‑first styling.
    -   TanStack Router for file‑based routing.
    -   Import aliases `@web/*` and `@app/*` keep imports clean.
    -   React Icons included for convenient icons.
-   Packaging & updates.
    -   `electron-builder.json5` is ready, and `pnpm build` creates a Windows installer.
    -   Auto‑update is supported with `electron-updater` (see `auto-update.md`).

> [!NOTE]
> Where things live.

-   `electron/backend/functions/*` holds Node‑only logic.
-   `electron/backend/routers/*` exposes thin tRPC procedures.
-   `electron/backend/router.ts` composes domain routers into `appRouter`.
-   `electron/backend/ipcTrpc.ts` handles all `ipcMain.handle('trpc:invoke')` calls.
-   `electron/backend/ctx.ts` defines the request context.

---

## React Query (renderer)

This template uses React Query to call tRPC procedures and render from cached data.

Provider (already set up in `src/main.tsx`):

```ts
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
        {/* Your routed app is rendered via RouterProvider */}
        {/* Components can use useQuery + tRPC calls */}
    </QueryClientProvider>
);
```

Usage example (in a component):

```ts
import { useQuery } from '@tanstack/react-query';
import { trpc } from '@web/lib/trpcClient';

const { data, refetch } = useQuery({
    queryKey: ['osInfo'],
    queryFn: () => trpc.os.getInfo.query(),
    // That basically mirrors trpc.router.attribute.query()
    staleTime: Infinity,
});
```

---

## TailwindCSS

This template uses TailwindCSS v4 for styling.

---

## Import Aliases

-   `@web/*` → `src/*`
-   `@app/*` → `electron/*`

Configured in `vite.config.ts` (resolve.alias) and TypeScript paths.
Use them to avoid long relative imports.

---

## React Icons

React Icons is included for convenient icon usage across the app.
Import any pack/icon you need:

```ts
import { VscServer } from 'react-icons/vsc';
import { FaMicrochip } from 'react-icons/fa6';
```

No special setup required.

---

## React Compiler

This template enables the React Compiler through the React plugin's Babel configuration in `vite.config.ts`.
It targets React 19 semantics and works out of the box with React 19.
If you run into issues with third‑party libraries, you can temporarily disable the compiler by removing the Babel plugin entry.

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

-   `electron/preload.ts` — the bridge (fixed)
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

## Distribution Artifacts (what to ship)

After a build, artifacts are written to `release/<version>/`.

-   **Windows**: ship the NSIS installer `.exe` (named like `Electron Base-Windows-<version>-Setup.exe`).
-   **macOS**: ship the `.dmg` (if configured in `mac.target`).
-   **Linux**: ship the `.AppImage` (and/or `.deb` if configured).

> [!IMPORTANT]
> Do NOT distribute any `*-unpacked/` folders, nor `dist/` or `dist-electron/`. Those are for local testing only.

---

## Why tRPC over IPC

-   Single source of truth: router types infer the client
-   Secure: no HTTP server, no Node in renderer
-   Minimal surface: one `window.trpc.invoke` bridge
-   Scales by domain: add functions → expose via routers → mount → use

---

## Troubleshooting

-   Preload path mismatch (white screen / undefined `window.trpc`)
    -   Ensure `electron/main.ts` uses `preload: path.join(__dirname, 'preload.mjs')` and `vite.config.ts` preload entry is `electron/preload.ts`.
-   Electron postinstall blocked by pnpm
    -   Run `pnpm approve-builds electron`.
-   Installer icon not applied
    -   Provide root-level icons or update `electron-builder.json5` paths.
