import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return defineConfig({
    // depending on your application, base can also be "/"
    base: ``,
    define: {
      'process.env': env,
    },
    css: {
      preprocessorOptions: {
        less: {
          math: "always",
          relativeUrls: true,
          javascriptEnabled: true,
        },
      },
    },
    plugins: [react()],
    server: {
      // this ensures that the browser opens upon server start
      open: true,
      host: true,
      // this sets a default port to 3000
      port: 3000,
      proxy:{
        '/api': {
          target: env.BASE_URL,
          changeOrigin: true,
        },
      }
    },
  })
}
