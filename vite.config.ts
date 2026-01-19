import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // 빌드 중 에러가 나도 멈추지 않도록 설정 (안전장치)
    chunkSizeWarningLimit: 1600,
  }
})
