import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    css: {
        preprocessorOptions: {
            scss: {
                loadPaths: ['./src/scss'],
            },
        },
    },

    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@utils': path.resolve(__dirname, './src/utils'),
            '@components': path.resolve(__dirname, './src/components'),
            '@models': path.resolve(__dirname, './src/components/Models'),
            '@base': path.resolve(__dirname, './src/components/base'),
            '@types': path.resolve(__dirname, './src/types'),
        },
    },
});
