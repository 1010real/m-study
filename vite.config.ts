import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Relative base so the build works both at the domain root and under a
// GitHub Pages project subpath (e.g. https://<user>.github.io/m-study/).
export default defineConfig({
  base: './',
  plugins: [react()],
})
