import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import electron from 'vite-plugin-electron/simple';

// https://vite.dev/config/
export default defineConfig(() => ({
    plugins: [
        react(),
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
