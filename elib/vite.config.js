import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'src',

  resolve: {
    alias: {
      '~bootstrap': resolve(__dirname, 'node_modules/bootstrap'),
    },
  },

  build: {
    outDir: '../dist',

    rollupOptions: {
      input: {
        index: 'index.html',
        book: 'book.html',
        login: 'login.html',
        register: 'register.html',
        sertificates: 'sertificates.html',
        user: 'user.html',
        admin: 'admin.html',
      },
      output: {
        entryFileNames: 'assets/js/[name].js',
        chunkFileNames: 'assets/js/[name].js',
        assetFileNames: assetInfo => {
          if (/\.(css|scss|sass)$/.test(assetInfo.name)) {
            return 'assets/css/[name][extname]';
          }
          return 'assets/[name][extname]';
        },
      },
    },
  },
});
