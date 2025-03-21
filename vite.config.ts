import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    tailwindcss(),

    visualizer({
      filename: 'stats.html',
      open: false, // Automatically open the report
      gzipSize: true, // Show gzipped sizes
      brotliSize: true, // Show brotli sizes
      template: 'treemap' // Use treemap visualization (options: sunburst, treemap, network)
    })
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
