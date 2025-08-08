import { useQuery } from '@tanstack/react-query';
import { FaMicrochip } from 'react-icons/fa6';
import { IoReload } from 'react-icons/io5';
import { VscGlobe, VscServer, VscServerProcess, VscVersions, VscVm, VscWatch } from 'react-icons/vsc';
import { trpc } from '@web/lib/trpcClient';

function formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

function formatUptime(seconds: number): string {
    if (seconds < 60) return `${Math.floor(seconds)}s`;
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    let result = '';
    if (d > 0) result += `${d}d `;
    if (h > 0) result += `${h}h `;
    if (m > 0) result += `${m}m`;
    return result.trim();
}

export default function App() {
    const { data, refetch } = useQuery({
        queryKey: ['osInfo'],
        queryFn: () => trpc.os.getInfo.query(),
        staleTime: Infinity,
    });

    return (
        <main className='min-h-screen w-full bg-slate-900 flex flex-col items-center justify-center p-6 text-slate-100'>
            <div className='relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl shadow-blue-500/10 backdrop-blur-md'>
                <button
                    onClick={() => void refetch()}
                    className='absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:bg-slate-800 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500'
                    aria-label='Refetch OS Information'>
                    <IoReload className='h-5 w-5' />
                </button>

                <div className='text-center'>
                    <h1 className='bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-4xl font-bold text-transparent'>
                        System Information
                    </h1>
                    <p className='mt-2 text-slate-400'>Real-time data from the underlying operating system.</p>
                </div>

                <div className='mt-8 space-y-4'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center text-slate-300'>
                            <VscGlobe className='mr-3 h-5 w-5 text-cyan-400' />
                            <span>Hostname</span>
                        </div>
                        <span className='font-mono text-slate-400'>{data?.hostname}</span>
                    </div>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center text-slate-300'>
                            <VscServerProcess className='mr-3 h-5 w-5 text-cyan-400' />
                            <span>OS Type</span>
                        </div>
                        <span className='font-mono text-slate-400'>{data?.type}</span>
                    </div>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center text-slate-300'>
                            <FaMicrochip className='mr-3 h-5 w-5 text-cyan-400' />
                            <span>Architecture</span>
                        </div>
                        <span className='font-mono text-slate-400'>{data?.arch}</span>
                    </div>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center text-slate-300'>
                            <VscServer className='mr-3 h-5 w-5 text-cyan-400' />
                            <span>Platform</span>
                        </div>
                        <span className='font-mono text-slate-400'>{data?.platform}</span>
                    </div>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center text-slate-300'>
                            <VscVersions className='mr-3 h-5 w-5 text-cyan-400' />
                            <span>Release</span>
                        </div>
                        <span className='font-mono text-slate-400'>{data?.release}</span>
                    </div>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center text-slate-300'>
                            <VscVm className='mr-3 h-5 w-5 text-cyan-400' />
                            <span>Memory</span>
                        </div>
                        <span className='font-mono text-slate-400'>
                            {data?.totalmem && data?.freemem
                                ? `${formatBytes(data.totalmem - data.freemem)} / ${formatBytes(data.totalmem)} (${Math.round(
                                      ((data.totalmem - data.freemem) / data.totalmem) * 100
                                  )}%)`
                                : ''}
                        </span>
                    </div>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center text-slate-300'>
                            <VscWatch className='mr-3 h-5 w-5 text-cyan-400' />
                            <span>Uptime</span>
                        </div>
                        <span className='font-mono text-slate-400'>{data?.uptime ? formatUptime(data.uptime) : ''}</span>
                    </div>
                </div>
            </div>
        </main>
    );
}
