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
