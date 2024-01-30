/// <reference types="vitest" />
/// <reference types="vite/client" />

import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src/'),

      // Override packages
      // 1. Axios
      _axios: path.resolve(__dirname, 'node_modules/axios'),
      axios: path.resolve(__dirname, './src/packages-override/axios.ts'),

      // 2. React Router DOM
      '_react-router-dom': path.resolve(
        __dirname,
        'node_modules/react-router-dom'
      ),
      'react-router-dom': path.resolve(
        __dirname,
        './src/packages-override/react-router-dom.ts'
      ),

      // 3. Ionic React
      '_@ionic/react': path.resolve(__dirname, 'node_modules/@ionic/react'),
      '@ionic/react/css': path.resolve(
        __dirname,
        'node_modules/@ionic/react/css'
      ),
      '@ionic/react': path.resolve(
        __dirname,
        './src/packages-override/ionic.react.ts'
      ),
    },
  },
});
