import os from 'node:os';

export type OsStats = {
    platform: NodeJS.Platform;
    arch: string;
    release: string;
    hostname: string;
    type: string;
    totalmem: number;
    freemem: number;
    uptime: number;
};

export function getOsStats(): OsStats {
    return {
        platform: os.platform(),
        arch: os.arch(),
        release: os.release(),
        hostname: os.hostname(),
        type: os.type(),
        totalmem: os.totalmem(),
        freemem: os.freemem(),
        uptime: os.uptime(),
    };
}
