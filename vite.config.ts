import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import path from 'node:path';
import electron from 'vite-plugin-electron/simple';
import tailwindcss from '@tailwindcss/vite';

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
            },
            preload: {
                input: path.join(__dirname, 'electron/preload.ts'),
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
