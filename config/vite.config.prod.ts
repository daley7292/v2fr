import { mergeConfig } from 'vite';
import baseConfig from './vite.config.base';
import configVisualizerPlugin from './plugin/visualizer';
import configArcoResolverPlugin from './plugin/arcoResolver';
import configImageminPlugin from './plugin/imagemin';

export default mergeConfig(
    {
        mode: 'production',
        plugins: [
            configVisualizerPlugin(),
            configArcoResolverPlugin(),
            configImageminPlugin(),
        ],
        build: {
            rollupOptions: {
                output: {
                    entryFileNames: 'assets/admin/[name].[hash].js',
                    chunkFileNames: 'assets/admin/[name].[hash].js',
                    assetFileNames: ({ name }) => {
                        if (name && name.endsWith('.css')) {
                            return 'assets/admin/[name].[hash][extname]';
                        }
                        return 'assets/admin/[name].[hash][extname]';
                    },
                    manualChunks: {
                        arco: ['@arco-design/web-vue'],
                        chart: ['echarts', 'vue-echarts'],
                        vue: ['vue', 'vue-router', 'pinia', '@vueuse/core', 'vue-i18n'],
                    },
                },
            },
            chunkSizeWarningLimit: 2000,
        },
    },
    baseConfig
);
