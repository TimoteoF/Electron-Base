import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import electron from 'vite-plugin-electron/simple';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        tanstackRouter({
            target: 'react',
            autoCodeSplitting: true,
        }),

        react({
            babel: {
                plugins: [['babel-plugin-react-compiler']],
            },
        }),
        tailwindcss(),
        electron({
            main: {
                entry: 'electron/main.ts',
                vite: {
                    resolve: {
                        alias: {
                            '@/app': path.resolve(__dirname, 'electron'),
                            '@/web': path.resolve(__dirname, 'src'),
                        },
                    },
                },
            },
            preload: {
                input: 'electron/preload.ts',
            },
        }),
    ],
    resolve: {
        alias: {
            '@/app': path.resolve(__dirname, 'electron'),
            '@/web': path.resolve(__dirname, 'src'),
        },
    },
});
