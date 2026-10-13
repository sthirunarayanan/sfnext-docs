import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/** @see {@link https://vite.dev/config/} */
export default defineConfig({
    base: '/sfnext-docs/',
    plugins: [react(), tailwindcss()],
    server: {
        port: 5174,
    },
});

