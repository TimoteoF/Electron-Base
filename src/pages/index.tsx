import {
    VscCode,
    VscExtensions,
    VscPackage,
    VscPlug,
    VscRocket,
    VscServer,
    VscSymbolClass,
    VscTerminal,
} from 'react-icons/vsc';

import type { IconType } from 'react-icons';

const keyFiles = [
    { path: 'electron/main.ts', desc: 'Main process entry point' },
    { path: 'electron/preload.ts', desc: 'Preload script with tRPC bridge' },
    { path: 'electron/backend/trpc/*', desc: 'tRPC router & procedures' },
    { path: 'src/main.tsx', desc: 'Renderer entry point' },
    { path: 'src/router.ts', desc: 'TanStack Router config' },
    { path: 'src/lib/providers/*', desc: 'React Query & tRPC providers' },
];

interface StackItem {
    name: string;
    desc: string;
    icon: IconType;
}

const stackItems: StackItem[] = [
    { name: 'TanStack Router', desc: 'File-based routing with hash history', icon: VscSymbolClass },
    { name: 'TanStack Query', desc: 'Data fetching & caching', icon: VscServer },
    { name: 'TanStack Form', desc: 'Performant form state management', icon: VscCode },
    { name: 'TanStack Virtual', desc: 'Virtualized lists for large datasets', icon: VscExtensions },
    { name: 'tRPC + IPC', desc: 'Type-safe main↔renderer communication', icon: VscPlug },
    { name: 'TailwindCSS', desc: 'Utility-first styling', icon: VscRocket },
];

const suggestedPackages = [
    {
        category: 'State Management',
        gradient: 'from-electric-500 to-neon-500',
        items: [
            { name: 'Zustand', url: 'https://zustand.docs.pmnd.rs/', desc: 'Lightweight state management' },
            { name: 'Jotai', url: 'https://jotai.org/', desc: 'Atomic state management' },
            { name: 'Immer', url: 'https://immerjs.github.io/immer/', desc: 'Immutable state updates' },
        ],
    },
    {
        category: 'Backend / Database',
        gradient: 'from-mint-500 to-electric-500',
        items: [{ name: 'Convex', url: 'https://convex.dev/', desc: 'Reactive backend with real-time sync' }],
    },
    {
        category: 'Validation',
        gradient: 'from-coral-500 to-neon-500',
        items: [
            { name: 'ArkType', url: 'https://arktype.io/', desc: 'TypeScript-first schema validation' },
            { name: 'Zod', url: 'https://zod.dev/', desc: 'Schema validation with broad ecosystem' },
        ],
    },
];

const steps = [
    { cmd: 'pnpm dev', desc: 'Start the development server' },
    { path: 'electron/backend/trpc/routers/', desc: 'Add tRPC procedures' },
    { path: 'src/routes/', desc: 'Create new routes (auto-generated)' },
    { cmd: 'pnpm build', desc: 'Build for production' },
];

