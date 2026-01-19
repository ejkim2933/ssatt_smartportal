import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 🔽 이 부분이 "하얀 화면"을 고쳐주는 핵심 치료제입니다!
  define: {
    'process.env': {}
  }
})
