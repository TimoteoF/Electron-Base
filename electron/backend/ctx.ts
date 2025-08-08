/**
 * tRPC caller context (kept empty for now).
 *
 * Add fields later if you need per-call data (e.g., windowId, user, db, logger).
 */
export type CallerContext = {};

/**
 * Build the context for each IPC → tRPC call.
 * Extend to include request-scoped info when needed.
 */
export async function createCallerContext(): Promise<CallerContext> {
    return {};
}
