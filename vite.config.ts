import {defineConfig} from 'vite'
import tailwindcss from '@tailwindcss/vite'
import {visualizer} from 'rollup-plugin-visualizer';
import path from 'path';
import copy from 'rollup-plugin-copy';

export default defineConfig({
    plugins: [
        tailwindcss(),

        visualizer({
            filename: 'stats.html',
            open: false, // Automatically open the report
            gzipSize: true, // Show gzipped sizes
            brotliSize: true, // Show brotli sizes
            template: 'treemap' // Use treemap visualization (options: sunburst, treemap, network)
        }),

        copy({
            targets: [
                {
                    src: path.resolve(__dirname, 'node_modules/@shoelace-style/shoelace/dist/assets/*/*'),
                    dest: path.resolve(__dirname,'dist/assets/icons'),
                }
            ],
            hook: 'writeBundle',
        }),
    ],

    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    charts: [
                        'highcharts',
                        'highcharts/modules/exporting.js',
                        'highcharts/modules/accessibility.js',
                        'highcharts/modules/offline-exporting.js',
                    ],
                    lit: [
                        '@lit/reactive-element',
                        'lit-html',
                    ],
                    shoelace: ['@shoelace-style/shoelace/dist/shoelace.js'],
                },
            },
        },
    },

    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            }
        }
    }
})