export default function HomePage() {
    return (
        <div className='bg-obsidian-950 font-display relative min-h-screen overflow-hidden text-white'>
            {/* Animated background */}
            <div className='pointer-events-none absolute inset-0'>
                {/* Main gradient orbs */}
                <div className='animate-pulse-glow bg-electric-500/20 absolute -top-40 -left-40 h-96 w-96 rounded-full blur-3xl' />
                <div className='animate-pulse-glow bg-neon-500/20 absolute top-1/3 -right-32 h-80 w-80 rounded-full blur-3xl delay-700' />
                <div className='animate-pulse-glow bg-mint-500/15 absolute -bottom-20 left-1/3 h-72 w-72 rounded-full blur-3xl delay-300' />

                {/* Grid pattern overlay */}
                <div
                    className='absolute inset-0 opacity-[0.03]'
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: '60px 60px',
                    }}
                />
            </div>

            {/* Content */}
            <div className='relative z-10 mx-auto max-w-6xl px-6 py-16 lg:py-24'>
                {/* Hero Section */}
                <header className='mb-24 text-center'>
                    <div className='animate-slide-up mb-8 flex items-center justify-center'>
                        <div className='animate-float relative'>
                            <div className='from-electric-500 to-neon-500 absolute inset-0 rounded-2xl bg-linear-to-br opacity-60 blur-xl' />
                            <div className='glass-card relative rounded-2xl p-5'>
                                <VscTerminal className='h-14 w-14 text-white' />
                            </div>
                        </div>
                    </div>

                    <h1 className='animate-slide-up mb-6 text-5xl font-extrabold tracking-tight delay-100 lg:text-7xl'>
                        <span className='text-gradient-electric'>Electron + Vite</span>
                        <br />
                        <span className='text-white/90'>React Template</span>
                    </h1>

                    <p className='animate-slide-up mx-auto max-w-2xl text-lg leading-relaxed text-white/60 delay-200 lg:text-xl'>
                        A modern, type-safe desktop app starter with <span className='text-electric-400'>tRPC IPC</span>
                        , <span className='text-neon-400'>TanStack ecosystem</span>, and{' '}
                        <span className='text-mint-400'>TailwindCSS</span>.
                    </p>

                    {/* Tech badges */}
                    <div className='animate-slide-up mt-10 flex flex-wrap items-center justify-center gap-3 delay-300'>
                        {['TypeScript 5.x', 'Vite 7.x', 'Electron 39.x', 'React 19.x', 'tRPC 11.x'].map((tech, i) => (
                            <span
                                key={tech}
                                className='glass-card rounded-full px-4 py-1.5 text-sm font-medium text-white/70 transition-colors hover:text-white'
                                style={{ animationDelay: `${String(300 + i * 50)}ms` }}>
                                {tech}
                            </span>
                        ))}
                    </div>
                </header>

                {/* Stack Overview */}
                <section className='animate-slide-up mb-24 delay-400'>
                    <div className='mb-10 flex items-center gap-4'>
                        <div className='from-electric-500 to-neon-500 flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br'>
                            <VscExtensions className='h-5 w-5 text-white' />
                        </div>
                        <h2 className='text-2xl font-bold text-white'>Stack Overview</h2>
                    </div>

                    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                        {stackItems.map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={item.name}
                                    className='glass-card glass-card-hover group rounded-2xl p-6'
                                    style={{ animationDelay: `${String(400 + i * 100)}ms` }}>
                                    <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-white/10 to-white/5 transition-transform group-hover:scale-110'>
                                        <Icon className='text-electric-400 h-6 w-6' />
                                    </div>
                                    <h3 className='mb-2 text-lg font-semibold text-white'>{item.name}</h3>
                                    <p className='text-sm leading-relaxed text-white/50'>{item.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Suggested Packages */}
                <section className='animate-slide-up mb-24 delay-500'>
                    <div className='mb-10 flex items-center gap-4'>
                        <div className='from-neon-500 to-coral-500 flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br'>
                            <VscPackage className='h-5 w-5 text-white' />
                        </div>
                        <h2 className='text-2xl font-bold text-white'>Recommended Additions</h2>
                    </div>

                    <div className='grid gap-6 lg:grid-cols-3'>
                        {suggestedPackages.map((category) => (
                            <div key={category.category} className='glass-card rounded-2xl p-6'>
                                <div
                                    className={`mb-4 inline-block rounded-lg bg-linear-to-r ${category.gradient} px-3 py-1 text-xs font-semibold tracking-wider text-white uppercase`}>
                                    {category.category}
                                </div>
                                <div className='space-y-3'>
                                    {category.items.map((pkg) => (
                                        <a
                                            key={pkg.name}
                                            href={pkg.url}
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            className='group block rounded-xl bg-white/5 p-4 transition-all hover:bg-white/10'>
                                            <div className='flex items-center justify-between'>
                                                <span className='group-hover:text-electric-400 font-semibold text-white'>
                                                    {pkg.name}
                                                </span>
                                                <span className='text-white/30 transition-transform group-hover:translate-x-1'>
                                                    →
                                                </span>
                                            </div>
                                            <p className='mt-1 text-sm text-white/40'>{pkg.desc}</p>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Key Files */}
                <section className='animate-slide-up mb-24 delay-600'>
                    <div className='mb-10 flex items-center gap-4'>
                        <div className='from-mint-500 to-electric-500 flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br'>
                            <VscCode className='h-5 w-5 text-white' />
                        </div>
                        <h2 className='text-2xl font-bold text-white'>Key Files</h2>
                    </div>

                    <div className='glass-card overflow-hidden rounded-2xl'>
                        <div className='border-b border-white/10 bg-white/5 px-6 py-3'>
                            <div className='flex gap-2'>
                                <div className='bg-coral-500/80 h-3 w-3 rounded-full' />
                                <div className='h-3 w-3 rounded-full bg-yellow-500/80' />
                                <div className='bg-mint-500/80 h-3 w-3 rounded-full' />
                            </div>
                        </div>
                        <div className='divide-y divide-white/5'>
                            {keyFiles.map((file) => (
                                <div
                                    key={file.path}
                                    className='group flex items-center justify-between px-6 py-4 transition-colors hover:bg-white/5'>
                                    <code className='text-mint-400 group-hover:text-mint-300 font-mono text-sm'>
                                        {file.path}
                                    </code>
                                    <span className='text-sm text-white/40'>{file.desc}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Getting Started */}
                <section className='animate-slide-up mb-24 delay-700'>
                    <div className='mb-10 flex items-center gap-4'>
                        <div className='from-coral-500 to-neon-500 flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br'>
                            <VscRocket className='h-5 w-5 text-white' />
                        </div>
                        <h2 className='text-2xl font-bold text-white'>Getting Started</h2>
                    </div>

                    <div className='glass-card rounded-2xl p-8'>
                        <div className='space-y-6'>
                            {steps.map((step, i) => (
                                <div key={i} className='flex items-start gap-6'>
                                    <div className='from-electric-500/20 to-neon-500/20 text-electric-400 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br text-lg font-bold'>
                                        {i + 1}
                                    </div>
                                    <div className='flex-1 pt-1.5'>
                                        <p className='text-white/80'>
                                            {step.desc}
                                            {step.cmd && (
                                                <code className='bg-obsidian-800 text-electric-400 ml-3 rounded-lg px-3 py-1.5 font-mono text-sm'>
                                                    {step.cmd}
                                                </code>
                                            )}
                                            {step.path && (
                                                <code className='bg-obsidian-800 text-mint-400 ml-3 rounded-lg px-3 py-1.5 font-mono text-sm'>
                                                    {step.path}
                                                </code>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className='animate-slide-up border-t border-white/10 pt-12 text-center delay-800'>
                    <p className='text-sm text-white/40'>
                        Edit{' '}
                        <code className='rounded bg-white/5 px-2 py-1 font-mono text-white/60'>
                            src/pages/index.tsx
                        </code>{' '}
                        to customize this page.
                    </p>
                    <div className='mt-6 flex items-center justify-center gap-1 text-xs text-white/30'>
                        <span>Built with</span>
                        <span className='text-coral-400'>♥</span>
                        <span>using Electron, Vite & React</span>
                    </div>
                </footer>
            </div>
        </div>
    );
}
