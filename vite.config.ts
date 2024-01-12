import path from "path"
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  const env = loadEnv(mode, process.cwd())
  const { VITE_PORT } = env

  return defineConfig({
    base: '/',
    plugins: [react()],
    server: {
      port: +VITE_PORT || 3000,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  })

}