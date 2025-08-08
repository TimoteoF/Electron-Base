import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import electron from 'vite-plugin-electron/simple';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(() => ({
    plugins: [
        react(),
        tailwindcss(),
        electron({
            main: {
                entry: 'electron/main.ts',
            },
            preload: {
                input: path.join(__dirname, 'electron/preload/index.ts'),
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
