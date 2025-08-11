import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';
import electron from 'vite-plugin-electron/simple';

// https://vite.dev/config/
export default defineConfig(() => ({
    plugins: [
        tanstackRouter({ target: 'react' }),
        react({
            babel: {
                plugins: [['babel-plugin-react-compiler', { target: '19' }]],
            },
        }),
        tailwindcss(),
        electron({
            main: {
                entry: 'electron/main.ts',
                vite: {
                    resolve: {
                        alias: {
                            '@app': path.resolve(__dirname, 'electron'),
                            '@web': path.resolve(__dirname, 'src'),
                        },
                    },
                },
            },
            preload: {
                input: path.join(__dirname, 'electron/preload.ts'),
                vite: {
                    resolve: {
                        alias: {
                            '@app': path.resolve(__dirname, 'electron'),
                            '@web': path.resolve(__dirname, 'src'),
                        },
                    },
                },
            },
        }),
    ],
    resolve: {
        alias: {
            '@app': path.resolve(__dirname, 'electron'),
            '@web': path.resolve(__dirname, 'src'),
        },
    },
}));
