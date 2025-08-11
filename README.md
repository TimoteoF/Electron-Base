# Electron + Vite + React + TypeScript + tRPC (IPC)

> A minimal, secure, and typed Electron template using Vite + React on the renderer, and tRPC over IPC for backend calls.

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite&logoColor=white)
![Electron](https://img.shields.io/badge/Electron-37.x-47848F?logo=electron&logoColor=white)
![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=white)
![tRPC](https://img.shields.io/badge/tRPC-11.x-398CCB?logo=trpc&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack%20Query-5.x-FF4154?logo=react-query&logoColor=white)
![TanStack Router](https://img.shields.io/badge/TanStack%20Router-1.x-FF4154?logo=react-router&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-9.x-4B32C3?logo=eslint&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?logo=tailwindcss&logoColor=white)

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

### Renderer

    -   React + Vite with instant HMR.
    -   React 19 with the React Compiler enabled.

### Main + Preload

    -   Hardened `BrowserWindow` defaults.
    -   Tiny preload that initializes the bridge via `exposeElectronTRPC()`.

### Backend (tRPC over IPC)

    -   End‑to‑end types with zero HTTP server.
    -   Powered by `electron-trpc-experimental` (preload bridge + `ipcLink` + `createIPCHandler`).
    -   Supports queries, mutations, subscriptions, and async‑generator streaming.
    -   A per‑call context you can extend when needed.

### DX & UI

    -   React Query for fetching and caching.
    -   TailwindCSS v4 for utility‑first styling.
    -   TanStack Router for file‑based routing.
    -   Import aliases `@web/*` and `@app/*` keep imports clean.
    -   React Icons included for convenient icons.

### Packaging & updates

    -   `electron-builder.json5` is ready, and `pnpm build` creates a Windows installer.
    -   Auto‑update is supported with `electron-updater` (see `auto-update.md`).

> [!NOTE]
> Where things live.

-   `electron/backend/functions/*` holds Node‑only logic.
-   `electron/backend/routers/*` exposes thin tRPC procedures.
-   `electron/backend/router.ts` composes domain routers into `appRouter`.
-   `electron/backend/ipcTrpc.ts` mounts the IPC handler via `createIPCHandler`.
-   `electron/backend/ctx.ts` defines the request context.
-   `electron/preload.ts` initializes the renderer bridge via `exposeElectronTRPC()`.
-   `electron/main.ts` creates the window and registers the IPC handler before load.
-   `src/lib/trpcClient.ts` configures the renderer client with `ipcLink()`.

---

## tRPC IPC library

This template uses `electron-trpc-experimental` for type‑safe IPC with tRPC.

It provides a clean separation across main, preload, and renderer with first‑class tRPC v11 support.

-   Link: [electron-trpc-experimental](https://github.com/makp0/electron-trpc-experimental)
-   Why this package.
    -   tRPC v11 compatible and actively maintained.
    -   Clearly separated `main` / `preload` / `renderer` entry points that match Electron’s security model.
    -   Built‑in `ipcLink` for the renderer and `createIPCHandler` for the main process.
    -   Supports queries, mutations, subscriptions, and async‑generator streaming for live data.
    -   Examples and docs that mirror real Electron setups.

### How it is wired here

-   Preload: `exposeElectronTRPC` initializes a minimal, safe bridge.

```ts
// electron/preload.ts
import { exposeElectronTRPC } from 'electron-trpc-experimental/preload';

process.once('loaded', () => {
    exposeElectronTRPC();
});
```

-   Main: `createIPCHandler` mounts the router and binds it to the window.

```ts
// electron/backend/ipcTrpc.ts
import { createIPCHandler } from 'electron-trpc-experimental/main';
import { appRouter } from '@app/backend/router';

createIPCHandler({ router: appRouter, windows: [win], createContext: () => ({}) });
```

-   Renderer: `ipcLink` connects the tRPC client to the preload bridge.

```ts
// src/lib/trpcClient.ts
import { createTRPCProxyClient } from '@trpc/client';
import { ipcLink } from 'electron-trpc-experimental/renderer';
import type { AppRouter } from '@app/backend/router';

export const trpc = createTRPCProxyClient<AppRouter>({ links: [ipcLink()] });
```

> [!NOTE]
> This package eliminates manual `ipcMain.handle` routing and any custom `window.trpc.invoke` shim while keeping the surface area minimal and secure.

---

## Why tRPC over IPC

-   Single source of truth: router types infer the client
-   Secure: no HTTP server, no Node in renderer
-   Minimal surface: package-provided bridge via `exposeElectronTRPC` + `ipcLink`
-   Scales by domain: add functions → expose via routers → mount → use

---

## How it flows

Renderer → `trpc` client with `ipcLink` → preload bridge via `exposeElectronTRPC` → main `createIPCHandler` with `appRouter` → result → Renderer.

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
import type { CallerContext } from '@app/backend/ctx';
import { getProfile } from '@app/backend/functions/user';

const t = initTRPC.context<CallerContext>().create();

export const userRouter = t.router({
    profile: t.procedure.query(() => getProfile()),
});
```

3. Mount the domain router

-   File: `electron/backend/router.ts`

```ts
import { initTRPC } from '@trpc/server';
import type { CallerContext } from '@app/backend/ctx';
import { osRouter } from '@app/backend/routers/os';
import { userRouter } from '@app/backend/routers/user';

const t = initTRPC.context<CallerContext>().create();

export const appRouter = t.router({
    os: osRouter,
    user: userRouter,
});
export type AppRouter = typeof appRouter;
```

4. Call it from the renderer

-   In a component using React Query:

```ts
import { useQuery } from '@tanstack/react-query';
import { trpc } from '@web/lib/trpcClient';

const { data: profile } = useQuery({
    queryKey: ['user.profile'],
    queryFn: () => trpc.user.profile.query(),
    staleTime: Infinity,
});
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

-   `electron/preload.ts` — the bridge (fixed, calls `exposeElectronTRPC`)
-   `electron/backend/ipcTrpc.ts` — IPC handler mounting (`createIPCHandler`)
-   `electron/main.ts` — window/bootstrap

Only touch:

-   `electron/backend/functions/<domain>.ts`
-   `electron/backend/routers/<domain>.ts`
-   `electron/backend/router.ts` (only when adding a brand‑new domain)

---

## Routing and history in Electron (TanStack Router)

The app uses TanStack Router with hash history.

-   ### Why hash history in Electron
    -   Electron loads `index.html` from a file URL or via the dev server. Hash history avoids server‑side route handling and 404s when the app is refreshed or a deep link is opened.
    -   It works reliably across dev and production without custom protocol handlers.
-   ### Where it’s configured
    -   `src/main.tsx` uses `createHashHistory()` when creating the router.

```ts
import { createHashHistory, createRouter } from '@tanstack/react-router';
import { routeTree } from '@web/routeTree.gen';

const router = createRouter({ routeTree, history: createHashHistory() });
```

> [!NOTE]
> You can switch to a custom history (e.g., file/protocol) later if you add deep‑linking via `app.setAsDefaultProtocolClient` and handle it in the main process.

---

## Import Aliases

-   `@web/*` → `src/*`
-   `@app/*` → `electron/*`

Configured in `vite.config.ts` (resolve.alias) and TypeScript paths.
Use them to avoid long relative imports. All code snippets in this README use these aliases, e.g.,

```ts
import { trpc } from '@web/lib/trpcClient';
import { appRouter } from '@app/backend/router';
```

---

## ESLint

This project uses ESLint’s modern flat config with type-aware, strict TypeScript rules and React best practices.

-   Config file: `eslint.config.js` (ESM flat config)
-   Highlights
    -   TypeScript: `@typescript-eslint` recommendedTypeChecked + strictTypeChecked
    -   React: `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`
    -   Accessibility: `eslint-plugin-jsx-a11y`
    -   Imports: `eslint-plugin-import` with ordering and newline rules
    -   Code quality: `eslint-plugin-unicorn`, `eslint-plugin-sonarjs`
    -   Electron: `eslint-plugin-electron` for security best practices
    -   Security: `eslint-plugin-security`, `eslint-plugin-no-secrets`

Run lint:

```bash
pnpm lint
```

---

## React Query (renderer)

This template uses React Query to call tRPC procedures and render from cached data.

### Provider (already set up in `src/main.tsx`)

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

### Usage example (in a component)

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

## Devtools (lazy‑loaded in development)

React Query Devtools and TanStack Router Devtools are loaded only in development to keep production bundles lean.

They are lazy‑imported and gated by `import.meta.env.DEV` in `src/main.tsx`.

```ts
// src/main.tsx
import { lazy, Suspense } from 'react';
const DevTools = import.meta.env.DEV ? lazy(() => import('@web/components/utils/devtools')) : null;

{
    DevTools ? (
        <Suspense fallback={null}>
            <DevTools router={router} />
        </Suspense>
    ) : null;
}
```

> [!TIP]
> This avoids bundling devtools in production while keeping them ergonomic in development.

---

## TailwindCSS

This template uses TailwindCSS v4 for styling.

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

## Troubleshooting

-   Preload path mismatch (bridge not initialized)
    -   Ensure `electron/main.ts` uses `preload: path.join(__dirname, 'preload.mjs')` and `vite.config.ts` preload entry is `electron/preload.ts`.
-   Electron postinstall blocked by pnpm
    -   Run `pnpm approve-builds electron`.
-   Installer icon not applied
    -   Provide root-level icons or update `electron-builder.json5` paths.
