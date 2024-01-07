import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default ({ mode }) => {

  const env = loadEnv(mode, process.cwd())
  const { VITE_PORT } = env

  return defineConfig({
    base: '/',
    plugins: [react()],
    server: {
      port: +VITE_PORT || 3000,
    }
  })

}