import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 🔽 여기가 핵심! 브라우저가 process나 global 단어를 봐도 당황하지 않게 만듭니다.
  define: {
    'process.env': {},
    'global': 'window',
  }
})
