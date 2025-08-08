import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import type { AnyRouter } from '@tanstack/react-router';

export interface DevToolsProps {
    router: AnyRouter;
}

export default function DevTools({ router }: DevToolsProps) {
    return (
        <>
            <ReactQueryDevtools initialIsOpen={false} buttonPosition='bottom-right' />
            <TanStackRouterDevtools router={router} position='bottom-left' />
        </>
    );
}
