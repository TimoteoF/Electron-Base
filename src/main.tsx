import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createHashHistory, createRouter, RouterProvider } from '@tanstack/react-router';
import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';

import { routeTree } from './routeTree.gen';
import '@web/styles/index.css';

// Lazy load devtools to avoid pulling them into prod
const DevTools = import.meta.env.DEV ? lazy(() => import('@web/components/utils/devtools')) : null;

const queryClient = new QueryClient();
const router = createRouter({ routeTree, history: createHashHistory() });

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            {DevTools ? (
                <Suspense fallback={null}>
                    <DevTools router={router} />
                </Suspense>
            ) : null}
        </QueryClientProvider>
    </StrictMode>
);
