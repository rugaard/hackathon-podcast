import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue';
import vueMacros from 'unplugin-vue-macros/vite';
import defineOptions from 'unplugin-vue-define-options/vite';
import manifestSRI from 'vite-plugin-manifest-sri';

export default defineConfig({
  plugins: [
    vueMacros({
      plugins: {
        vue: vue({
          template: {
            transformAssetUrls: {
              base: null,
              includeAbsolute: false,
            },
          },
        }),
      },
    }),
    defineOptions(),
    manifestSRI(),
  ],
  resolve: {
    alias: {
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@composables': fileURLToPath(new URL('./src/composables', import.meta.url)),
      '@plugins': fileURLToPath(new URL('./src/plugins', import.meta.url)),
      '@views': fileURLToPath(new URL('./src/views', import.meta.url)),
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    cors: {
      allowedHeaders: ['Authorization', 'Content-Type', 'User-Agent']
    }
  }
})
